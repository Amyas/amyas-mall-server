'use strict';

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

const middleware = require('./middleware');

const logger = require('./lib/logger').logger('app');
const validate = require('./lib/validate');
const { session, redis } = require('./lib/redis');
require('./lib/mongoose');

const helper = require('./helpers');
const models = require('./models');
const routes = require('./routes');


// middlewares
app.use(bodyparser({
  enableTypes: [ 'json', 'form', 'text' ],
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug',
}));
validate(app);

try {
  app
    .use(async (ctx, next) => {
      ctx.helper = helper;
      ctx.model = models;
      ctx.redis = redis;
      const start = new Date();
      await next();
      const ms = new Date() - start;
      logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
    })
    .use(session())
    .use(middleware())
    .use(routes.routes(), routes.allowedMethods());
} catch (error) {
  logger.error('start server failed =>', error);
}

// error-handling
app.on('error', error => {
  logger.error('app on error =>', error);
});

module.exports = app;
