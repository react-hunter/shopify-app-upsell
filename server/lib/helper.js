const Shop = require('../models/Shop');
const Settings = require('../models/Settings');
const Campaigns = require('../models/Campaigns');
const Orders = require('../models/Orders');
const ShopInstall = require('../models/ShopInstall');
const AppSpec = require('../models/AppSpec');
const ObjectId = require("mongoose").Types.ObjectId;
const sendEmail = require("./sendEmail");
const BigBear = require('./bigBear');
const getViews = require('./getViews');

const {
  apiVersion,
} = require('../config');

const reportEvent = require('./reportEvent');

async function uninstallShop(shop) {
  try {
    const queriedShop = await Shop.findOne({
      shopify_domain: shop,
    });

    let periodStartedAt = null;
    let views = 0;
    if (queriedShop) {
      if (queriedShop.shopInformation) {
        sendEmail({
          email: queriedShop.shopInformation.email,
          templateId: "d-db72089684f74475b8447385cb7610b4",
          dynamicData: { shop_name: queriedShop.shopInformation.name, }
      })
      }

      periodStartedAt = queriedShop.periodStartedAt || queriedShop.createdAt;
      if (queriedShop.pricingPlan === 'Free') {
        views = await getViews({
          shopId: queriedShop._id,
          dateStart: periodStartedAt,
          dateFinish: new Date(),
          pricingPlan: queriedShop.pricingPlan,
          shopOrigin: shop,
        });
      }
    } else {
      return {
        status: `${shop} doesn't exist`,
      };
    }
    console.debug(`❌ deleting shop: ${shop}`);
    const deleteShopResult = await Shop.deleteOne({
      shopify_domain: shop,
    });
    console.debug(`❌ deleting settings for shop: ${shop}, data: ${JSON.stringify(deleteShopResult)}`);

    const deleteSettingsResult = await Settings.deleteOne({
      shopify_domain: shop,
    });

    console.debug(`❌ deleting views data for shop: ${shop}, data: ${JSON.stringify(deleteShopResult)}`);
    const deleteOrdersResult = await Orders.deleteMany({
      shopId: new ObjectId(queriedShop._id)
    });
    console.debug(`❌ deleting campaign data for shop: ${shop}, data: ${JSON.stringify(deleteShopResult)}`);
    const deleteCampaignsResult = await Campaigns.deleteMany({
      shopId: new ObjectId(queriedShop._id)
    });

    if(deleteOrdersResult && deleteCampaignsResult && deleteSettingsResult && deleteShopResult){
      console.debug(`🙌 succesfuly uninstalled upsell app for ${shop}, data: ${JSON.stringify(deleteSettingsResult)}`);
      reportEvent(shop, 'uninstall');
    } else {
      reportEvent(shop, 'uninstall', 'bad-uninstall');
    }

    BigBear.uninstallShop({ shopify_domain: shop, origin_app: 'upsell' });

    try {
      await ShopInstall.updateOne(
        {
          shopify_domain: shop,
        },
        {
          cancelledAt: new Date(),
          periodStartedAt,
          views,
        },
      );
    } catch (e) {
      //
    }


    return {
      status: `succesfully deleted widget for shop: ${shop}`,
    };

    
  } catch (error) {
    console.debug(`faced an error when uninstalling app from: ${shop}, error: ${error}`);
    reportEvent(shop, 'error', { value: 'uninstall', message: error.message });
    throw new Error(`couldn't uninstall: ${shop}, ${error.message}`);
  }
}

async function fetchShopDetails(shopOrigin, accessToken) {
  if (!shopOrigin || !accessToken) {
    console.log('Can\'t fetch shop information because shopOrigin/accessToken params are missing/bad');
    throw new Error('401:Unauthorized');
  }
  try {
    const response = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/shop.json`, {
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    const jsonData = await response.json();
    if (!jsonData) {
      console.debug(`no data was received for: ${shopOrigin}`);
      throw new Error('404:Not found');
    }
    return jsonData.shop;
  } catch (error) {
    reportEvent(shopOrigin, 'error', { value: 'error when fetching for shop details' });
    console.debug(`error when fetching for shop: ${shopOrigin}. error information: ${error}`);
    throw new Error(error.message);
  }
}

async function requireSessionRefresh(ctx) {
  const shopOrigin = ctx.session.shop;
  console.log(`session endpoint triggered for: ${shopOrigin}`);
  if (!shopOrigin) {
    ctx.status = 403;
    return {};
  }
  const shop = await Shop.findOne({ shopify_domain: shopOrigin });
  console.log(`session endpoint for shop: ${shopOrigin}`);

  if (shop) {
    console.log(`session endpoint for shop creation date: ${shop.createdAt}`);
    if (shop.createdAt < new Date('08-22-2019')) {
      console.log(`this store requires a session refresh: ${shopOrigin}`);
      return { requires_session_refresh: true };
    } else {
      console.log(`this store doesn't requires a session refresh: ${shopOrigin}`);
      return { requires_session_refresh: false };
    }
  }

}

async function enablePremium() {
  const premiumEnabledDoc = await AppSpec.findOne({
    key: 'premiumEnabled',
  });
  if (premiumEnabledDoc && !premiumEnabledDoc.value) {
    premiumEnabledDoc.value = true;
    await premiumEnabledDoc.save();
    await Shop.updateMany({}, { premiumForFree: true });
    const shops = await Shop.find({}, { shopify_domain: 1 });
    await ShopInstall.deleteMany({});
    await ShopInstall.insertMany(shops.map((shop) => ({ shopify_domain: shop.shopify_domain, premiumForFree: true })));
  }
}

async function processSubscriptionUpdate(shop, status) {

  if (!['ACCEPTED', 'ACTIVE'].includes(status)) {
    await Shop.updateOne({ shopify_domain: shop }, { premiumPaid: false });
  }
  if (status === 'ACTIVE') {
    await Shop.updateOne({ shopify_domain: shop }, { premiumPaid: true });
  }

}

async function processShopUpdate(ctx) {
  try {
    const shopifyDomain = ctx.state.webhook.domain;
    const shopInformation = ctx.request.body;
    if (shopifyDomain && shopInformation) {
      const shop = await Shop.findOne({ shopify_domain: shopifyDomain });
      if (!shop) {
        reportEvent(shopifyDomain, "error", {
          value: "shop_not_found_process_update_shop",
        });
        return;
      }

      shop.shopInformation = shopInformation;
      let savedShop = await shop.save();

      if (savedShop) {
        BigBear.updateShop({shopify_domain: shopifyDomain, shop_information: shopInformation, origin_app: 'upsell'});
      }
      
    }
  } catch (err) {
    console.debug(
      `faced an error when updating shop info for: ${shopifyDomain}, error: ${error}`
    );
return;
  }
}

function getShopStatusByCreationDate(createdAt) {
  let shopStatus = 'veteran';
  if (createdAt > new Date('2020-04-24') && createdAt < new Date('2020-05-22')) {
    shopStatus = 'early';
  } else if (createdAt > new Date('2020-05-22')) {
    shopStatus = 'new';
  }
  return shopStatus;
}

module.exports = {
  uninstallShop,
  fetchShopDetails,
  requireSessionRefresh,
  enablePremium,
  processSubscriptionUpdate,
  processShopUpdate,
  getShopStatusByCreationDate,
};
