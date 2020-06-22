const moment = require('moment');
const Orders = require('../models/Orders');
const ShopInstall = require('../models/ShopInstall');

module.exports = async function getViews({
  shopId,
  dateStart,
  dateFinish,
  pricingPlan,
  shopOrigin,
}) {
  const data = await Orders.aggregate([
    {
      $match: {
        shopId,
        updatedAt: {
          $gte: dateStart,
          $lte: dateFinish,
        },
      },
    },
    {
      $group: {
        _id: {
          campaign_id: '$campaign_id',
          order_id: '$order_init_id',
        },
        unique_views: {
          $sum: 1,
        },
      },
    },
    {
      $group: {
        _id: null,
        unique_views: {
          $sum: 1,
        },
      },
    },
  ]);

  let viewsBeforeUninstalling = 0;
  if (shopOrigin && pricingPlan === 'Free') {
    const shopInstall = await ShopInstall.findOne({ shopify_domain: shopOrigin });
    if (shopInstall && shopInstall.periodStartedAt) {
      if (moment().diff(moment(shopInstall.periodStartedAt), 'days') < 30) {
        viewsBeforeUninstalling = shopInstall.views || 0;
      }
    }
  }
  return (data.length ? data[0].unique_views : 0) + viewsBeforeUninstalling;
};
