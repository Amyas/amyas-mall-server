'use strict';

// const logger = require('../lib/logger').logger('controller-dependence');

/**
 * @api {POST} /dependence 创建依赖
 * @apiGroup dependence
 */

exports.update = async ctx => {
  console.log(ctx.query);
  ctx.body = ctx.helper.success('创建成功');
};
