const fs = require('fs');
const _ = require('lodash');
const Shop = require('../models/Shop');
const Settings = require('../models/Settings');
const Orders = require('../models/Orders');
const Campaigns = require('../models/Campaigns');
const {
  debugMode,
} = require('../config');
const prepareSCProposals = require('../lib/prepareSCProposals');
const getOrders = require('../lib/getOrders');
const getProducts = require('../lib/getProducts');
const reportEvent = require('../lib/reportEvent');
const purgeSettingsCache = require('../lib/purgeSettingsCache');

async function syncHasActivePrePurchaseFunnels(shopId, forceTrue, shop) {
  const has_active_pre_purchase_funnels = forceTrue ? forceTrue : Boolean(await Campaigns.findOne({ shopId, page_to_show: 'cart_page', isActive: true }));
  await Settings.updateOne({ shopId }, { has_active_pre_purchase_funnels });
  if (!shop) {
    shop = await Shop.findOne({ _id: shopId });
  }
  if (
    shop &&
    shop.shopify_domain &&
    shop.shopInformation &&
    shop.shopInformation.domain
  ) {
    purgeSettingsCache(shop.shopify_domain, shop.shopInformation.domain || shop.shopify_domain);
  }
}

module.exports = {
  find: async (ctx) => {
    const shopOrigin = ctx.session.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });

    if (!shop) {
      throw new Error('404:Not found');
    }

    let data = await Orders.aggregate([
      {
        $match: {
          shopId: shop._id,
        },
      },
      {
        $group: {
          _id: {
            campaign_id: '$campaign_id',
            order_id: '$order_init_id',
          },
          orders: {
            $sum: {
              $cond: [
                {
                  $ne: [
                    '$order_id', null,
                  ],
                }, 1, 0,
              ],
            },
          },
          total: {
            $sum: '$amount',
          },
          upsell_total: {
            $sum: '$upsell_amount',
          },
        },
      }, {
        $group: {
          _id: '$_id.campaign_id',
          unique_views: {
            $sum: 1,
          },
          orders: {
            $sum: '$orders',
          },
          total: {
            $sum: '$total',
          },
          upsell_total: {
            $sum: '$upsell_total',
          },
        },
      }, {
        $project: {
          _id: '$_id',
          unique_views: '$unique_views',
          orders: '$orders',
          total: '$total',
          upsell_total: '$upsell_total',
          conv: {
            $divide: [
              '$orders', '$unique_views',
            ],
          },
        },
      },
    ]);

    const campaigns = await Campaigns.find({ shopId: shop._id }).sort({ created_at: -1 }).lean();

    data = data.map((item) => {
      item._id = item._id.toString();
      return item;
    });

    return campaigns.map((campaign) => {
      campaign._id = campaign._id.toString();
      campaign.convertion = 0;
      campaign.total = 0;
      campaign.views = 0;

      const index = _.findIndex(data, ['_id', campaign._id]);

      if (~index) {
        campaign.convertion = data[index].conv * 100;
        campaign.total = data[index].upsell_total;
        campaign.views = data[index].unique_views;
      }

      return campaign;
    });
  },

  update: async (ctx) => {
    const body = ctx.request.body;
    const res = await Campaigns.findOneAndUpdate(
      { _id: body._id },
      _.omit(body, ['shopId']),
      { new: true },
    );
    await syncHasActivePrePurchaseFunnels(res.shopId);

    return res;
  },

  create: async (ctx) => {
    const body = ctx.request.body;

    const shopOrigin = ctx.session.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });

    if (!shop) {
      throw new Error('404:Not found');
    }
    reportEvent(shopOrigin, 'server-campaign_created');
    body.shopId = shop._id;
    const newCampaign = await Campaigns.create(body);
    console.log("body.page_to_show", body.page_to_show)
    if (body.page_to_show === 'cart_page') {
      console.log("syncHasActivePrePurchaseFunnels", shop._id, true, shop)
      await syncHasActivePrePurchaseFunnels(shop._id, true, shop);
    }
    return newCampaign;
  },

  destroy: async (ctx) => {
    const { id } = ctx.params || {};

    const shopOrigin = ctx.session.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });

    if (!shop) {
      throw new Error('404:Not found');
    }

    const campaign = await Campaigns.findOne({ _id: id });

    if (shop._id.toString() !== campaign.shopId.toString()) {
      throw new Error('403:Forbidden');
    }

    await Campaigns.deleteOne({ _id: id });
    await syncHasActivePrePurchaseFunnels(shop._id, false, shop);

    return true;

  },

  smart: async (ctx) => {
    try {
    const shopOrigin = ctx.session.shop || ctx.query.shop;
    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });

    if (!shop) {
      throw new Error('404:Not found');
    }

    let orders = [];
    let products = [];
    if (debugMode && false) {
      try {
        orders = JSON.parse(fs.readFileSync('./fixtures/orders.json'));
        products = JSON.parse(fs.readFileSync('./fixtures/products.json'));
      } catch (err) {
        console.log(err);
      }
    } else {
      orders = await getOrders({ shopOrigin, accessToken: shop.accessToken });
      products = await getProducts({ shopOrigin, accessToken: shop.accessToken });

      reportEvent(shopOrigin, 'server-smart-wizard-1',{orders: orders.length, products: products.length});
      console.log("campaign --> smart, orders.length:",orders.length);
      console.log("campaign --> smart, products.length:",products.length);
    }
    if (!Array.isArray(orders) || !Array.isArray(products)) {
      throw new Error('404:Not found');
    }
    let smart_products = await prepareSCProposals({ orders, products });
    console.log("campaign --> smart-smart_products-2:", smart_products.length);
    reportEvent(shopOrigin, 'server-smart-wizard-2',{smart_products: smart_products.length});

    let page_to_show = 'thankyou_page';

    const campaigns = await Campaigns.find({shopId: shop._id});

    const pages_to_show = [];

    campaigns.forEach((c) => {
      if (pages_to_show.indexOf(c.page_to_show) < 0 && c.page_to_show) {
        pages_to_show.push(c.page_to_show);
      }
    });

    const res = _.difference(['cart_page', 'thankyou_page'], pages_to_show);

    if (res.length) {
      page_to_show = res[0];
    }


    if (Array.isArray(smart_products)) {
      smart_products = smart_products.map((products) => {
        if (products && products[0]) {
          products[0].page_to_show = page_to_show;
        }
        return products;
      });
    }

    /*
    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': shop.accessToken,
        'Content-Type': 'application/json',
      },
    };

    const requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?published_status=published&limit=8`;

    const response = await fetch(
      requestUrl,
      options,
    );
    const result = await response.json();

    if (result && result.products) {
      smart_products = _.chunk(result.products, 2).filter((item) => item.length == 2);
    }
    */
    return smart_products;
  } catch (error) {
    console.log("campaign --> smart -error:", error);
    reportEvent(shopOrigin || "", 'server-smart-wizard-error',{error});
  }
  },

};
