module.exports = ({ orders, products }) => {
  const proposalLikelyBoughtTogetherObj = {};
  let proposalLikelyBoughtTogetherArr = [];

  const soldInOrders = {};
  let soldInOrdersArr = [];

  const totalSales = {};
  let totalSalesArr = [];

  const productsObj = {};

  orders.forEach((order) => {
    if (!Array.isArray(order.line_items)) {
      return;
    }

    const usedPairs = [];
    const soldQuantity = {};
    order.line_items.forEach((lineItem1) => {
      if (!soldQuantity[lineItem1.product_id]) {
        soldQuantity[lineItem1.product_id] = 0;
      }
      soldQuantity[lineItem1.product_id] += lineItem1.quantity;

      if (order.line_items.length > 1) {
        order.line_items.forEach((lineItem2) => {
          if (lineItem1.product_id === lineItem2.product_id) {
            return;
          }
          if (usedPairs.includes(`${lineItem1.product_id}-${lineItem2.product_id}`) ||
            usedPairs.includes(`${lineItem2.product_id}-${lineItem1.product_id}`)
          ) {
            return;
          }
          usedPairs.push(`${lineItem1.product_id}-${lineItem2.product_id}`);
          if (typeof proposalLikelyBoughtTogetherObj[`${lineItem1.product_id}-${lineItem2.product_id}`] === 'undefined' &&
            typeof proposalLikelyBoughtTogetherObj[`${lineItem2.product_id}-${lineItem1.product_id}`] === 'undefined'
          ) {
            proposalLikelyBoughtTogetherObj[`${lineItem1.product_id}-${lineItem2.product_id}`] = 0;
          }
          if (typeof proposalLikelyBoughtTogetherObj[`${lineItem1.product_id}-${lineItem2.product_id}`] !== 'undefined') {
            proposalLikelyBoughtTogetherObj[`${lineItem1.product_id}-${lineItem2.product_id}`]++;
          }
          if (typeof proposalLikelyBoughtTogetherObj[`${lineItem2.product_id}-${lineItem1.product_id}`] !== 'undefined') {
            proposalLikelyBoughtTogetherObj[`${lineItem2.product_id}-${lineItem1.product_id}`]++;
          }
        });
      }
    });

    Object.entries(soldQuantity).forEach(([id, quantity]) => {
      if (!totalSales[id]) {
        totalSales[id] = 0;
      }
      totalSales[id] += quantity;

      if (quantity < 2) {
        return;
      }
      if (!soldInOrders[id]) {
        soldInOrders[id] = 0;
      }
      soldInOrders[id]++;

    });

  });

  proposalLikelyBoughtTogetherArr = Object.entries(proposalLikelyBoughtTogetherObj).map(([key, value]) => ({ ids: key, count: value }));
  soldInOrdersArr = Object.entries(soldInOrders).map(([key, value]) => ({ id: key, count: value }));
  totalSalesArr = Object.entries(totalSales).map(([key, value]) => ({ id: key, count: value }));

  // eslint-disable-next-line id-length
  function compare(a, b) {
    if (a.count < b.count) {
      return 1;
    }
    if (a.count > b.count) {
      return -1;
    }
    return 0;
  }
  // DESC
  proposalLikelyBoughtTogetherArr.sort(compare);

  soldInOrdersArr.sort(compare);
  totalSalesArr.sort(compare);

  const productsInventory = {};
  let productsInventoryArr = [];

  products.forEach((product) => {
    productsObj[product.id] = {
      id: product.id,
      title: product.title,
      image_src: product.image ? product.image.src : null,
    };
    product.variants.forEach((variant) => {
      if (!variant.inventory_policy || !variant.inventory_quantity) {
        return;
      }
      if (!productsInventory[product.id]) {
        productsInventory[product.id] = 0;
      }
      productsInventory[product.id] += variant.inventory_quantity;
    });
  });

  productsInventoryArr = Object.entries(productsInventory).map(([key, value]) => ({ id: key, count: value }));
  productsInventoryArr.sort(compare);

  let proposalLikelyBoughtTogether = proposalLikelyBoughtTogetherArr.slice(0, 50).map((item) => {
    return item.ids.split('-')
      .map((id) => (productsObj[id] ? productsObj[id] : { id, title: '', image_src: '' }));
  });

  proposalLikelyBoughtTogether.filter((item)=>{
    return item[0].title && item[1].image_src && item[0].title !== '' && item[1].image_src !== '';
  })
  
  let proposalDecreaseInventory = null;

  if (totalSalesArr[0] && totalSalesArr[0].id && productsInventoryArr[0] && productsInventoryArr[0].id) {
    proposalDecreaseInventory = [totalSalesArr[0].id, productsInventoryArr[0].id]
      .map((id) => (productsObj[id] ? productsObj[id] : { id, title: '', image_src: '' }));
  }

  let proposalMoreOfTheSame = null;
  if (soldInOrdersArr[0] && soldInOrdersArr[0].id) {
    proposalMoreOfTheSame = [soldInOrdersArr[0].id, soldInOrdersArr[0].id]
      .map((id) => (productsObj[id] ? productsObj[id] : { id, title: '', image_src: '' }));
  }

  return [
    proposalLikelyBoughtTogether.length ? proposalLikelyBoughtTogether[0] : null,
    proposalDecreaseInventory,
    proposalMoreOfTheSame,
    ...proposalLikelyBoughtTogether.slice(1),
  ];
};
