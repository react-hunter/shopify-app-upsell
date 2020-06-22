const { bigBearSecret, dev } = require("../config");

const bigBearUrl = dev ? 'http://localhost:3001' : 'https://bigbear.conversionbear.com';

async function getShop({ shopify_domain }) {
  if (!shopify_domain) {
    return;
  }
  try {
    const response = await fetch(
      `${bigBearUrl}/shop?shopify_domain=${shopify_domain}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.log(`getShop --> error: ${e}`);
    return;
  }
}

async function addShop({
  shopify_domain,
  shop_information,
  origin_app,
  installed_at,
  is_active,
  partner_code,
  access_token,
}) {
  if (!shopify_domain || !shop_information || !origin_app || !bigBearSecret) {
    return;
  }

  try {
    const response = await fetch(`${bigBearUrl}/shop`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "big-bear-secret": bigBearSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopify_domain,
        shop_information,
        origin_app,
        installed_at,
        is_active,
        partner_code,
        access_token,
      }),
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.log(`addShop --> error: ${e}`);
    return;
  }
}

async function updateShop({
  shopify_domain,
  shop_information,
  origin_app,
  is_active,
  cb_plan,
}) {
  if (!shopify_domain || !origin_app || !bigBearSecret) {
    return;
  }

  try {
    const response = await fetch(`${bigBearUrl}/shop`, {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "big-bear-secret": bigBearSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopify_domain,
        shop_information,
        origin_app,
        is_active,
        cb_plan,
      }),
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.log(`updateShop --> error: ${e}`);
    return;
  }
}

async function uninstallShop({ shopify_domain, origin_app }) {
  if (!shopify_domain || !origin_app || !bigBearSecret) {
    return;
  }

  try {
    // const response = 
    await fetch(`${bigBearUrl}/shop`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        "big-bear-secret": bigBearSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopify_domain,
        origin_app,
      }),
    });
    // const jsonData = await response.json();
    // return jsonData;
  } catch (e) {
    console.log(`uninstallShop --> error: ${e}`);
    return;
  }
}

async function logMarketingEvent({ shopify_domain, marketing_event }) {
  if (!shopify_domain || !marketing_event || !bigBearSecret) {
    return;
  }

  try {
    const response = await fetch(`${bigBearUrl}/marketing_event`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "big-bear-secret": bigBearSecret,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        shopify_domain,
        marketing_event,
      }),
    });
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.log(`uninstallShop --> error: ${e}`);
    return;
  }
}

async function getMarketingEvent({ shopify_domain, template_id }) {
  if (!shopify_domain || !template_id || !bigBearSecret) {
    return;
  }

  try {
    const response = await fetch(
      `${bigBearUrl}/marketing_event?shopify_domain=${shopify_domain}&template_id=${template_id}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "big-bear-secret": bigBearSecret,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopify_domain,
          marketing_event,
        }),
      }
    );
    const jsonData = await response.json();
    return jsonData;
  } catch (e) {
    console.log(`uninstallShop --> error: ${e}`);
    return;
  }
}

module.exports = {
  getShop,
  addShop,
  updateShop,
  uninstallShop,
  logMarketingEvent,
  getMarketingEvent,
};
