'use strict';

const Koa = require('koa');
const app = new Koa();
const views = require('koa-views');
const json = require('koa-json');
const bodyparser = require('koa-bodyparser');

const logger = require('./lib/logger').logger('app');
const validate = require('./lib/validate');

require('./lib/mongoose');

const Helper = require('./helpers');

const index = require('./routes/index');
const users = require('./routes/users');

validate(app);

// middlewares
app.use(bodyparser({
  enableTypes: [ 'json', 'form', 'text' ],
}));
app.use(json());
app.use(require('koa-static')(__dirname + '/public'));

app.use(views(__dirname + '/views', {
  extension: 'pug',
}));

try {
  app.use(async (ctx, next) => {
    ctx.helper = Helper;
    const start = new Date();
    await next();
    const ms = new Date() - start;
    logger.info(`${ctx.method} ${ctx.url} - ${ms}ms`);
  });
} catch (error) {
  logger.error('start server failed =>', error);
}

// routes
app.use(index.routes(), index.allowedMethods());
app.use(users.routes(), users.allowedMethods());

// error-handling
app.on('error', error => {
  logger.error('app on error =>', error);
});

module.exports = app;
