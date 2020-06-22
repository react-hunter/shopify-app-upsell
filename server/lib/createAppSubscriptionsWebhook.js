const {
  tunnelUrl,
} = require('../config');

module.exports = async function createAppSubscriptionsWebhook(shopOrigin, accessToken) {

  const webshookAppSubscriptionsResponse = await fetch(
    `https://${shopOrigin}/admin/api/2019-07/graphql.json`,
    {
      credentials: 'include',
      headers: {
        'X-Shopify-Access-Token': accessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify({
        query: `mutation {
          webhookSubscriptionCreate(
            topic: APP_SUBSCRIPTIONS_UPDATE,
            webhookSubscription: {
              callbackUrl: "${tunnelUrl}webhooks/app-subscriptions-update",
              format: JSON
            }
          ) {
            webhookSubscription {
              id
              callbackUrl
            }
            userErrors {
              field
              message
            }
          }
        }`,
      }),
    },
  );
  const createSubscriptionsWebhookResult = await webshookAppSubscriptionsResponse.json();
  if (createSubscriptionsWebhookResult.data &&
    createSubscriptionsWebhookResult.data.webhookSubscriptionCreate &&
    createSubscriptionsWebhookResult.data.webhookSubscriptionCreate.webhookSubscription) {
    console.log('Successfully registered app subscriptions webhook');
  } else {
    console.log('Failed to register webhook', JSON.stringify(createSubscriptionsWebhookResult));
  }

};
