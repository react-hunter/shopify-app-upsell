const _ = require("lodash");
const Settings = require("../models/Settings");
const Shop = require("../models/Shop");
const AppSpec = require("../models/AppSpec");
const { fetchShopDetails } = require("../lib/helper");
const purgeSettingsCache = require('../lib/purgeSettingsCache');

module.exports = {
  "->get->public": async (ctx) => {
    const shopOrigin = ctx.query.shop || ctx.session.shop;
    if (!shopOrigin) {
      return {message: 'shop is missing'};
    }
    const settings = await Settings.findOne({ shopify_domain: shopOrigin });
    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if(!shop || !settings){
      throw new Error("404:not found");
    }
    const premiumEnabledDoc = await AppSpec.findOne({ key: "premiumEnabled" });
    const updateShopInformation = ctx.query.updateShopInformation;

    let shopInformation = shop.shopInformation;
    if (updateShopInformation) {
      try {
        shopInformation = await fetchShopDetails(shopOrigin, shop.accessToken);
        await Shop.updateOne(
          { _id: shop._id },
          {
            shopInformation,
          }
        );
      } catch (error) {
        console.log("TCL: error", error);
      }
    }

    try {
      if (settings) {
        let plainSettings = _.omit(settings.toObject(), ['__v', '_id']);

        if (shop) {
          plainSettings.isActive = shop.isActive;
          plainSettings.subscriptionIsNotOk =
            premiumEnabledDoc &&
            premiumEnabledDoc.value &&
            !shop.premiumForFree &&
            !shop.premiumPaid;
          plainSettings.paymentConfirmationUrl = shop.paymentConfirmationUrl;
          plainSettings.pricingPlan = shop.pricingPlan;
          plainSettings.periodStartedAt = shop.periodStartedAt;
          plainSettings.periodRenewAt = shop.periodRenewAt;
          plainSettings.overLimit = shop.overLimit;
          plainSettings.showBranding = shop.pricingPlan === 'Free';
          if (shopInformation) {
            plainSettings.default_money_format = shopInformation.money_format;
            plainSettings.default_currency = shopInformation.currency;
          }
        }

        if (!ctx.session.shop) { //omit sensitive data
          plainSettings = _.omit(plainSettings, [
            "paymentConfirmationUrl",
            "periodRenewAt",
            "periodStartedAt",
            "pricingPlan",
            "shopId",
            "is_recieved_expert_review",
            "is_recieved_expert_review",
            "is_created_first_campaign",
            "bar_notice_hidden",
            "bar_notice_dashboard_hidden",
            "displayUpgradeModal",
          ]);
        }

        return plainSettings;
      } else {
        throw new Error('404:not found');
      }
    } catch (e) {
      console.log(`error in settings->get->public": ${e}`);
    }

  },

  "->post": async (ctx) => {
    try {
      const shopOrigin = ctx.session.shop;
      if (!shopOrigin) {
        throw new Error("403:Forbidden");
      }
      const body = ctx.request.body;
      await Settings.updateOne(
        { shopify_domain: shopOrigin },
        _.omit(body, ["shopId", "shopify_domain","has_active_pre_purchase_funnels"])
      );
      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (
        shop &&
        shop.shopInformation &&
        shop.shopInformation.domain
      ) {
        purgeSettingsCache(shopOrigin, shop.shopInformation.domain);
      }
      return {};
    } catch (e) {
      console.log(`error in setSettings: ${e}`);
      throw e;
    }
  },
};
