const url = require('url');
const moment = require('moment');
const { apiVersion, pricing, defaultTrialDays } = require('./config');
const Shop = require('./models/Shop');
const ShopInstall = require('./models/ShopInstall');
const Settings = require('./models/Settings');
const PartnerCode = require('./models/PartnerCode');
const reportEvent = require('./lib/reportEvent');
const sendEmail = require('./lib/sendEmail');
const { getShopStatusByCreationDate } = require('./lib/helper');
const BigBear = require('./lib/bigBear');

async function processPayment(ctx, next) {
  if (ctx.query.charge_id) {
    const chargeUrl = `admin/api/${apiVersion}/recurring_application_charges`;
    const options = {
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': ctx.session.accessToken,
        'Content-Type': 'application/json',
      },
    };
    const optionsWithGet = { ...options, method: 'GET' };
    const optionsWithPost = { ...options, method: 'POST' };
    try {
      const chargeData = await fetch(
        `https://${ctx.session.shop}/${chargeUrl}/${ctx.query.charge_id}.json`,
        optionsWithGet,
      ).then((response) => response.json());
      if (chargeData.recurring_application_charge.status === 'accepted') {
        // const stringifyMyJSON = JSON.stringify(myJson);*
        // const optionsWithJSON = { ...optionsWithPost, body: stringifyMyJSON };
        try {
          await fetch(`https://${ctx.session.shop}/${chargeUrl}/${ctx.query.charge_id}/activate.json`, optionsWithPost)
            .then((response) => response.json());
          const shop = await Shop.findOne({ shopify_domain: ctx.session.shop });
          const extraShopData = {
            customViewsLimit: null,
            customPrice: null,
            unlimitedViews: false,
          };

          if (shop) {
            const oldPlanIndex = pricing.findIndex((item) => item.name === shop.pricingPlan);
            let newPlanIndex = pricing.findIndex((item) => item.name === chargeData.recurring_application_charge.name);

            if (ctx.query.code) {
              const partnerCodeData = await PartnerCode.findOne({ code: ctx.query.code, isActive: true });
              if (partnerCodeData) {
                newPlanIndex = 1000;
                extraShopData.partnerCode = partnerCodeData.code;
                if (partnerCodeData.price) {
                  extraShopData.pricingPlan = partnerCodeData.name;
                  extraShopData.unlimitedViews = Boolean(partnerCodeData.unlimitedViews);
                  extraShopData.customPrice = chargeData.recurring_application_charge.price;
                  extraShopData.customViewsLimit = partnerCodeData.viewsLimit || (pricing[0] && pricing[0].limit) || 0;
                }
              }
            }

            if (chargeData.recurring_application_charge.name === 'Partner Plan') {
              const shopStatus = getShopStatusByCreationDate(shop.createdAt);
              if (shopStatus === 'veteran') {
                // newPlanIndex = veteranPlan;
                extraShopData.pricingPlan = 'Partner Plan';
                extraShopData.unlimitedViews = true;
                extraShopData.customPrice = chargeData.recurring_application_charge.price;
                extraShopData.periodStartedAt = new Date();
                extraShopData.periodRenewAt = moment().add(30, 'days').toDate();
                newPlanIndex = 1000;
              }
              if (shopStatus === 'early') {
                // newPlanIndex = earlyPlan;
                extraShopData.pricingPlan = 'Partner Plan';
                extraShopData.unlimitedViews = true;
                extraShopData.customPrice = chargeData.recurring_application_charge.price;
                extraShopData.periodStartedAt = new Date();
                extraShopData.periodRenewAt = moment().add(30, 'days').toDate();
                newPlanIndex = 1000;
              }
            }

            if (newPlanIndex > oldPlanIndex) { // upgrade
              try {
                await Settings.updateOne({ shopify_domain: ctx.session.shop }, { displayUpgradeModal: true });

                // SEND EMAILS - user already chose a plan in the past
                if (shop && shop.shopInformation && chargeData.recurring_application_charge.name) {
                  if (oldPlanIndex > -1) {
                    if (shop.pricingPlan === 'Free') { // [Upsell] Free to Premium
                      sendEmail({email: shop.shopInformation.email, templateId: "d-4038769e2ac14b81b0e096932efc6199", dynamicData: {plan_name: chargeData.recurring_application_charge.name}, sender:{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"}});
                    } else { // [Upsell] Premium Upgrade
                      sendEmail({email: shop.shopInformation.email, templateId: "d-6ab39fa9d3ca40e1a19e96c50859f27b", dynamicData: {plan_name: chargeData.recurring_application_charge.name}, sender:{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"}});
                    }
                  } else if (shop.pricingPlan === null) { // upgrade from nothing state
                    sendEmail({email: shop.shopInformation.email, templateId: "d-4038769e2ac14b81b0e096932efc6199", dynamicData: {plan_name: chargeData.recurring_application_charge.name}, sender:{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"}});
                  }
                }
              } catch (error) {
                console.log('error', error);
              }
            } else if (newPlanIndex < oldPlanIndex) {
              // send "Premium Downgrade to another premium plan" email here [Upsell] Premium Downgrade
              sendEmail({email: shop.shopInformation.email, templateId: "d-8d4a3bc50cd74779b15e5ae856065678", dynamicData: {plan_name: chargeData.recurring_application_charge.name}, sender:{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"}});
            }
          }
          try {
            await Shop.updateOne({ shopify_domain: ctx.session.shop }, {
              pricingPlan: chargeData.recurring_application_charge.name,
              overLimit: false,
              periodStartedAt: new Date(),
              periodRenewAt: moment().add(30, 'days').toDate(),
              sentEmailAfter: 0,
              ...extraShopData,
            });
            BigBear.updateShop({
              shopify_domain: ctx.session.shop,
              origin_app: "upsell",
              cb_plan: chargeData.recurring_application_charge.name,
            });
            reportEvent(ctx.session.shop, 'track-premium_upgrade', {plan: chargeData.recurring_application_charge.name});
            sendEmail({
              email: 'lynda@conversionbear.com', 
              templateId: 'd-eece0387e4b0469ab16c57352f69eb49', 
              dynamicData: {
                ...shop.shopInformation, 
                selected_plan: chargeData.recurring_application_charge.name,
              user_since: shop.createdAt
            }
              });
          } catch (error) {
            console.log('error', error);
          }

          const trialDays = typeof chargeData.recurring_application_charge.trial_days === 'number'
            ? chargeData.recurring_application_charge.trial_days : defaultTrialDays;
          try {
            const shopInstall = await ShopInstall.findOne({ shopify_domain: ctx.session.shop });
            if (!shopInstall) {
              await ShopInstall.create({
                shopify_domain: ctx.session.shop,
                trialStartedAt: new Date(),
                trialDays,
              });
            } else {
              await ShopInstall.updateOne({
                shopify_domain: ctx.session.shop,
              }, {
                trialStartedAt: new Date(),
                trialDays,
                cancelledAt: null,
              });
            }
          } catch (error) {
            console.log('error', error);
          }

        } catch (error) {
          console.log('error', error);
        }
      } else {
        return ctx.redirect('/');
      }
    } catch (err) {
      console.log('err', err);
    }
    return ctx.redirect('/');
  } else {
    await next();
  }
}

/**
 * BAD SESSION KILLER
 * For cases when shop tries to re-install us.
 * ref to solution hack: https://github.com/Shopify/quilt/issues/727
 */
async function badSessionKillerReInstall(ctx, _next) {
  if (ctx.request.header.cookie) {
    if (
      (ctx.request.url.split('?')[0] === '/' &&
        ctx.request.querystring.split('&') &&
        ctx.request.querystring.split('&')[0].split('=')[0] === 'hmac' &&
        ctx.request.querystring.split('&')[1].split('=')[0] !== 'locale') ||
      (ctx.request.url.split('?')[0] === '/auth/callback' &&
        ctx.request.querystring.split('&') &&
        ctx.request.querystring.split('&')[1].split('=')[0] === 'hmac')
    ) {
      console.log(
        `Killing bad session: url: ${ctx.request.url}, cookie: ${ctx.request.header.cookie}`,
      );
      reportEvent(
        ctx.request.header.cookie.shopOrigin,
        'bad_session_killed',
        { value: 'reinstall' },
      );
      ctx.request.header.cookie = ctx.request.header.cookie
        .split(' ')
        .filter(
          (item) =>
            ['koa:sess', 'koa:sess.sig'].indexOf(item.split('=')[0]) === -1,
        )
        .join(' ');
    }
  }
  await _next();
}

/**
 * BAD SESSION KILLER
 * Case there's a bad session kill it and redirect to auth flow
 */
async function badSessionKillerRedirect(ctx, next) {
  const { shop: shopOrigin } = ctx.session;

  const queryData = url.parse(ctx.request.url, true);
  const requestPath = ctx.request.url;
  if (
    shopOrigin &&
    queryData.query.shop &&
    shopOrigin !== queryData.query.shop
  ) {
    if (!requestPath.match(/^\/script|^\/product/g)) {
      console.debug('🎤 Dropping invalid session');
      ctx.session.shopOrigin = null;
      ctx.session.accessToken = null;
      reportEvent(shopOrigin, 'bad_session_killed', {
        value: 'multiple_shops',
        secondShop: queryData.query.shop,
      });
      ctx.redirect('/auth');
    }
  }
  await next();
}

module.exports = {
  processPayment,
  badSessionKillerReInstall,
  badSessionKillerRedirect,
};
