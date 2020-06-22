const { registerWebhook } = require("@shopify/koa-shopify-webhooks");
const moment = require("moment");
const Shop = require("../models/Shop");
const Settings = require("../models/Settings");
const ShopInstall = require("../models/ShopInstall");
// const AppSpec = require("../models/AppSpec");

const { apiVersion, tunnelUrl } = require("../config");
const getThemeColors = require("./getThemeColors");
// const createCharge = require("./createCharge");
const createAppSubscriptionsWebhook = require("./createAppSubscriptionsWebhook");
const sendEmail = require("./sendEmail");
const reportEvent = require("./reportEvent");
const { fetchShopDetails } = require("./helper");
// const calculateRemainDays = require("./calculateRemainDays");
const BigBear = require("./bigBear");
// const { addSubscriberToUninstalledList } = require('./emailSubscriptions');
// const getThemeColors = require("./server/lib/getThemeColors");

async function afterAuth(ctx) {
  const { shop: shopOrigin, accessToken } = ctx.session;
  ctx.cookies.set("shopOrigin", shopOrigin, {
    secure: true,
    sameSite: "none",
    httpOnly: false
  });

  const redirectUrl = "/";

  let shop = await Shop.findOne({
    shopify_domain: shopOrigin
  });
  if (!shop) {
    const shopInformation = await fetchShopDetails(shopOrigin, accessToken);
    shop = new Shop({
      shopify_domain: shopOrigin,
      accessToken,
      isActive: false,
      shopInformation,
      periodStartedAt: moment().toDate(),
      periodRenewAt: moment().add(30, 'days').toDate(),
    });
    const savedShop = await shop.save();

    const theme_colors = await getThemeColors({
      shopOrigin,
      apiVersion,
      shop
    });

    await new Settings({
      shopId: savedShop._id,
      shopify_domain: shopOrigin,
      theme_colors
    }).save();
    //install welcome email, moving to persona emails
    sendEmail({
      email: shopInformation.email,
      templateId:  "d-b2490eadfa7a4528b7067117ba729102",
      dynamicData: {shop_name: shopInformation.name}
    });
    sendEmail({
      email: "lynda+upsell@conversionbear.com",
      templateId: "d-a734387f146a426db6653cabd0663195",
      dynamicData: {shop_name: shopInformation.name,
        shopify_domain: shopInformation.myshopify_domain,
        email: shopInformation.email,
        shopify_plan: shopInformation.plan_name,
        country: shopInformation.country
      }
    })

    // // EMAIL SEQUENCE - START
    // const welcomeEmailSequenceUnsubsubcribeGroup = 14080;
    // // 1. trigger first email in the sequence 
    // sendEmail(shopInformation.email, "d-a2906b7bbc6347b7992cbb71ff8ac53d", {shopify_domain: shopInformation.myshopify_domain}, 
    // welcomeEmailSequenceUnsubsubcribeGroup,moment().add(2, "hours").unix(),['upsell','sequence'],{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"});
    //     // 2. trigger second email in the sequence 
    //     sendEmail(shopInformation.email, "d-c977bae5d4f543d692d7b194ebf61a18", {shopify_domain: shopInformation.myshopify_domain}, 
    //     welcomeEmailSequenceUnsubsubcribeGroup,moment().add(26, "hours").unix(),['upsell','sequence'],{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"});
    //         // 3. trigger third email in the sequence 
    // sendEmail(shopInformation.email, "d-2f8bbf87682142eb8ec5adb2963ffc74", {shopify_domain: shopInformation.myshopify_domain}, 
    // welcomeEmailSequenceUnsubsubcribeGroup,moment().add(50, "hours").unix(),['upsell','sequence'],{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"});
    // // EMAIL SEQUENCE - END
    partnerCode = ctx.cookies.get('partnerCode');
    BigBear.addShop({
      shopify_domain: ctx.session.shop,
      shop_information: shopInformation,
      origin_app: "upsell",
      partner_code: partnerCode,
      access_token: accessToken,
    });

    reportEvent(ctx.session.shop, "install",{
      source: ctx.cookies.get("installationSource"),
      origin_app: ctx.cookies.get("sourceApp"),
    }, { partnerCode, ...shopInformation });
    
    const webhookRegistration = await registerWebhook({
      topic: "APP_UNINSTALLED",
      address: `${tunnelUrl}webhooks/uninstall`,
      format: "json",
      accessToken,
      shop: shopOrigin,
      apiVersion
    });
    if (webhookRegistration.success) {
      console.log("Successfully registered uninstall webhook");
    } else {
      console.log("Failed to register webhook", webhookRegistration.result);
    }

    const shopUpdateWebhookRegistration = await registerWebhook({
      topic: "SHOP_UPDATE",
      address: `${tunnelUrl}webhooks/shop-update`,
      format: "json",
      accessToken,
      shop: shopOrigin,
      apiVersion
    });
    if (shopUpdateWebhookRegistration.success) {
      console.log("Successfully registered shop update webhook");
    } else {
      console.log(
        "Failed to register shop update webhook",
        shopUpdateWebhookRegistration.result
      );
    }

    /*
    const premiumEnabledDoc = await AppSpec.findOne({
      key: "premiumEnabled"
    });
    */

    // TODO
    if (true || premiumEnabledDoc && premiumEnabledDoc.value) {
      const shopInstall = await ShopInstall.findOne({
        shopify_domain: shopOrigin,
      });
      if (!shopInstall) {
        await ShopInstall.create({ shopify_domain: shopOrigin });
      }
      // TODO
      if (shopInstall && shopInstall.premiumForFree && false) {
        savedShop.premiumForFree = true;
        await savedShop.save();
      } else {
        // const trialDays = await calculateRemainDays(shopOrigin);
        await createAppSubscriptionsWebhook(shopOrigin, accessToken);
        // const { id, confirmationURL } = await createCharge(
        //   shopOrigin,
        //   accessToken,
        //   trialDays,
        // );
        // if (id) {
        //   await Shop.updateOne(
        //     {
        //       shopify_domain: shopOrigin
        //     },
        //     {
        //       chargeId: id,
        //       paymentConfirmationUrl: confirmationURL,
        //       trialDays
        //     }
        //   );
        // }
      }
    }
  } else {
    // enter rule here:
    // console.log(`redirect to auth...`)
    // ctx.session.shopOrigin = null
    // ctx.session.accessToken = null
    // ctx.redirect('/auth')
    shop.accessToken = accessToken;
    await shop.save();
  }

  ctx.redirect(redirectUrl);
}

module.exports = afterAuth;
