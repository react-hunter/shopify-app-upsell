const Router = require('koa-router');
const { initControllers } = require('./lib/initControllers');

const shopController = require('./controllers/shop');
const settingsController = require('./controllers/settings');
const defaultController = require('./controllers/default');
const campaignsController = require('./controllers/campaigns');
const scriptController = require('./controllers/script');
const statisticsController = require('./controllers/statistics');
const partnersController = require('./controllers/partners');

const apiRouter = new Router();
const apiPublicRouter = new Router();

initControllers(
  apiPublicRouter,
  apiRouter,
  {
    '/default': defaultController,
    '/script': scriptController,
    '/shops': shopController,
    '/settings': settingsController,
    '/statistics': statisticsController,
    '/api/campaigns': campaignsController,
    '/partners': partnersController,
  },
  {
    separator: '->',
  },
);

module.exports = {
  apiRouter,
  apiPublicRouter,
};
