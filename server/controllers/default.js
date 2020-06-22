const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
const Orders = require('../models/Orders');
const Views = require('../models/Views');
const Shop = require('../models/Shop');
const PartnerCode = require('../models/PartnerCode');
const reportEvent = require('../lib/reportEvent');
const createCharge = require('../lib/createCharge');
const cancelSubscription = require('../lib/cancelSubscription');
const calculateRemainDays = require('../lib/calculateRemainDays');
const checkOverLimit = require('../lib/checkOverLimit');
const { getShopStatusByCreationDate } = require('../lib/helper');
const {
  requireSessionRefresh,
  enablePremium,
} = require('../lib/helper');
const {
  genCampaingOffersProducts,
  genCampaingPriceDiscountProducts,
  isOrderCampaignPaid,
  findCampaign,
  filterOffers,
} = require('../lib/campaignHelper');
const {
  apiVersion,
  pricing,
  tunnelUrl,
  shopifyApiKey,
  veteranPlan,
  earlyPlan,
} = require('../config');
const Campaigns = require('../models/Campaigns');
const isOutOfStock = require('../lib/isOutOfStock');
const sendEmail = require('../lib/sendEmail');
const BigBear = require('../lib/bigBear');
// const ObjectId = require('mongodb').ObjectID;

module.exports = {

  'enable-premium->get->public': async () => {
    await enablePremium();
    return { message: 'Premium is enabled' };
  },

  'session->get->public': (ctx) => {
    return requireSessionRefresh(ctx);
  },

  'preview->get->public': (ctx) => {
    const shopOrigin = ctx.session.shop;
    console.log(`preview->get->public: ${shopOrigin}`);
    const content = fs
      .readFileSync('./static/preview/index.html')
      .toString()
      .replace('{{__SHOP_NAME__}}', shopOrigin)
      .replace('{{__SHOP_NAME__}}', shopOrigin);

    // reportEvent(ctx.query.shop, 'shop_script_load');
    ctx.res.setHeader('Content-Type', 'text/html;charset=utf-8');
    return content;
  },

  'product->get->public': async (ctx) => {

    const shopOrigin = ctx.query.shop || ctx.session.shop;

    if (!shopOrigin) {
      throw new Error('400:shop is required');
    }
    if (!ctx.query.handle && !ctx.query.id) {
      throw new Error('400:handle or id are required');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      reportEvent(shopOrigin, 'error', { value: 'get_product_shop_isnt_found' });
      throw new Error('404:not found');
    }

    const options = {
      method: 'GET',
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': shop.accessToken,
        'Content-Type': 'application/json',
      },
    };

    let requestUrl;
    if (ctx.query.id) {
      requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?ids=${ctx.query.id}`;
    } else {
      requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?handle=${encodeURIComponent(ctx.query.handle)}`;
    }

    if (ctx.query.currency) {
      requestUrl += `&presentment_currencies=${ctx.query.currency}`;
    }

    try {
      const response = await fetch(
              requestUrl,
              options,
          );
      const result = await response.json();
          // console.log(`get product response: ${JSON.stringify(result)}`);
      if (!Array.isArray(result.products) || !result.products[0]) {
        reportEvent(ctx.query.shop, 'error', { value: 'product not found', product: ctx.query.handle });
        throw new Error('404:not found');
      }
      return result.products[0];
    } catch (error) {
      console.log('error', error);
      reportEvent(ctx.query.shop, 'error', {
        value: 'error while fetching for product',
        product: ctx.query.handle,
        message: error.message });
      throw new Error(`400:${error.message}`);
    }
  },

  'products->get->public': async (ctx) => {
    const shopOrigin = ctx.session.shop;

    const search = ctx.query.search || '';

    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      reportEvent(shopOrigin, 'error', { value: 'get_products_shop_isnt_found' });
      throw new Error('404:not found');
    }

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': shop.accessToken,
        'Content-Type': 'application/graphql',
      },
      body: `{
          products(first: 40, query: "title:${search ? `*${search}*` : '*'}") {
            edges {
              node {
                id
                title
                featuredImage{
                    id,
                    originalSrc
                }
              }
            }
          }
      }`,
    };

    const requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/graphql.json`;

    try {
      const response = await fetch(
              requestUrl,
              options,
          );
      const result = await response.json();

      const products = [];

      if (result.data && result.data.products && result.data.products.edges) {
        result.data.products.edges.forEach((item) => {
          item.node.id = item.node.id.split('/')[item.node.id.split('/').length - 1];
          products.push(item.node);
        });
      }
      return products;
    } catch (error) {
      reportEvent(shopOrigin, 'error', { value: 'get_products_error', error: JSON.stringify(error) });
      console.log('error', error);
      throw new Error(`400:${error.message}`);
    }
  },

  'collections->get->public': async (ctx) => {
    const shopOrigin = ctx.session.shop;

    const search = ctx.query.search || '';

    if (!shopOrigin) {
      throw new Error('403:Forbidden');
    }

    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      reportEvent(shopOrigin, 'error', { value: 'get_collections_error_shop_not_found'});
      throw new Error('404:not found');
    }

    const options = {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': shop.accessToken,
        'Content-Type': 'application/graphql',
      },
      body: `{
          collections(first: 20, query: "title:${search ? `*${search}*` : '*'}") {
            edges {
              node {
                id
                title
              }
            }
          }
      }`,
    };

    const requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/graphql.json`;

    try {
      const response = await fetch(
              requestUrl,
              options,
          );
      const result = await response.json();
      const collections = [];

      if (result.data && result.data.collections && result.data.collections.edges) {
        result.data.collections.edges.forEach((item) => {
          item.node.id = item.node.id.split('/')[item.node.id.split('/').length - 1];
          collections.push(item.node);
        });
      }
      return collections;
    } catch (error) {
      reportEvent(shopOrigin, 'error', { value: 'get_collections_error', error: JSON.stringify(error)});
      console.log('error', error);
      throw new Error(`400:${error.message}`);
    }
  },

  'demo_campaign->post->public': async (ctx) => {
    try {
      const shopOrigin = ctx.query.shop || ctx.session.shop;
      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        throw new Error('401:Not authorized');
      }

      let campaign = ctx.request.body;
      campaign = await genCampaingOffersProducts(campaign, shopOrigin, shop.accessToken);
      campaign = genCampaingPriceDiscountProducts(campaign);
      return campaign;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  'order->post->public': async (ctx) => {
    try {
      const shopOrigin = ctx.query.shop || ctx.session.shop;
      const orderId = ctx.query.orderId;
      let upsell_amount = 0;
      const currency = ''; // ctx.query.currency; // TODO

      console.log(`order->post->public, shopOrigin: ${shopOrigin}, orderId: ${orderId}`)
      if (!shopOrigin) {
        ctx.status = 403;
        return;
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      console.log(`shop is: ${shop}`)
      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'post_order_shop_not_found'});
        ctx.status = 404;
        return;
      }
      const shop_default_currency = shop.shopInformation ? shop.shopInformation.currency : '';

      const draft_order = {
        line_items: [],
      };

      let jsonDataOrder = {
        order: {
          line_items: [],
        },
      };

      if (orderId && orderId.indexOf('custom_order_id') < 0) {
        const order = await fetch(
          `https://${shopOrigin}/admin/api/${apiVersion}/orders/${orderId}.json`, {
            headers: {
              'X-Shopify-Access-Token': shop.accessToken,
              'Content-Type': 'application/json',
            },
          },
        );
        jsonDataOrder = await order.json();
        if (!jsonDataOrder.order) {
          console.debug(`no data was received for: ${shopOrigin}`);
          throw new Error('404:Not found order');
        }
        draft_order.shipping_address = jsonDataOrder.order.shipping_address;
        draft_order.billing_address = jsonDataOrder.order.billing_address;
        draft_order.customer = { id: jsonDataOrder.order.customer.id };
      }


      const body = ctx.request.body;


      if (body.cart && body.cart.items) {
        body.cart.items.forEach((item) => {
          draft_order.line_items.push({
            variant_id: item.variant_id,
            quantity: item.quantity,
          });
        })
      }

      let campaign = await Campaigns.findOne({ _id: body.campaign_id }).lean();
      // eslint-disable-next-line require-atomic-updates
      campaign = await genCampaingOffersProducts(campaign, shopOrigin, shop.accessToken, currency);
      campaign = genCampaingPriceDiscountProducts(campaign, currency, shop_default_currency);
      const order_item_product_ids = _.uniq(jsonDataOrder.order.line_items.map((line_item) => line_item.product_id));
      let cart_items_product_ids = [];
      if(body.cart && body.cart.items){
        cart_items_product_ids = _.uniq(body.cart.items.map((item) => item.product_id)); 
      }
      campaign.offers = campaign.offers.filter((offer) => {
        if (campaign.skip_offers_already_icluded && 
          (order_item_product_ids.indexOf(offer.product.id) > -1 || 
          cart_items_product_ids.indexOf(offer.product.id) > -1) ) {
          return false;
        } else if(!offer.product.variants){
          return false;
        } else {
          let out_of_stock = true;
          offer.product.variants.some((variant) => {
            if (!isOutOfStock(variant)) {
              out_of_stock = false;
              return true;
            }
            return false;
          });
          return !out_of_stock;
        }
      });
      
      body.offers.forEach((offer) => {
        let price = 0;
        let compare_at_price = 0;
        campaign.offers[offer.active_offer].product.variants.some((varinat) => {
          if (varinat.id == offer.variant_id) {
            price = parseFloat(varinat.price);
            compare_at_price = parseFloat(varinat.compare_at_price);
            return true;
          }
          return false;
        });

        const item = {
          variant_id: offer.variant_id,
          quantity: offer.quantity,
        };

        if (campaign.offers[offer.active_offer].free_shipping || campaign.offers[offer.active_offer].upsell_type === 'free_shipping') {
          draft_order.shipping_line = {
            price: 0.0,
            title: 'Free Shipping',
          };
        }

        if(campaign.offers[offer.active_offer].upsell_type === 'discount'){
          item.applied_discount = {
            value_type: 'fixed_amount',
            value: (compare_at_price - price),
            amount: (compare_at_price - price) * offer.quantity,
          };
        } else { // case none
          //do nothing
        }

        upsell_amount += (price * offer.quantity);

        draft_order.line_items.push(item);
      });

      draft_order.tags = 'HoneycombUpsell, ' + campaign.name;
      if (!draft_order.shipping_line && jsonDataOrder.order.shipping_lines && jsonDataOrder.order.shipping_lines > 0) {
        draft_order.shipping_line = {
          handle: jsonDataOrder.order.shipping_lines[0].code || null,
          price: jsonDataOrder.order.shipping_lines[0].price || null,
          title: jsonDataOrder.order.shipping_lines[0].title || null,
        };
      }

      const response = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/draft_orders.json`, {
          credentials: 'include',
          headers: {
            'X-Shopify-Access-Token': shop.accessToken,
            'Content-Type': 'application/json',
          },
          method: 'post',
          body: JSON.stringify({ draft_order }),
        },
      );

      const jsonDataDraftOrder = await response.json();
      if (!jsonDataDraftOrder.draft_order) {
        throw new Error('404:Not create order draft');
      }

      //notify merchant about the FIRST draft order that's created with honeycomb.
      const existingDraftOrder = await Orders.find({shopId: shop._id, order_draft_id: {$ne: null}}).limit(1);
      if(existingDraftOrder && existingDraftOrder.length === 0 && shop && shop.shopInformation && shop.shopInformation.email){
        console.log('1st draft order created for shop. Notifying mercahnt....');
        sendEmail({email: shop.shopInformation.email, templateId: "d-8cda6b6745064abe8294cc5356fa884a"}); //notify about draft order
      }

      await Orders.updateOne({ shopId: shop._id, order_init_id: orderId }, {
        order_draft_id: jsonDataDraftOrder.draft_order.id,
        tmp_upsell_amount: upsell_amount
      });
      return { invoice_url: jsonDataDraftOrder.draft_order.invoice_url, order: jsonDataDraftOrder.draft_order };
    } catch (error) {
      console.log(`error is: ${error}`)
      throw error;
    }
  },

  'campaign_preview->post->public': async (ctx) => {
    try {
      let {current_campaign, shopOrigin} = ctx.request.body;

      if (!shopOrigin) {
        ctx.status = 403;
        return;
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'get_campaign_error_shop_not_found'});
        ctx.status = 404;
        return;
      }

      current_campaign = await genCampaingOffersProducts(current_campaign, shopOrigin, shop.accessToken);
      current_campaign = genCampaingPriceDiscountProducts(current_campaign);

      const order_item_product_ids = [];

      current_campaign.offers = filterOffers(current_campaign, order_item_product_ids);
      if (!current_campaign.offers.length) {
        return null;
      }
      return current_campaign;
    } catch (error) {
      return null;
    }
  },

  'campaign_cart->post->public': async (ctx) => {
    const shopOrigin = ctx.query.shop || ctx.session.shop;
    try {
      const isMobile = ctx.query.isMobile == 'true';
      let excludeIds = [];
      const currency = ctx.query.currency;
      if (ctx.query.excludeIds) {
        excludeIds = ctx.query.excludeIds.split(',');
      }
      if (!shopOrigin) {
        ctx.status = 403;
        return;
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'get_campaign_error_shop_not_found'});
        ctx.status = 404;
        return;
      }


      const shop_default_currency = shop.shopInformation ? shop.shopInformation.currency : '';

      const { product_ids, total_price } = ctx.request.body;

      let campaigns = await findCampaign(product_ids, total_price, isMobile, shop);
      campaigns = campaigns.filter((item) => item.page_to_show == 'cart_page' && excludeIds.indexOf(item._id.toString()) < 0);
      if (!campaigns.length) {
        return null;
      }

      let current_campaign = { ...campaigns[0] };

      current_campaign = await genCampaingOffersProducts(current_campaign, shopOrigin, shop.accessToken, currency);
      current_campaign = genCampaingPriceDiscountProducts(current_campaign, currency, shop_default_currency);

      current_campaign.offers = filterOffers(current_campaign, product_ids);
      if (!current_campaign.offers.length) {
        return null;
      }

      return { ...current_campaign };
    } catch (error) {
      reportEvent(shopOrigin, 'error', { value: 'get_campaign_error', error: JSON.stringify(error) });
      console.log(error);
      return null;
    }
  },

  'campaign_order_view->post->public': async (ctx) => {

    if (ctx.headers.origin && tunnelUrl.indexOf(ctx.headers.origin) === 0) {
      return {};
    }

    const { shopOrigin, campaign_id } = ctx.request.body;
    try {
      let { tmpOrderId } = ctx.request.body;
      let newOrderInitId;

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'campaign_order_view_error_shop_not_found'});
        ctx.status = 404;
        return;
      }

      if (tmpOrderId) {
        const order = await Orders.findOne({ order_init_id: tmpOrderId, is_order: 0, campaign_id });
        if (!order) {
          newOrderInitId = `custom_order_id_${Date.now()}`;
        }
      } else {
        newOrderInitId = `custom_order_id_${Date.now()}`;
      }
      if (newOrderInitId) {
        tmpOrderId = newOrderInitId;
        await Orders.create({
          campaign_id,
          order_init_id: newOrderInitId,
          shopId: shop._id,
        });
        (async () => {await Views.update(
          { shopId: shop._id, campaign_id },
          { $inc: { [`views.${moment().utc().format('YYYY-MM-DD')}`]: 1, amount: 1 } },
          { upsert: true }
        )})();
        (async () => { await checkOverLimit(shop); })();
      }

      return { tmpOrderId };
    } catch (error) {
      reportEvent(shopOrigin, 'error', { value: 'campaign_order_view_error', error: JSON.stringify(error) });
      console.log(error);
      return null;
    }
  },

  // calls from thank you page
  'campaign->get->public': async (ctx) => {
    try {
      const shopOrigin = ctx.query.shop || ctx.session.shop;
      const orderId = ctx.query.orderId;
      const campaignId = ctx.query.campaignId;
      let excludeIds = [];

      if (ctx.query.excludeIds) {
        excludeIds = ctx.query.excludeIds.split(',');
      }

      let order_init_amount = 0;
      const currency = ctx.query.currency;

      const isMobile = ctx.query.isMobile == 'true';

      let campaigns = [];

      if (!shopOrigin) {
        ctx.status = 403;
        return;
      }
      // console.log(`469: campaign->get->public for ${shopOrigin}`);
      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'get_campaign_error_shop_not_found'});
        ctx.status = 404;
        return;
      }

      const shop_default_currency = shop.shopInformation ? shop.shopInformation.currency : '';

      // console.log(`476: campaign->get->public for ${shopOrigin}`);
      if (campaignId) {
        let current_campaign = null;
        if (campaignId === 'first') {
          current_campaign = await Campaigns.findOne({ isActive: true }).lean();
        } else {
          current_campaign = await Campaigns.findOne({ _id: campaignId }).lean();
        }

        if (!current_campaign) {
          return null;
        }
        // console.log(`488: campaign->get->public for ${shopOrigin}`);
        current_campaign = await genCampaingOffersProducts(current_campaign, shopOrigin, shop.accessToken, currency);
        current_campaign = genCampaingPriceDiscountProducts(current_campaign, currency, shop_default_currency);

        const order_item_product_ids = [];

        current_campaign.offers = filterOffers(current_campaign, order_item_product_ids);

        if (!current_campaign.offers.length) {
          return null;
        }

        const tmpOrderId = `custom_order_id_${Date.now()}`;
        // console.log(`514: campaign->get->public for ${shopOrigin}`);
        await Orders.create({
          campaign_id: current_campaign._id,
          order_init_id: tmpOrderId,
          shopId: shop._id,
        });
        (async () => {await Views.update(
          { shopId: shop._id, campaign_id: current_campaign._id },
          { $inc: { [`views.${moment().utc().format('YYYY-MM-DD')}`]: 1, amount: 1 } },
          { upsert: true }
        )})();
        (async () => { await checkOverLimit(shop); })();

        console.log(`
        campaign_id: ${current_campaign._id}
        order_init_id: ${tmpOrderId}
        shopId: ${shop._id}`); 

        return { ...current_campaign, tmpOrderId };
      }
      // console.log(`528: campaign->get->public for ${shopOrigin}`);
      const order = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/orders/${orderId}.json?fields=id,line_items,name,total_price`, {
          headers: {
            'X-Shopify-Access-Token': shop.accessToken,
            'Content-Type': 'application/json',
          },
        },
      );
      // console.log(`537: campaign->get->public for ${shopOrigin}`);
      const jsonDataOrder = await order.json();

      if (!jsonDataOrder.order) {
        console.debug(`no data was received for: ${shopOrigin}`);
        return null;
      }

      order_init_amount = jsonDataOrder.order.total_price;
      const orderPaid = await isOrderCampaignPaid(jsonDataOrder.order, shopOrigin, shop.accessToken);

      let campaign_id_exclude = null;

      const order_finds = await Orders.find({ order_init_id: jsonDataOrder.order.id });
      if (order_finds.length) {

        const tmp_camps = await Campaigns.find({ _id: order_finds.map((item) => item.campaign_id)});
        tmp_camps.forEach((camp) => {
          if (camp && camp.show_this_funnel_once) {
            excludeIds.push(camp._id.toString());
          }
        });
      }
      // console.log(`546: campaign->get->public for ${shopOrigin}`);

      const order_item_product_ids = _.uniq(jsonDataOrder.order.line_items.map((line_item) => line_item.product_id));

      campaigns = await findCampaign(order_item_product_ids, order_init_amount, isMobile, shop);
      campaigns = campaigns.filter((item) => item.page_to_show != 'cart_page' && excludeIds.indexOf(item._id.toString()) < 0);
      if (!campaigns.length) {
        if (campaign_id_exclude) {
          return { campaign_id_exclude };
        }
        return null;
      }

      let current_campaign = { ...campaigns[0] };
      // breakes here
      current_campaign = await genCampaingOffersProducts(current_campaign, shopOrigin, shop.accessToken, currency);
      // console.log(`627: campaign->get->public for ${shopOrigin}`);
      current_campaign = genCampaingPriceDiscountProducts(current_campaign, currency, shop_default_currency);

      current_campaign.offers = filterOffers(current_campaign, order_item_product_ids);
      if (!current_campaign.offers.length) {
        if (campaign_id_exclude) {
          return { campaign_id_exclude };
        }
        return null;
      }
      // console.log(`644: campaign->get->public for ${shopOrigin}`);
      await Orders.create({
        campaign_id: current_campaign._id,
        order_init_id: orderId,
        shopId: shop._id,
        order_init_amount,
      });
      (async () => { await Views.update(
        { shopId: shop._id, campaign_id: current_campaign._id },
        { $inc: { [`views.${moment().utc().format('YYYY-MM-DD')}`]: 1, amount: 1 } },
        { upsert: true }
      )})();
      (async () => { await checkOverLimit(shop); })();

      return { ...current_campaign, campaign_id_exclude };
    } catch (error) {
      console.log(`catch: campaign->get->public for ${error}`);
      return null;
    }
  },

  'add_partner_to_affiliate_program->post->public': async (ctx) => {
    // 1. validate the payload
    // 2. trigger the affiliate email
    if (ctx.request.body && ctx.request.body.email) {
      return sendEmail({
        email: ctx.request.body.email,
        templateId: "d-354a000cef1149f8999d35cee9da9f89",
        dynamicData: { app_name: "Honeycomb Upsell Funnels" }
      }).then(() => {
        ctx.status = 201;
        return { status: 'added to mailing list' };
      });
    } else {
      throw new Error('400:Bad request');
    }
  },

  'demo_campaign_product_preview->post->public': async (ctx) => {
    try {
      const shopOrigin = ctx.session.shop;
      const shop = await Shop.findOne({ shopify_domain: shopOrigin });
      if (!shop) {
        throw new Error('401:Not authorized');
      }

      const campaign = ctx.request.body;

      const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': shop.accessToken,
          'Content-Type': 'application/json',
        },
      };

      let products = [];

      let requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?published_status=published`;

      if (campaign.trigger === 'trigger_products') {
        const ids = campaign.trigger_products && Array.isArray(campaign.trigger_products) ? campaign.trigger_products.map((item) => item.id) : [];
        requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?ids=${ids}&?published_status=published`;
      } else if (campaign.trigger === 'trigger_collections') {
        const ids = campaign.trigger_collections && Array.isArray(campaign.trigger_collections) ? campaign.trigger_collections.map((item) => item.id) : [];
        requestUrl = `https://${shopOrigin}/admin/api/${apiVersion}/products.json?collection_id=${ids[Math.floor(Math.random() * ids.length)]}&?published_status=published`;
      }

      const response = await fetch(
        requestUrl,
        options,
      );
      const result = await response.json();
      if (result && result.products) {
        products = result.products;
      }

      if (products.length) {
        return products[Math.floor(Math.random() * products.length)];
      }

      return null;
    } catch (error) {
      console.log('error', error);
      return null;
    }
  },

  'change_plan->post': async (ctx) => {
    const { shop: shopOrigin, accessToken } = ctx.session;
    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      throw new Error('404:Not found shop');
    }
    if (ctx.request.body.plan === 'Free') {
      BigBear.updateShop({
        shopify_domain: shopOrigin,
        origin_app: "upsell",
        cb_plan: 'Free',
      });
      if (shop.pricingPlan) {
        await cancelSubscription(shopOrigin, accessToken);
      } else {
        const freeShopStatus = getShopStatusByCreationDate(shop.createdAt);
        if (freeShopStatus === 'veteran' || freeShopStatus === 'early') {
          await Shop.updateOne({ _id: shop._id }, { pricingPlan: 'Free', periodStartedAt: new Date(), periodRenewAt: moment().add(30, 'days').toDate() });
        } else {
          await Shop.updateOne({ _id: shop._id }, { pricingPlan: 'Free' });
        }
      }
      return { pricingPlan: 'Free' };
    } else {
      let foundPlan;
      let trialDaysMax;
      if (ctx.request.body.plan === 'Partner Plan') {
        const shopStatus = getShopStatusByCreationDate(shop.createdAt);
        if (shopStatus === 'veteran') {
          foundPlan = veteranPlan;
          trialDaysMax = 0;
        }
        if (shopStatus === 'early') {
          foundPlan = earlyPlan;
          trialDaysMax = 0;
        }
      }
      if (!foundPlan) {
        foundPlan = pricing.find((item) => item.name === ctx.request.body.plan);
      }
      if (!foundPlan) {
        throw new Error('404:Not found plan');
      }
      let partnerCode;
      if (!shop.pricingPlan && ctx.cookies.get('partnerCode')) {
        const partnerCodeData = await PartnerCode.findOne({ code: ctx.cookies.get('partnerCode'), isActive: true });
        if (partnerCodeData) {
          partnerCode = ctx.cookies.get('partnerCode');
          trialDaysMax = partnerCodeData.trialDays;
        }
        // clear cookie to avoid looping
        ctx.cookies.set('partnerCode');
      }
      const trialDaysRemain = shop.pricingPlan && shop.pricingPlan !== 'Free'
        ? 0
        : await calculateRemainDays(shopOrigin, trialDaysMax);
      const { id, confirmationURL } = await createCharge({
        shopOrigin,
        accessToken,
        trialDays: trialDaysRemain,
        name: foundPlan.name,
        price: foundPlan.price,
        partnerCode,
      });
      if (id) {
        await Shop.updateOne({
          shopify_domain: shopOrigin,
        }, {
          chargeId: id,
          paymentConfirmationUrl: confirmationURL,
        });
      }
      return { id, confirmationURL };
    }
  },

  'check_over_limit->get->public': async (ctx) => {
    if (!ctx.query.shop) {
      throw new Error('400:shop is required');
    }
    await checkOverLimit(ctx.query.shop);
    return 'done';
  },

  'check_over_limit_all->get->public': async (ctx) => {
    const shops = await Shop.find({ overLimit: true });
    for (const shop of shops) {
      await checkOverLimit(shop);
    }
    return 'done';
  },

  'redeem->get->public': async (ctx) => {
    // 1. parse the query params of the request and get the code param
    // 2. if the coupon code is valid then
    // 3. save the code as a param in the user session
    const shopifyNonce = '97c8382f-d0da-4e2d-9b35-84afbee55593';
    const code = ctx.query.code ? ctx.query.code : 'no_code';
    const source = ctx.query.source ? ctx.query.source : 'default';
    const app = ctx.query.app ? ctx.query.app : 'default';
    const shopify_domain = ctx.query.shopify_domain ? ctx.query.shopify_domain : 'default';
    try {
      console.log(`redeemCoupon route, code is: ${code}`);
      ctx.cookies.set('partnerCode', code, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      });

      ctx.cookies.set('installationSource', source, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      });

      ctx.cookies.set('sourceApp', app, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      });

      ctx.cookies.set('shopifyNonce', shopifyNonce, {
        httpOnly: false,
        sameSite: 'none',
        secure: true,
      });

      // client_id is the api ket of the app
      // state is the nonce
      const installUri =
        `https://accounts.shopify.com/store-login?redirect=%2Fadmin%2Foauth%2Fauthorize%3Fclient_id%3D${shopifyApiKey}%26scope%3Dread_products%2Cwrite_products%2Cwrite_script_tags%2Cread_script_tags%2Cread_themes%2Cwrite_themes%2Cwrite_draft_orders%2Cread_draft_orders%2Cread_orders%2Cwrite_orders%2Cwrite_order_edits%2Cread_order_edits%26redirect_uri%3D${encodeURIComponent(tunnelUrl)}auth%2Fcallback%26state%3D${shopifyNonce}`;
      // reportEvent('unknown.myshopify.com', 'redirect-coupon_flow', code);
      console.log(`redeemCoupon route, redirecting`);
      return ctx.redirect(
        `https://www.conversionbear.com/redeem-offer?code=${code}&source=${source}&app=${app}&shopify_domain=${shopify_domain}&redirect_uri=${encodeURI(installUri)}`
      );
    } catch (e) {
      return ctx.redirect(`https://www.conversionbear.com/redeem-offer?code=${code}`);
      console.log(e);
    }
    console.log(`redeemCoupon route, redirecting4`);
  },
  'orders_count->get->public': async (ctx) => {

    const shopOrigin = ctx.query.shop || ctx.session.shop;
    let result;
    if (!shopOrigin) {
      throw new Error('400:shop is required');
    }
    const shop = await Shop.findOne({ shopify_domain: shopOrigin });
    if (!shop) {
      throw new Error('404:not found');
    }
    try{
      const options = {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': shop.accessToken,
          'Content-Type': 'application/json',
        },
      };
  
      const response = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/orders/count.json`,
          options,
      );

      result = await response.json();
    } catch(e){
      console.log("orders_count->get->public error:", e)
    }
    return result;
    // return {count: 0}
  }
};
