const {
  apiVersion,
} = require('../config');

const getItemsPage = require('./getItemsPage');

function getProductsPage({ url, shopOrigin, accessToken }) {
  const query = [
    'limit=250',
    'published_status=published',
    // 'fields=line_items',
  ];

  return getItemsPage({
    url: url ? url : `https://${shopOrigin}/admin/api/${apiVersion}/products.json?${query.join('&')}`,
    accessToken,
  });
}

module.exports = async function getProducts({ maxPages = 10, shopOrigin, accessToken }) {
  let products = [];
  try {
    let url = null;
    for (const [index] of Array(maxPages).entries()) {
      const data = await getProductsPage({ url, shopOrigin, accessToken });
      if (!data.data || !Array.isArray(data.data.products) || !data.data.products.length) {
        break;
      }
      products = [...products, ...data.data.products];
      url = data.nextLink;
      if (!url) {
        break;
      }
    }
  } catch (err) {
    console.log(err);
  }
  return products;
};
