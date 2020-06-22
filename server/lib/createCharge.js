const {
  tunnelUrl,
  realCharge,
  apiVersion,
} = require('../config');
const Shop = require('../models/Shop');

module.exports = async function createCharge({ shopOrigin, accessToken, trialDays, name, price, partnerCode }) {

  const return_url = `${tunnelUrl}${partnerCode ? `?code=${partnerCode}` : ''}`;
  const stringifiedBillingParams = JSON.stringify({
    recurring_application_charge: {
      name,
      price,
      return_url,
      test: !realCharge,
      trial_days: trialDays,
    },
  });

  const options = {
    method: 'POST',
    body: stringifiedBillingParams,
    credentials: 'include',
    headers: {
      'X-Shopify-Access-Token': accessToken,
      'Content-Type': 'application/json',
    },
  };
  console.log("createCharge -> options", options)

  let id = null;
  let confirmationURL = '/';
  try {
    const response = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/recurring_application_charges.json`,
      options,
    );
    const data = await response.json();
    console.log("createCharge -> data", data);
    const { recurring_application_charge: createdCharge } = data;

    id = createdCharge.id;
    confirmationURL = createdCharge.confirmation_url;

    await Shop.updateOne({
      shopify_domain: shopOrigin,
    }, {
      paymentConfirmationUrl: confirmationURL,
    });
  } catch (error) {
    console.log('error', error);
  }

  return { id, confirmationURL };
};
