const Shop = require('../models/Shop');
const PartnerCode = require('../models/PartnerCode');
// const AppSpec = require('../models/AppSpec');
const {
  // apiVersion,
  defaultTrialDays,
} = require('../config');
const createCharge = require('./createCharge');
const calculateRemainDays = require('./calculateRemainDays');

/*
  - it will fill confirmationURL only if
    - partner code contain price
    - first time / no plan is chosen (shop.pricingPlan is null)
  - will be renamed in final version
*/
module.exports = async function isShopPaid(shopOrigin, accessToken, partnerCode, options) {

  /*
  const premiumEnabledDoc = await AppSpec.findOne({
    key: 'premiumEnabled',
  });
  if (!premiumEnabledDoc || !premiumEnabledDoc.value) {
    return true;
  }
  */
  const shop = await Shop.findOne({
    shopify_domain: shopOrigin,
  });
  // no shop || plan plain is already chosen
  if (!shop /* || shop.pricingPlan !== null*/) {
    return true;
  }

  const partnerCodeData = await PartnerCode.findOne({ code: partnerCode, isActive: true });

  // no active code OR no price is defined
  if (!partnerCodeData || !partnerCodeData.price) {
    return true;
  }

  // here is trying to get exist change
  /*
  let chargeId = shop.chargeId;

  if (chargeId) {
    const chargeUrl = `admin/api/${apiVersion}/recurring_application_charges`;
    const fetchOptions = {
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    const optionsWithGet = { ...fetchOptions, method: 'GET' };
    const result = await fetch(
      `https://${shopOrigin}/${chargeUrl}/${chargeId}.json`,
      optionsWithGet,
    ).then((response) => response.json());
    if (result && result.recurring_application_charge) {
      if (result.recurring_application_charge.confirmation_url) {
        options.paymentConfirmationUrl = shop && shop.paymentConfirmationUrl || null;
        return false;
      }
    }
    chargeId = null;
  }
  */

  // if (!chargeId) {
  const trialDays = await calculateRemainDays(shopOrigin, typeof partnerCodeData.trialDays === 'number' ? partnerCodeData.trialDays : defaultTrialDays);
  // using plan name 'Custom' here, probably we need to change it
  const { id, confirmationURL } = await createCharge({
    shopOrigin,
    accessToken,
    trialDays,
    name: partnerCodeData.name /* 'Custom'*/,
    price: partnerCodeData.price,
    partnerCode,
  });
  options.paymentConfirmationUrl = confirmationURL;

  if (id) {
    await Shop.updateOne({
      shopify_domain: shopOrigin,
    }, {
      chargeId: id,
      paymentConfirmationUrl: confirmationURL,
      trialDays,
    });
    return false;
  }
  // }

  return true;

};
