const moment = require('moment');
const {
  apiVersion,
} = require('../config');
const Shop = require('../models/Shop');
const sendEmail = require('../lib/sendEmail');

module.exports = async function cancelSubscription(shopOrigin, accessToken) {

  const getOptions = {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  };

  const deleteOptions = {
    method: 'DELETE',
    credentials: 'include',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  try {
    const shop = await Shop.findOne({
      shopify_domain: shopOrigin,
    });

    if (!shop) {
      console.log('not found shop: ', shopOrigin);
      return {};
    }

    let chargeId;
    let activeCharge = null;
    let data = {};
    if (!shop.chargeId) {
      const response = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/recurring_application_charges.json`,
        getOptions,
      );
      data = await response.json();
      activeCharge = Array.isArray(data.recurring_application_charges) && data.recurring_application_charges.find((item) => item.status === 'active') || {};
      if (activeCharge.id) {
        chargeId = activeCharge.id;
      }
    } else {
      chargeId = shop.chargeId;
    }
    let response;
    if (chargeId) {
      response = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/recurring_application_charges/${chargeId}.json`,
        deleteOptions,
      );
      if (response.ok) {
        await Shop.updateOne({
          shopify_domain: shopOrigin,
        }, {
          chargeId: null,
          pricingPlan: 'Free',
          overLimit: false,
          periodStartedAt: new Date(),
          periodRenewAt: moment().add(30, 'days').toDate(),
          customViewsLimit: null,
          customPrice: null,
          unlimitedViews: false,
        });
        if(shop.shopInformation && shop.shopInformationshop.shopInformation.email){
          sendEmail({email: shop.shopInformationshop.shopInformation.email, templateId: "d-67416f96af264a76b7380afd78763c09", dynamicData: {}, sender:{name: "Jonathan from Conversion Bear", email: "jonathan@conversionbear.com"}});
        }
      }
    }
    return {
      recurring_application_charges: data.recurring_application_charges,
      id: chargeId,
      activeCharge,
      deleteResponseStatus: response && response.status || 'unknown',
    };
  } catch (error) {
    console.log('error', error);
    return {};
  }

};
