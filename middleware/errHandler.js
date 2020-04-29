'use strict';
const helpers = require('../helpers');
const logger = require('../lib/logger').logger('middleware-errHandler');

module.exports = () => async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    logger.error(error);
    ctx.status = error.status || 500;
    ctx.body = helpers.fail(error.message);
  }
};
