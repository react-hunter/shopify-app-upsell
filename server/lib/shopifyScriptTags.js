const {
  appName,
  apiVersion,
  tunnelUrl,
} = require('../config');

const reportEvent = ('./reportEvent');

module.exports = {
  async add(shopOrigin, accessToken) {

    let isAlreadyInstalledResponse = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/script_tags.json`, {
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    let jsonData = await isAlreadyInstalledResponse.json();
    if (!jsonData || !Array.isArray(jsonData.script_tags)) {
      const script = jsonData.script_tags.find((item) => item.src.indexOf(`app=${appName}`) > -1);
      if(script){
        return;
      } 
    }

    //add the script
    const options = {
      method: 'POST',
      body: JSON.stringify({
        script_tag: {
          event: 'onload',
          src: `${tunnelUrl}script?app=${appName}`,
        },
      }),
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
    };
    const response = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/script_tags.json`,
      options,
    );
    await response.json();
  },

  async remove(shopOrigin, accessToken) {
    let response = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/script_tags.json`, {
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    let jsonData = await response.json();
    if (!jsonData || !Array.isArray(jsonData.script_tags)) {
      // throw new Error('404:no script tags');
      return;
    }
    const script = jsonData.script_tags.find((item) => item.src.indexOf(`app=${appName}`) > -1);
    
    if (!script) {
      // throw new Error('404:no script tags');
      return;
    }
    console.log("script", script)
    response = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/script_tags/${script.id}.json`,
      {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    jsonData = await response.json();
  },

};
