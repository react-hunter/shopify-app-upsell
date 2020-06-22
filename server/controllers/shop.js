const Shop = require('../models/Shop');
const PartnerCode = require('../models/PartnerCode');
const shopifyScriptTags = require('../lib/shopifyScriptTags');
const reportEvent = require('../lib/reportEvent');
const BigBear = require('../lib/bigBear');
const { getShopStatusByCreationDate } = require('../lib/helper');
const calculateRemainDays = require('../lib/calculateRemainDays');
const { defaultTrialDays } = require('../config');

module.exports = {

  'find->->public': () => {
    return Shop.find({});
  },

  'enable->post': async (ctx) => {
    const shopOrigin = ctx.session.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }
    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      reportEvent(shopOrigin, 'error', { value: 'shop_not_found_enable_app' });
      throw new Error('404:Not Found');
    }
    if (shop.isActive) {
      //state issue --> store is marked as enabled in the DB. need to remove scripts if there are any and enable the app...
      try{
        await shopifyScriptTags.remove(shopOrigin, shop.accessToken);
      } catch{
        //do nothing.
      }     
    }
    try {
      await shopifyScriptTags.add(shopOrigin, shop.accessToken);
      shop.isActive = true;
      shop.isActiveManual = true;
      await shop.save();
      reportEvent(shopOrigin, 'server_enable_app');
      BigBear.updateShop({shopify_domain: shopOrigin, origin_app: 'upsell', is_active: true});
      return {};
    } catch (error) {
      console.log('error', error);
      reportEvent(shopOrigin, 'error', { value: error.message });
      throw new Error(`400:${error.message}`);
    }
  },

  'disable->post': async (ctx) => {
    const shopOrigin = ctx.session.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }
    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      reportEvent(shopOrigin, 'error', { value: 'shop_not_found_disable_app' });
      throw new Error('404:Not Found');

    }
    if (!shop.isActive) {
      //
    }

    try {
      await shopifyScriptTags.remove(shopOrigin, shop.accessToken);
      shop.isActive = false;
      shop.isActiveManual = false;
      await shop.save();
      reportEvent(shopOrigin, 'server_disable_app');
      BigBear.updateShop({shopify_domain: shopOrigin, origin_app: 'upsell', is_active: false});
      return {};
    } catch (error) {
      console.log('error', error);
      throw new Error(error.message);
    }
  },

  'current->get': async (ctx) => {
    const shop = await Shop.findOne({
      shopify_domain: ctx.session.shop || ctx.session.shopOrigin,
    });
    console.log("shop", shop)
    if (shop) {
      // logic for the premium plans notice
      const shopStatus = getShopStatusByCreationDate(shop.createdAt);

      let trialDaysMax = defaultTrialDays;
      let partnerCodeData;
      if (!shop.pricingPlan && ctx.cookies.get('partnerCode')) {
        partnerCodeData = await PartnerCode.findOne({ code: ctx.cookies.get('partnerCode'), isActive: true });
        if (partnerCodeData) {
          trialDaysMax = partnerCodeData.trialDays;
        }
      }
      const trialDaysRemain = shop.pricingPlan && shop.pricingPlan !== 'Free'
        ? 0
        : await calculateRemainDays(ctx.session.shop, trialDaysMax);
      return {
        shopInformation: shop.shopInformation,
        shopStatus,
        unlimitedViews: shop.unlimitedViews,
        customViewsLimit: shop.customViewsLimit,
        customPrice: shop.customPrice,
        hasPartnerCode: Boolean(partnerCodeData),
        trialDaysRemain,
      };
    } else {
      reportEvent(ctx.shop, 'error', { value: 'could not fetch shop details' });
      throw new Error(`400:couldn't fetch shop details for ${shop}`);
    }
  },

};
