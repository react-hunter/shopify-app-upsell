const {
  cloudflareZoneIdentifier,
  cloudflareToken,
  tunnelUrl,
} = require('../config');

module.exports = function purgeSettingsCache(shopOrigin, domain) {
  if (!cloudflareZoneIdentifier || !cloudflareToken) {
    return;
  }
  return fetch(
    `https://api.cloudflare.com/client/v4/zones/${cloudflareZoneIdentifier}/purge_cache`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${cloudflareToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        files: [
          {
            url: `${tunnelUrl}settings?shop=${shopOrigin}`,
            headers: {
              Origin: `https://${shopOrigin}`, // needed only for ajax requests
            },
          },
          {
            url: `${tunnelUrl}settings?shop=${shopOrigin}`,
            headers: {
              Origin: `https://${domain}`, // needed only for ajax requests
            },
          },
          {
            url: `${tunnelUrl}settings?shop=${shopOrigin}`,
            headers: {
              Origin: `https://*.${domain}`, // needed only for ajax requests
            },
          },
          {
            url: `${tunnelUrl}settings?shop=${shopOrigin}`,
            headers: {
              Origin: 'https://upsell.conversionbear.com', // needed only for ajax requests
            },
          },
          {
            url: `${tunnelUrl}settings?shop=${shopOrigin}`,
            headers: {},
          },
        ],
      }),
    },
  );
};
