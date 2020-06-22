module.exports = async function({ shopOrigin, apiVersion, shop }) {

  let result;
  let theme_colors = [];
  try {
    result = await fetch(
      `https://${shopOrigin}/admin/api/${apiVersion}/themes.json`,
      {
        method: 'GET',
        credentials: 'include',
        headers: {
          'X-Shopify-Access-Token': shop.accessToken,
          'Content-Type': 'application/json',
        },
      },
    );
    if (result.status === 200) {
      const resultData = await result.json();
      // console.log("themes info", resultData);
      const themeId = (resultData.themes.find(({ role }) => role === 'main') || {}).id;
      // console.log("themeId", themeId);
      if (themeId) {
        result = await fetch(
          `https://${shopOrigin}/admin/api/${apiVersion}/themes/${themeId}/assets.json?asset[key]=config/settings_schema.json&theme_id=${themeId}`,
          {
            method: 'GET',
            credentials: 'include',
            headers: {
              'X-Shopify-Access-Token': shop.accessToken,
              'Content-Type': 'application/json',
            },
          },
        );
        if (result.status === 200) {
          const resultData2 = await result.json();
          // console.log("theme settings", resultData2);
          const settingsSchema = JSON.parse(resultData2.asset.value);
          const colorsObjects = (settingsSchema.find(({ name }) => name === 'Colors' || name.en === 'Colors') || {}).settings || [];
          theme_colors = colorsObjects
            .map((item) => item.type === 'color' && item.default || null)
            .filter((item) => Boolean(item) && item !== '#ffffff' && item !== '#000000')
            .filter((value, index, arr) => arr.indexOf(value) === index) // unique values
            .slice(0, 4);
        }
      }
    }
  } catch (err) {
    console.log('getThemeColors error', err);
  }
  return theme_colors;
};
