'use strict';

/**
 * @api {POST} /api/user 创建用户
 * @apiGroup user
 * @apiParam  {String} username 账号
 * @apiParam  {String} password 密码
 * @apiParam  {String} name 名字
 */

exports.create = async ctx => {
  const data = ctx.request.body;
  const rules = {
    username: 'string',
    password: 'string',
    name: 'string',
  };

  ctx.validate(rules, data);
};
