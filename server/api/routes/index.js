const Router = require('@koa/router');
const rootRouter = new Router({ prefix: '/api' });

const usersRoutes = require('./users.routes');
const authRoutes = require('./auth.routes');
const ordersRoutes = require('./orders.routes');
const driversRoutes = require('./drivers.routes');

module.exports = app => {
  rootRouter.use(usersRoutes.routes());
  rootRouter.use(authRoutes.routes());
  rootRouter.use(ordersRoutes.routes());
  rootRouter.use(driversRoutes.routes());

  app.use(rootRouter.routes());
};
