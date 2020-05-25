'use strict';

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
// const bodyparser = require('koa-bodyparser');
const koaBody = require('koa-body');

const middleware = require('./middleware');

const logger = require('./lib/logger').logger('app');
const validate = require('./lib/validate');
const { session, redis } = require('./lib/redis');
require('./lib/mongoose');

const helper = require('./helpers');
const models = require('./models');
const routes = require('./routes');
const service = require('./services');

app.keys = [ 'amyas_mall_session_token' ];

// middlewares
// app.use(bodyparser({
//   enableTypes: [ 'json', 'form', 'text' ],
// }));
app.use(koaBody({
  multipart: true,
  formidable: {
    maxFileSize: 20 * 1024 * 1024, // 设置上传文件最大限制，模式2M
  },
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
      ctx.service = service;
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
