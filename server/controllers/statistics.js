const moment = require('moment');
const _ = require('lodash');
const Orders = require('../models/Orders');
const Campaigns = require('../models/Campaigns');
const Shop = require('../models/Shop');
const {
  apiVersion,
  appPrice,
} = require('../config');
const reportEvent = require('../lib/reportEvent');
const getViews = require('../lib/getViews');

function monthDiff(d1, d2) {
  let months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}

module.exports = {

  find: async (ctx) => {
    const result = {
      revenue: 0,
      views: 0,
      user_payment: 0,
      store_orders_total: 0,
      store_orders: 0,
      upsell_orders_total: 0,
      upsell_orders: 0,
    };
    try {
      const shopOrigin = ctx.session.shop;
      if (!shopOrigin) {
        throw new Error('403:Forbidden');
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_not_found' });
        throw new Error('404:Not found');
      }

      // TODO: fetch only orders that were fullfilled/open
      const response = await fetch(
        `https://${shopOrigin}/admin/api/${apiVersion}/orders.json?limit=100&fields=total_price&status=any`, {
          credentials: 'include',
          headers: {
            'X-Shopify-Access-Token': shop.accessToken,
            'Content-Type': 'application/json',
          },
          method: 'get',
        },
      );


      const jsonDataDraftOrder = await response.json();
      if (jsonDataDraftOrder.orders) {
        jsonDataDraftOrder.orders.forEach((order) => {
          result.store_orders += 1;
          result.store_orders_total += parseFloat(order.total_price);
        });
      }

      let data = await Orders.aggregate([
        {
          $match: {
            shopId: shop._id,
          },
        },
        {
          $group: {
            _id: null,
            uniqueOrderIds: { $addToSet: '$order_init_id' },
            total: { $sum: '$amount' },
            upsell_amount: { $sum: '$upsell_amount' },
          },
        },
      ]);

      result.user_payment = monthDiff(moment(shop.createdAt).toDate(), moment().toDate()) * appPrice;

      if (data[0]) {
        // result.average_order_value = data[0].average_order_value;
        result.revenue = data[0].upsell_amount;
        result.views = data[0].uniqueOrderIds.length;
      }

      data = await Orders.aggregate([
        {
          $match: {
            shopId: shop._id,
            is_order: 1,
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: '$amount' },
            order_init_total: { $sum: '$order_init_amount' },
            views: {
              $sum: 1,
            },
          },
        },
      ]);

      if (data[0]) {
        result.upsell_orders_total = data[0].total + data[0].order_init_total;
        result.upsell_orders = data[0].views;
      }

      return result;
    } catch (error) {
      return result;
    }
  },

  'views->post': async (ctx) => {
    const result = 0;
    try {
      const shopOrigin = ctx.session.shop;
      if (!shopOrigin) {
        throw new Error('403:Forbidden');
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_top_not_found' });
        throw new Error('404:Not found');
      }

      return await getViews({
        shopId: shop._id,
        dateStart: shop.periodStartedAt || shop.createdAt,
        dateFinish: new Date(),
        pricingPlan: shop.pricingPlan,
        shopOrigin,
      });

    } catch (error) {
      console.log('error', error);
      return result;
    }
  },

  'revenue_growth->post': async (ctx) => {
    const result = [];
    const shopOrigin = ctx.session.shop;
    try {
      if (!shopOrigin) {
        throw new Error('403:Forbidden');
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_not_found_rev_growth' });
        throw new Error('404:Not found');
      }

      const body = ctx.request.body;

      const dateStart = moment(body.date_start, 'YYYY-MM-DD').startOf('day');
      const dateFinish = moment(body.date_finish, 'YYYY-MM-DD').endOf('day');
      if (!dateStart.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_rev_growth_invalid_date', dateStart });
        throw new Error('400:date_start is invalid');
      }
      if (!dateFinish.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_rev_growth_invalid_date', dateFinish });
        throw new Error('400:date_finish is invalid');
      }

      const data = await Orders.aggregate([
        {
          $match: {
            shopId: shop._id,
            updatedAt: {
              $gte: dateStart.toDate(),
              $lte: dateFinish.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
            },
            total: {
              $sum: '$amount',
            },
            upsell_amount: { $sum: '$upsell_amount' },
          },
        },
      ]);


      const daysObject = {};

      data.forEach((item) => {
        // console.log(item._id, typeof item._id);
        daysObject[item._id] = item.upsell_amount;
      });


      let i = 0;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (dateStart <= dateFinish) {
        i++;
        const total = daysObject[dateStart.format('YYYY-MM-DD')]
          ? daysObject[dateStart.format('YYYY-MM-DD')] : 0;
        result.push({
          date: dateStart.format('YYYY-MM-DD'),
          total,
        });
        dateStart.add(1, 'days');
        if (i > 100) {
          break;
        }
      }

      return result;
    } catch (error) {
      console.log(error);
      reportEvent(shopOrigin, 'error', { value: 'statistics_shop_rev_growth_error', error: JSON.stringify(error) });
      return result;
    }
  },

  'views_graph->post': async (ctx) => {
    const result = [];
    const shopOrigin = ctx.session.shop;
    try {
      if (!shopOrigin) {
        throw new Error('403:Forbidden');
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_not_found_rev_growth' });
        throw new Error('404:Not found');
      }

      const body = ctx.request.body;

      const dateStart = moment(body.date_start, 'YYYY-MM-DD').startOf('day');
      const dateFinish = moment(body.date_finish, 'YYYY-MM-DD').endOf('day');
      if (!dateStart.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_rev_growth_invalid_date', dateStart });
        throw new Error('400:date_start is invalid');
      }
      if (!dateFinish.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_shop_rev_growth_invalid_date', dateFinish });
        throw new Error('400:date_finish is invalid');
      }

      const data = await Orders.aggregate([
        {
          $match: {
            shopId: shop._id,
            updatedAt: {
              $gte: dateStart.toDate(),
              $lte: dateFinish.toDate(),
            },
          },
        },
        {
          $group: {
            _id: {
              $dateToString: { format: '%Y-%m-%d', date: '$updatedAt' },
            },
            views: {
              $sum: 1,
            },
          },
        },
      ]);


      const daysObject = {};

      data.forEach((item) => {
        daysObject[item._id] = item.views;
      });


      let i = 0;
      // eslint-disable-next-line no-unmodified-loop-condition
      while (dateStart <= dateFinish) {
        i++;
        const total = daysObject[dateStart.format('YYYY-MM-DD')]
          ? daysObject[dateStart.format('YYYY-MM-DD')] : 0;
        result.push({
          date: dateStart.format('YYYY-MM-DD'),
          total,
        });
        dateStart.add(1, 'days');
        if (i > 100) {
          break;
        }
      }

      return result;
    } catch (error) {
      console.log(error);
      reportEvent(shopOrigin, 'error', { value: 'statistics_shop_views_graph_error', error: JSON.stringify(error) });
      return result;
    }
  },

  'top->post': async (ctx) => {
    const result = [];
    const shopOrigin = ctx.session.shop;
    
    try {
      if (!shopOrigin) {
        throw new Error('403:Forbidden');
      }

      const shop = await Shop.findOne({ shopify_domain: shopOrigin });

      if (!shop) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_top_not_found' });
        throw new Error('404:Not found');
      }

      const body = ctx.request.body;

      const dateStart = moment(body.date_start, 'YYYY-MM-DD').startOf('day');
      const dateFinish = moment(body.date_finish, 'YYYY-MM-DD').endOf('day');
      if (!dateStart.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_top_invalid_date', dateStart });
        throw new Error('400:date_start is invalid');
      }
      if (!dateFinish.isValid()) {
        reportEvent(shopOrigin, 'error', { value: 'statistics_top_invalid_date', dateFinish });
        throw new Error('400:date_finish is invalid');
      }

      const data = await Orders.aggregate([
        {
          $match: {
            shopId: shop._id,
            updatedAt: {
              $gte: dateStart.toDate(),
              $lte: dateFinish.toDate(),
            },
            // is_order: 1,
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
            upsell_amount: { $sum: '$upsell_amount' },
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
            upsell_amount: {
              $sum: '$upsell_amount',
            },
          },
        }, {
          $project: {
            _id: '$_id',
            unique_views: '$unique_views',
            orders: '$orders',
            total: '$total',
            upsell_amount: '$upsell_amount',
            conv: {
              $divide: [
                '$orders', '$unique_views',
              ],
            },
          },
        }, {
          $sort: body.sort || { total: -1 },
        }, {
          $limit: 10,
        },
      ]);
      const campaigns = (await Campaigns.find({ _id: data.map((item) => item._id) }).lean()).map((item) => ({ ...item, _id: item._id.toString() }));

      data.forEach((item) => {
        const index = _.findIndex(campaigns, ['_id', item._id.toString()]);
        if (index > -1) {
          item.name = campaigns[index].name;
        }
      });

      data.forEach((item) => {
        if (item.name) {
          result.push([
            item.name,
            item.unique_views,
            `${(item.conv * 100).toFixed(2)}%`,
            item.upsell_amount,
          ]);
        }
      });
      return result;
    } catch (error) {
      reportEvent(shopOrigin, 'error', { value: 'statistics_top_error', error: JSON.stringify(error) });
      console.log(error);
      return result;
    }
  },

};
