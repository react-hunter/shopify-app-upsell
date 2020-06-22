const {
  receiveWebhook,
} = require('@shopify/koa-shopify-webhooks');
const Router = require('koa-router');

const ShopInstall = require('./models/ShopInstall');
const helper = require('./lib/helper');
const reportEvent = require('./lib/reportEvent');

const {
  shopifyApiSecretKey,
} = require('./config');

const webhooksRouter = new Router();

const webhook = receiveWebhook({ secret: shopifyApiSecretKey });

webhooksRouter.post('/webhooks/customer-data-request', webhook, async (ctx) => {
  console.log('received webhook: ', ctx.state.webhook);
  console.log('ctx: ', JSON.stringify(ctx));
  try {
    const response = await helper.uninstallShop(ctx.header['x-shopify-shop-domain']);
    ctx.status = 200;
    ctx.body = response;
  } catch (err) {
    ctx.status = 200;
    ctx.body = { message: err.message };
  }
});

webhooksRouter.post('/webhooks/customer-data-erasure', webhook, async (ctx) => {
  console.log('received webhook: ', ctx.state.webhook);
  console.log('ctx: ', JSON.stringify(ctx));
  ctx.status = 200;
  ctx.body = 'ok';
});

webhooksRouter.post('/webhooks/gdpr-shop-redact', webhook, async (ctx) => {
  console.log('received webhook: ', ctx.state.webhook);
  console.log('ctx: ', JSON.stringify(ctx));
  ctx.status = 200;
  ctx.body = 'ok';
});

webhooksRouter.post('/webhooks/uninstall', webhook, async (ctx) => {
  console.log('received webhook: ', ctx.state.webhook);
  console.log('ctx: ', ctx);

  try {
    const response = await helper.uninstallShop(ctx.header['x-shopify-shop-domain']);
    ctx.status = 200;
    ctx.body = response;
  } catch (err) {
    ctx.status = 200;
    ctx.body = { message: err.message };
  }
});

webhooksRouter.post('/webhooks/shop-update', webhook, async (ctx) => {
  await helper.processShopUpdate(ctx);
  ctx.status = 200;
  ctx.res.end();
});

webhooksRouter.post('/webhooks/app-subscriptions-update', webhook, async (ctx) => {
  console.log(
    'received webhook app_subscriptions/update: ',
    ctx.state.webhook,
  );
  console.log('ctx.request.body: ', ctx.request.body);

  const shop = ctx.state.webhook.domain;
  ctx.status = 200;
  ctx.body = {
    message: `couldn't process subscription update webhook: ${shop}`,
  };
});

module.exports = webhooksRouter;
