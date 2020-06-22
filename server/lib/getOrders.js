const {
  apiVersion,
} = require('../config');

const getItemsPage = require('./getItemsPage');

function getOrdersPage({ url, shopOrigin, accessToken }) {
  const query = [
    'limit=250',
    'status=any',
    'fields=line_items',
  ];

  return getItemsPage({
    url: url ? url : `https://${shopOrigin}/admin/api/${apiVersion}/orders.json?${query.join('&')}`,
    accessToken,
  });
}

module.exports = async function getOrders({ maxPages = 10, shopOrigin, accessToken }) {
  let orders = [];
  try {
    let url = null;
    for (const [index] of Array(maxPages).entries()) {
      const data = await getOrdersPage({ url, shopOrigin, accessToken });
      if (!data.data || !Array.isArray(data.data.orders) || !data.data.orders.length) {
        break;
      }
      orders = [...orders, ...data.data.orders];
      url = data.nextLink;
      if (!url) {
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return orders;
};
