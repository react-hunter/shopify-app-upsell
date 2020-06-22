const { cloneDeep } = require("lodash");
const moment = require('moment');
const Orders = require("../models/Orders");
const Campaigns = require("../models/Campaigns");
const reportEvent = require("../lib/reportEvent");
const ObjectId = require("mongoose").Types.ObjectId;
const { apiVersion } = require("../config");
const notifyMerchantAboutSuccesfulUpsell = require("./notifyMerchantAboutSuccesfulUpsell");
const isOutOfStock = require('./isOutOfStock');

function filterOffers(campaign, product_ids) {
  return campaign.offers.filter((offer) => {
    if (campaign.skip_offers_already_icluded && product_ids.indexOf(offer.product.id) > -1) {
      return false;
    } else if (!offer.product.variants) {
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
}

async function findCampaign(product_ids=[], total_price=0, isMobile=false, shop) {
  try {
    let dataCampaigns = await Campaigns.find({ shopId: shop._id, isActive: true }).lean();
    const collection_ids = [];
    let campaigns = [];
    const collect = await Promise.all(product_ids.map((id) =>
      fetch(
        `https://${shop.shopify_domain}/admin/api/${apiVersion}/collects.json?product_id=${id}`, {
          headers: {
            'X-Shopify-Access-Token': shop.accessToken,
            'Content-Type': 'application/json',
          },
        },
      ).then((res) => res.json()),
    ));

    

    collect.forEach((item) => {
      if (item.collects && Array.isArray(item.collects)) {
        item.collects.forEach((coll) => {
          collection_ids.push(coll.collection_id);
        });
      }
    });

    dataCampaigns = dataCampaigns.filter((item) => {
      if (item.start_time && moment() <= moment(item.start_date_value)) {
        return false;
      } else if (item.end_time && moment() >= moment(item.end_date_value)) {
        return false;
      } else {
        return true;
      }
    });

    dataCampaigns.forEach((item) => {
      if (item.trigger === 'trigger_all') {
        campaigns.push({ ...item, priority: 1 });
      } else if (item.trigger === 'trigger_amount') {
        const trigger_amount = isNaN(parseFloat(item.trigger_amount)) ? 0 : parseFloat(item.trigger_amount);
        if (total_price >= trigger_amount) {
          campaigns.push({ ...item, priority: 2 });
        }
      } else if (item.trigger === 'trigger_products') {
        const campaign_product_ids = item.trigger_products.map((product) => product.id);
        if (campaign_product_ids.some((id) => product_ids.indexOf(id) > -1)) {
          campaigns.push({ ...item, priority: 4 });
        }
      } else if (item.trigger === 'trigger_collections') {
        const campaign_collection_ids = item.trigger_collections.map((collection) => collection.id);
        if (campaign_collection_ids.some((id) => collection_ids.indexOf(id) > -1)) {
          campaigns.push({ ...item, priority: 3 });
        }
      }
    });

    campaigns.sort((a, b) => (a.priority > b.priority) ? -1 : (a.priority === b.priority) ? ((moment(a.created_at) > moment(b.created_at)) ? -1 : 1) : 1 )

    campaigns = campaigns.filter((item) => {

      if (item.show_campaign_only == 'desktop' && isMobile) {
        return false;
      } else if (item.show_campaign_only == 'mobile' && !isMobile) {
        return false;
      } else {
        return true;
      }
    });
    return campaigns;
    
  } catch (error) {
    console.log("findCampaing -> error", error)
    return [];
  }
}

async function genCampaingOffersProducts(
  campaign,
  shop,
  accessToken,
  currency,
) {
  try {
    const product_ids = [];
    // console.log(`18: genCampaingOffersProducts ${shop}`);
    if (campaign && campaign.offers) {
      campaign.offers.forEach((offer) => {
        product_ids.push(offer.product.id);
      });
    }
    // console.log(`18: genCampaingOffersProducts ${shop},product_ids: ${product_ids}`);

    if (!product_ids.length) {
      throw new Error("404:Not found products");
    }

    const options = {
      method: "GET",
      credentials: "include",
      headers: {
        "X-Shopify-Access-Token": accessToken,
        "Content-Type": "application/json"
      }
    };
    let requestUrl = `https://${shop}/admin/api/${apiVersion}/products.json?ids=${product_ids.join(
      ","
    )}`;
    // console.log(`40: genCampaingOffersProducts for ${shop}, requestUrl: ${requestUrl}`);
    if (currency) {
      requestUrl += `&presentment_currencies=${currency}`;
      options.headers['X-Shopify-Api-Features'] = 'include-presentment-prices';
    }
    const response = await fetch(requestUrl, options);
    const result = await response.json();
    // console.log(`46: genCampaingOffersProducts for ${shop}, result: ${JSON.stringify(result)}`);
    let products = [];

    if (result && result.products) {
      products = result.products;
    }

    if (!products.length) {
      // console.log(`55: genCampaingOffersProducts for ${shop}, result: ${products}`);
      throw new Error("404:Not found products");
    }
    // console.log(`56: genCampaingOffersProducts for ${shop}, products: ${JSON.stringify(products)}`);

    if (campaign && campaign.offers) {
      campaign.offers = campaign.offers.map(offer => {
        products.some(product => {
          if (product.id == offer.product.id) {
            offer.product = cloneDeep(product);
            return true;
          }
          return false;
        });
        return cloneDeep(offer);
      });

      // console.log(`genCampaingOffersProducts for ${shop}, ${JSON.stringify(campaign.offers)}`);
    }

    return campaign;
  } catch (error) {
    throw new Error(error);
  }
}

function genCampaingPriceDiscountProducts(campaign, currency, shop_default_currency) {
  if (!campaign || !campaign.offers) {
    return campaign;
  }
  const alternativeCurrency = currency && shop_default_currency && (currency !== shop_default_currency);
  campaign.offers = campaign.offers.map((offer) => {
    if (!offer.product.variants || offer.upsell_type !== 'discount') {
      return offer;
    }
    offer.product.variants = offer.product.variants.map((variant) => {

      const price_default_currency = parseFloat(variant.price);
      let price = parseFloat(variant.price);

      if (alternativeCurrency && Array.isArray(variant.presentment_prices)) {
        price = parseFloat((variant.presentment_prices.find((item) =>
          item.price && (item.price.currency_code === currency)) ||
          { price: { amount: price } }).price.amount);
      }

      variant.compare_at_price = price;
      let new_price = price_default_currency;
      if (offer.discount.discount_type === 'amount_off') {
        const discount_amount = !isNaN(parseFloat(offer.discount.amount))
          ? parseFloat(offer.discount.amount)
          : 0;
        new_price = price_default_currency - discount_amount;
        if (new_price < 0) {
          new_price = 0;
        }
      } else if (offer.discount.discount_type === 'percent_off') {
        const percent =
          (!isNaN(parseFloat(offer.discount.amount))
            ? parseFloat(offer.discount.amount)
            : 0) / 100;
        new_price = price_default_currency * (1 - percent);
      } else if (offer.discount.discount_type === 'fixed_price') {
        new_price = !isNaN(parseFloat(offer.discount.amount))
          ? parseFloat(offer.discount.amount)
          : price_default_currency;
      }
      variant.price = Math.round((alternativeCurrency ? new_price / price_default_currency * price : new_price) * 100) / 100;
      return { ...variant };
    });
    return offer;
  });
  // parseFloat((parseFloat(variant.price) - (Math.round((parseFloat(variant.price) * percent) * 100) / 100)).toFixed(2))
  return campaign;
}

// Once the widget is visible there's an order_init_id created
// If the user procedded to checkout then the order gets an order_draft_id in the db
// if the user completed their purchase the order gets an order_id, amount, etc
async function isOrderCampaignPaid(order, shop, accessToken) {
  try {
    let result = await fetch(
      `https://${shop}/admin/api/${apiVersion}/orders/${order.id}/events.json?verb=placed`,
      {
        headers: {
          "X-Shopify-Access-Token": accessToken,
          "Content-Type": "application/json"
        }
      }
    );
    result = await result.json();

    if (!result.events || !result.events.length) {
      return false;
    }

    let draftId = null;

    const resultMatch = result.events[0].message.match(
      /href=".*?admin\/draft_orders\/(\d*?)"/
    );

    if (resultMatch && resultMatch[1]) {
      draftId = resultMatch[1];
    }

    if (!draftId) {
      return false;
    }
    const orderApp = await Orders.findOne({
      order_draft_id: draftId,
      is_order: 0
    });
    if (!orderApp) {
      return false;
    }

    const shopSuccesfulOrders = await Orders.find({
      shopId: new ObjectId(orderApp.shopId),
      is_order: 1,
      amount: { $gt: 0 }
    });

    orderApp.order_id = order.id;
    orderApp.is_order = 1;
    orderApp.upsell_amount = orderApp.tmp_upsell_amount;
    orderApp.amount = parseFloat(order.total_price);
    orderApp.save();

    notifyMerchantAboutSuccesfulUpsell(shop, orderApp.order_id);
    reportEvent(shop, "uou-upsell_order_checkout_completed", {
      amount: order.total_price
    });

    // if it's the first order then send an email to the mercahnt
    if (
      shopSuccesfulOrders &&
      shopSuccesfulOrders.length === 0 &&
      orderApp.amount > 0
    ) {
      reportEvent(shop, "uou-upsell_order_checkout_completed-first-checkout", {
        amount: order.total_price
      });
    }

    return orderApp;
  } catch (error) {
    console.log(error);
    return false;
  }
}

module.exports = {
  genCampaingOffersProducts,
  genCampaingPriceDiscountProducts,
  isOrderCampaignPaid,
  findCampaign,
  filterOffers,
};
