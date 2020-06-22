const moment = require('moment');
const Shop = require('../models/Shop');
const shopifyScriptTags = require('../lib/shopifyScriptTags');
const { pricing } = require('../config');
const getViews = require('./getViews');
const sendEmail = require('./sendEmail');
const reportEvent = require('../lib/reportEvent');

module.exports = async function checkOverLimit(shopOrShopName) {
  const shop = typeof shopOrShopName === 'string' ? await Shop.findOne({ shopify_domain: shopOrShopName }) : shopOrShopName;

  if (!shop) {
    return;
  }

  if (!shop.pricingPlan || shop.unlimitedViews) {
    return;
  }
  let needsToUpdate = false;
  if (!shop.periodStartedAt) {
    shop.periodStartedAt = shop.createdAt;
    shop.periodRenewAt = moment(shop.createdAt).add(30, 'days').toDate();
    needsToUpdate = true;
  }

  if (moment().diff(moment(shop.periodStartedAt), 'days') >= 30) {
    shop.periodStartedAt = moment(shop.periodStartedAt).add(30, 'days').toDate();
    shop.periodRenewAt = moment(shop.periodStartedAt).add(30, 'days').toDate();
    needsToUpdate = true;
  }

  const pricingPlan = shop.pricingPlan || 'Free';
  const limit = shop.customViewsLimit || // probaby better to check if pricingPlan === 'Custom' as well
    (pricing.find((item) => item.name === pricingPlan) || { limit: 100 }).limit;
  const views = await getViews({
    shopId: shop._id,
    dateStart: shop.periodStartedAt,
    dateFinish: new Date(),
    pricingPlan: shop.pricingPlan,
    shopOrigin: shop.shopify_domain,
  });

  const sentEmailAfter = shop.sentEmailAfter;
  if (limit <= views) {
    shop.overLimit = true;
    if (shop.isActive) {
      await shopifyScriptTags.remove(shop.shopify_domain, shop.accessToken);
      shop.isActive = false;
    }
    needsToUpdate = true;
  } else if (shop.overLimit) {
    if (!shop.isActive && shop.isActiveManual) {
      await shopifyScriptTags.add(shop.shopify_domain, shop.accessToken);
    }
    shop.overLimit = false;
    shop.isActive = shop.isActiveManual;
    shop.sentEmailAfter = 0;
    needsToUpdate = true;
  }

  function probablySendEmail(point) {
    if (point > sentEmailAfter) {
      if (shop.shopInformation && shop.shopInformation.email) {
        let emailTemplateId;
        const isOnFreePlan = (shop.pricingPlan === 'Free');
        switch (point) {
          case 75:
            emailTemplateId = isOnFreePlan ? 
            "d-0a81e22043d84fa39c6fc8afc0d04798" //[Upsell] Views Usage [1/4] 
            : "d-205f0966e7b34e9486e00697f0a52557"; //[Upsell] Views Premium Usage [1/4]
            break;
          case 90:
            emailTemplateId = isOnFreePlan ? 
            "d-0e3a1701feb74b199bfc9fc1c82f2e9f" //[Upsell] Views Usage [2/4] 
            : "d-e1722e9a2290482a8c9e478a4849024d"; //[Upsell] Views Premium Usage [2/4]
            break;
          case 100:
            emailTemplateId = isOnFreePlan ? 
            "d-81fe839ba57d40f988d93b13da588604" : //[Upsell] Views Usage [3/4] 
            "d-e1981c61436549569b2b84bf8bb061d6"; //[Upsell] Views Premium Usage [3/3]
            //TODO add to sequence email in the future - 48 later
            break;
          default:
            return;
            break;
        }

        try{
          sendEmail({
            email: shop.shopInformation.email,
            templateId: emailTemplateId,
            dynamicData: {
              view_percentage: `${point}%`,
              shopify_domain: shop.shopify_domain,
              shop_name: shop.shopInformation.name,
            },
            sender: {
              name: "Jonathan from Conversion Bear",
              email: "jonathan@conversionbear.com",
            },
          }); //notify about quata
        } catch(e){
          console.log("probablySendEmail --> error:", e);
        }

      }
      shop.sentEmailAfter = point;
    }
  }

  const viewsPerc = views / limit * 100;
  if (viewsPerc >= 100) {
    probablySendEmail(100);
    reportEvent(shop.shopify_domain, 'views_quota_reached', {value: 100});
  } else if (viewsPerc >= 90) {
    probablySendEmail(90);
    reportEvent(shop.shopify_domain, 'views_quota_reached', {value: 90});
  } else if (viewsPerc >= 75) {
    probablySendEmail(75);
    reportEvent(shop.shopify_domain, 'views_quota_reached', {value: 75});
  } else if (viewsPerc >= 50) {
    // probablySendEmail(50);
  }

  if (needsToUpdate) {
    await shop.save();
  }

};
