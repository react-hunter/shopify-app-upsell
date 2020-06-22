require('newrelic');
require('isomorphic-fetch');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('koa2-cors');
const next = require('next');
const { default: createShopifyAuth } = require('@shopify/koa-shopify-auth');
const { verifyRequest } = require('@shopify/koa-shopify-auth');
const session = require('koa-session');
const logger = require('koa-logger');
const { default: graphQLProxy } = require('@shopify/koa-shopify-graphql-proxy');
const { ApiVersion } = require('@shopify/koa-shopify-graphql-proxy');
const Router = require('koa-router');

const compression = require('compression');
const koaConnect = require('koa-connect');
const Sentry = require('@sentry/node');
// const reportEvent = require('./server/lib/reportEvent');

const {
  processPayment,
  badSessionKillerReInstall,
  badSessionKillerRedirect,
} = require('./server/middlewares');
const { apiRouter, apiPublicRouter } = require('./server/router');
const isShopPaid = require('./server/lib/isShopPaid');
const shopifyAfterAuthFlow = require('./server/lib/shopifyAfterAuthFlow');
const webhooksRouter = require('./server/webhooks');

const {
  dev,
  shopifyApiSecretKey,
  shopifyApiKey,
  port,
  debugMode,
  scopes,
} = require('./server/config');

const app = next({
  dev,
});

const handle = app.getRequestHandler();
const mongo = require('./server/db/mongo');

// const AppSpec = require('./server/models/AppSpec');

app.prepare().then(() => {
  const server = new Koa();
  server.use(koaConnect(compression()));
  server.use(bodyParser());
  server.use(cors());

  server.proxy = true;
  const router = new Router();
  mongo(server);
  server.use(session({ secure: true, sameSite: 'none', httpOnly: false }, server));
  server.keys = [shopifyApiSecretKey];
  if (dev) {
    server.use(logger());
  }

  if (!dev) {
    Sentry.init({ dsn: 'https://cb94b2be1bc14e7ca45579bf2bce94df@sentry.io/1864200' });
  }
  router.get('/', processPayment);

  server.use(async (ctx, _next) => {
    try {
      await _next();
    } catch (err) {
      err.status = err.statusCode || err.status || 500;
      ctx.body = err.message;
      console.log(`server error: ${err.message}`);
      ctx.app.emit('error', err, ctx);
    }
  });

  server.use(badSessionKillerReInstall);

  server.use(
    debugMode
    ? async (ctx, _next_) => {
      await _next_();
    }
    : createShopifyAuth({
      apiKey: shopifyApiKey,
      secret: shopifyApiSecretKey,
      accessMode: 'offline',
      scopes,
      afterAuth: shopifyAfterAuthFlow,
    }),
  );

  server.use(badSessionKillerRedirect);

  server.use(
    graphQLProxy({
      version: ApiVersion.April19,
    }),
  );

  server.use(webhooksRouter.allowedMethods());
  server.use(webhooksRouter.routes());

  server.use(apiPublicRouter.allowedMethods());
  server.use(apiPublicRouter.routes());
  server.use(router.allowedMethods());
  server.use(router.routes());

  server.use(
    debugMode
      ? async (ctx, _next_) => {
        await _next_();
      }
      : verifyRequest(),
  );

  server.use(apiRouter.allowedMethods());
  server.use(apiRouter.routes());

  server.use(
    async (ctx) => {
      if (
        ctx.cookies.get('partnerCode') &&
        ctx.request.path === '/'
        // ctx.request.path.indexOf('/_next') !== 0 &&
        // ctx.request.path.indexOf('/static') !== 0
      ) {
        // main page only, looks like it good place to auto redirection on playment
        /*
        const premiumEnabledDoc = await AppSpec.findOne({
          key: 'premiumEnabled',
        });
        */
        if (true || premiumEnabledDoc && premiumEnabledDoc.value) {
          const options = { paymentConfirmationUrl: '' };
          if (
            !(await isShopPaid(
              ctx.session.shop,
              ctx.session.accessToken,
              ctx.cookies.get('partnerCode'),
              options,
            ))
          ) {
            ctx.cookies.set('partnerCode');
            if (options.paymentConfirmationUrl) {
              // return ctx.redirect(options.paymentConfirmationUrl);

              ctx.body = `
              <script>
              if (self == top) {
                location.href = '${options.paymentConfirmationUrl}';
              } else {
                window.parent.postMessage({
                  payload: {
                    payload: {id: "0b98d08f-f88a-468c-9027-aa7827ab5e3b", url: "${options.paymentConfirmationUrl}" },
                    group: "Navigation",
                    type: "APP::NAVIGATION::REDIRECT::REMOTE",
                    version: "1.20.1",
                    clientInterface: {
                      name: "@shopify/app-bridge",
                      version: "1.20.1"
                    }
                  },
                  source: {
                    shopOrigin: '${ctx.session.shop}',
                    apiKey: '${shopifyApiKey}',
                  },
                  type: "dispatch",
                }, '*')              
              }
              </script>
              `;
              return;
            } else {
              // ctx.res.statusCode = 200;
              // return ctx.res.end('Not paid');
            }
          }
          // to avoid looping, if we leave it and user ignore payment he will be redirecting to payment page all the time
          // ctx.cookies.set('partnerCode');
        }
      }
      await handle(ctx.req, ctx.res);
      ctx.respond = false;
      ctx.res.statusCode = 200;
    },
  );


  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });

}).catch((err) => {
  console.log(err);
});
