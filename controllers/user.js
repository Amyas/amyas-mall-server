'use strict';

const logger = require('../lib/logger').logger('controller-user');

/**
 * @api {POST} /user 创建用户
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

/**
 *
 * @api {DELETE} /user/:id 删除用户
 * @apiGroup user
 *
 */

exports.delete = async ctx => {
  const logPrefix = '更新用户';

  const id = ctx.params.id;

  const user = await ctx.model.user.remove({ _id: id });

  if (user.n !== 1) {
    ctx.body = ctx.helper.fail('用户不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 *
 * @api {PUT} /user/:id 更新用户
 * @apiGroup user
 * @apiParam  {String} [password] 密码
 * @apiParam  {String} [name] 昵称
 *
 */

exports.update = async ctx => {
  const logPrefix = '修改用户';

  const filter = [ 'password', 'name' ];
  const rules = {
    password: { type: 'string', required: false },
    name: { type: 'string', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const user = await ctx.model.user.findByIdAndUpdate(id, { $set: data });

  if (!user) {
    ctx.body = ctx.helper.fail('用户不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /api/user 用户列表
 * @apiGroup user
 * @apiParam  {String} [pageNumber=1] 当前页数
 * @apiParam  {String} [pageSize=20] 每页显示的个数
 */

exports.index = async ctx => {
  const logPrefix = '获取用户列表';

  const {
    pageNumber,
    pageSize,
    sortBy,
    orderBy,
    filter,
  } = await ctx.helper.handleQuery(ctx.query);

  const [ items, total ] = await Promise.all([
    ctx.model.user.find(filter, { password: 0 })
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: orderBy }),
    ctx.model.user.count(filter),
  ]);

  ctx.body = ctx.helper.success({
    items,
    total,
  });

  logger.info(logPrefix, ctx.query, items, total);
};
