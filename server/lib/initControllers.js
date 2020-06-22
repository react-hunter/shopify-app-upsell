/**
 * predefined actions:
 *   find: GET /
 *   findOne: GET /:id
 *   create: POST /
 *   update: PUT /:id
 *   destroy: DELETE /:
 *
 * default method is all
 *
 *
 */

function attachRoutes(publicRouter, privateRouter, path, controller, options = {}) {
  // eslint-disable-next-line no-param-reassign
  options = {
    separator: ';',
    ...options,
  };

  Object.entries(controller).forEach(([key, action]) => {
    // eslint-disable-next-line prefer-const
    let [actionName, routerMethod, protectLevel] = key.split(options.separator);
    const _router = protectLevel === 'public' ? publicRouter : privateRouter;
    if (!routerMethod) {
      switch (actionName) {
        case 'find':
          actionName = '';
          routerMethod = 'get';
          break;
        case 'findOne':
          actionName = ':id';
          routerMethod = 'get';
          break;
        case 'create':
          actionName = '';
          routerMethod = 'post';
          break;
        case 'update':
          actionName = ':id';
          routerMethod = 'put';
          break;
        case 'destroy':
          actionName = ':id';
          routerMethod = 'delete';
          break;
        default:
          routerMethod = 'all';
      }
    }

    _router[routerMethod](`${path}/${actionName}`, async (ctx, next) => {
      try {
        const data = await action(ctx, next);
        if (![302, 201, 401, 403].includes(ctx.status)) {
          ctx.status = 200;
        }
        if (![302].includes(ctx.status)) {
          ctx.body = data;
          }
      } catch (err) {
        // eslint-disable-next-line prefer-const
        let [status, message] = err.message.split(':');
        if (['400', '404'].includes(status)) {
          ctx.status = Number(status);
        } else {
          ctx.status = 500;
          message = err.message;
        }
        ctx.body = { message };
      }
    });
  });

}

function initControllers(publicRouter, privateRouter, pathControllerMap, options) {
  Object.entries(pathControllerMap).forEach(([path, controller]) => {
    attachRoutes(publicRouter, privateRouter, path, controller, options);
  });
}

module.exports = {
  attachRoutes,
  initControllers,
};
