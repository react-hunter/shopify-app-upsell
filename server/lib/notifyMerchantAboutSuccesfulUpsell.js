const Shop = require("../models/Shop");
const reportEvent = require("../lib/reportEvent");
const sendEmail = require("./sendEmail");
const {
  apiVersion,
} = require('../config');

module.exports = async function notifyMerchantAboutSuccesfulUpsell(shopifyDomain, orderId) {
    console.log(
        `sending an email to: ${shopifyDomain} with order id of: ${orderId}`
      );
    try {
      let buyer_first_name, product_name, upsell_value, email, shopCurrencyFormat;
      const templateId = "d-c486510efe304e21972ec224abe625f5"; // [upsell] successful upsell
      // GET shop info like: 1.currency symmbol from shop and 2.email address
      const shop = await Shop.findOne({ shopify_domain: shopifyDomain });
  
      if (shop && shop.shopInformation) {
        email = shop.shopInformation.email;
        shopCurrencyFormat = shop.shopInformation.money_format;
      } else {
        return false;
      }
  
      //GET order data from the orders endpoint
      let order = await fetch(
        `https://${shopifyDomain}/admin/api/${apiVersion}/orders/${orderId}.json`,
        {
          headers: {
            "X-Shopify-Access-Token": shop.accessToken,
            "Content-Type": "application/json"
          }
        }
      );
  
      result = await order.json();
        console.log(result)
      const orderData = result.order;
      if (orderData) {
        if (orderData.billing_address && orderData.billing_address.first_name) {
          buyer_first_name = orderData.billing_address.first_name;
        }
        if (orderData.line_items) {
          //calc products
          const numOfProductsSold = orderData.line_items.length;
          if (numOfProductsSold === 1) {
            product_name = orderData.line_items[0].title;
          } else if (numOfProductsSold === 2) {
            product_name = `${orderData.line_items[0].title} and ${orderData.line_items[1].title}`;
          } else if (numOfProductsSold === 3) {
            product_name = `${orderData.line_items[0].title}, ${orderData.line_items[1].title} and ${orderData.line_items[2].title}`;
          }
        }
        if (orderData.total_price) {
          upsell_value = shopCurrencyFormat
            .replace(/\{\{.*?\}\}/, orderData.total_price)
            .replace(/<[^>]*>/g, "");
        }
      }

      const salesNotificationsUnsubsubscribersList = 13975;
      //notify the mercahnt that they received the first order
      sendEmail({email, templateId, dynamicData: {
        buyer_first_name,
        product_name,
        upsell_value,
        shopify_domain: shopifyDomain
      }, unsubscribeGroup: salesNotificationsUnsubsubscribersList});
  
      //notify us about the first upsell
      sendEmail({email: "lynda+upsell@conversionbear.com", templateId, dynamicData: {
        buyer_first_name,
        product_name,
        upsell_value,
        shopifyDomain
      }});
  
    } catch (e) {
      console.log(
        `couldn't notify shop about upsell. shop: ${shopifyDomain}, message: ${e}`
      );
      reportEvent(shopifyDomain, "error", "coudnt notify shop about upsell");
    }
  }
  