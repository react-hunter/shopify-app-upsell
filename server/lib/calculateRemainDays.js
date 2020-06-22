const ShopInstall = require('../models/ShopInstall');
const { defaultTrialDays } = require('../config');

module.exports = async function calculateRemainDays(shopOrigin, trialDays) {

  const shopInstall = await ShopInstall.findOne({
    shopify_domain: shopOrigin,
  });

  let _trialDays = typeof trialDays === 'number' ? trialDays : defaultTrialDays;

  if (shopInstall && shopInstall.trialStartedAt) {
    if (typeof shopInstall.trialDays === 'number') {
      _trialDays = Math.min(shopInstall.trialDays, trialDays);
    }
    const diffDays = Math.round(((shopInstall.cancelledAt ? shopInstall.cancelledAt : new Date()) - shopInstall.trialStartedAt) / (1000 * 60 * 60 * 24));
    if (diffDays < 0 || diffDays >= trialDays) {
      _trialDays = 0;
    } else {
      _trialDays -= diffDays;
    }
  }
  if(_trialDays < 0 || !_trialDays){
    _trialDays = 0;
  }

  return _trialDays;

};
