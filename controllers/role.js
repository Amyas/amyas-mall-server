'use strict';

const logger = require('../lib/logger').logger('controller-role');

/**
 * @api {POST} /role 创建角色
 * @apiGroup role
 * @apiParam  {String} role_name 角色名称
 */

exports.create = async ctx => {
  const logPrefix = '创建角色';
  const data = ctx.request.body;

  const rules = {
    role_name: { type: 'string', required: true },
  };

  ctx.validate(rules, data);

  try {
    const role = new ctx.model.Role(data);
    await role.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('角色已存在');
      return;
    }
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};

/**
 *
 * @api {DELETE} /role/:id 删除角色
 * @apiGroup role
 *
 */

exports.delete = async ctx => {
  const logPrefix = '删除角色';

  const id = ctx.params.id;

  const role = await ctx.model.Role.remove({ _id: id });

  if (role.n !== 1) {
    ctx.body = ctx.helper.fail('角色不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 *
 * @api {PUT} /role/:id 更新角色
 * @apiGroup role
 * @apiParam  {String} role_name 菜单名称
 *
 */

exports.update = async ctx => {
  const logPrefix = '更新角色';

  const filter = [ 'role_name' ];
  const rules = {
    role_name: { type: 'string', required: true },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const Role = await ctx.model.Role.findByIdAndUpdate(id, { $set: data });

  if (!Role) {
    ctx.body = ctx.helper.fail('角色不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /role 角色列表
 * @apiGroup role
 */

exports.index = async ctx => {
  const logPrefix = '获取角色列表';

  const {
    pageNumber,
    pageSize,
    sortBy,
    orderBy,
    filter,
  } = await ctx.helper.handleQuery(ctx.query);

  const [ items, total ] = await Promise.all([
    ctx.model.Role.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: orderBy }),
    ctx.model.Role.count(filter),
  ]);

  ctx.body = ctx.helper.success({
    items,
    total,
  });

  logger.info(logPrefix, ctx.query);
};
