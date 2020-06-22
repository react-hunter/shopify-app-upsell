async function initRechargeIntegration(acceptedOffers) {
  console.log(`initRechargeIntegration: ${acceptedOffers}`);
  if (
    acceptedOffers &&
    window.conversionBearUpsell.RECHARGE_PRODUCTS &&
    window.conversionBearUpsell.RECHARGE_PRODUCTS.length &&
    window.conversionBearUpsell.RECHARGE_PRODUCTS.some(e => {
      return JSON.stringify(acceptedOffers).indexOf(e.variantId) > -1;
    })
  ) {
    console.log(
      `Detected a recharge product in one of the upsell offers. Redirecting to Recharge checkout...`
    );
    addRecharegeItemToCart(
      acceptedOffers[0].variant_id,
      acceptedOffers[0].quantity,
      acceptedOffers[0].frequency,
      acceptedOffers[0].unit_Type
    ).then(() => {
      console.log(`added recharge items to cart`);
      return null;
    });
  }
}

async function addRecharegeItemToCart(variant_id, qty, frequency, unit_type) {
  const data = {
    id: variant_id,
    quantity: qty,
    properties: {
      shipping_interval_frequency: frequency,
      shipping_interval_unit_type: unit_type
    }
  };
  return fetch("/cart/add.js", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  }).then(resp => {
    const paramCart =
      "&cart_token=" + (document.cookie.match("(^|; )cart=([^;]*)") || 0)[2];
    const paramDomain = `myshopify_domain=${window.Shopify.shop}`;
    window.location =
      "https://checkout.rechargeapps.com/r/checkout?" + paramDomain + paramCart; // add cart token from response from shopify
  });
}

export default initRechargeIntegration;
