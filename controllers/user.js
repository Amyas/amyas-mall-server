'use strict';

const logger = require('../lib/logger').logger('controller-user');

/**
 * @api {POST} /api/user 创建用户
 * @apiGroup user
 * @apiParam  {String} username 账号
 * @apiParam  {String} password 密码
 * @apiParam  {String} name 名字
 */

exports.create = async ctx => {
  const logPrefix = '创建用户';
  const data = ctx.request.body;

  const rules = {
    username: 'string',
    password: 'string',
    name: 'string',
  };

  ctx.validate(rules, data);

  try {
    const user = new ctx.model.user(data);
    await user.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('用户已存在');
      return;
    }
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};
