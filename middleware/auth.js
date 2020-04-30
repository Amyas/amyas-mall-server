'use strict';
const helpers = require('../helpers');
const logger = require('../lib/logger').logger('middleware-auth');

module.exports = () => async (ctx, next) => {
  try {
    if (ctx.request.url === '/api/sign-in') {
      await next();
      return;
    }
    if (!ctx.session.user) {
      ctx.status = 401;
      ctx.body = helpers.fail('请先登陆');
      return;
    }
    await next();
  } catch (error) {
    logger.error(error);
    ctx.status = error.status || 500;
    ctx.body = helpers.fail(error.message);
  }
};
