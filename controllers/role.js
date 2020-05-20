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
 * @apiParam  {String} role_name 角色名称
 * @apiParam  {Array} [role_menu] 角色菜单
 *
 */

exports.update = async ctx => {
  const logPrefix = '更新角色';

  const filter = [ 'role_name', 'role_menu' ];
  const rules = {
    role_name: { type: 'string', required: true },
    role_menu: { type: 'array', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const Role = await ctx.model.Role.findByIdAndUpdate(id, { $set: data });

  if (!Role) {
    ctx.body = ctx.helper.fail('角色不存在');
    return;
  }

  await Promise.all(
    data.role_menu.map(_menu =>
      ctx.model.RoleMenu.findOneAndUpdate({
        _role: id,
        _menu,
      }, {
        _role: id,
        _menu,
      }, { upsert: true })
    )
  );

  await ctx.model.RoleMenu.deleteMany({
    _role: id,
    _menu: { $nin: data.role_menu },
  });

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

  const roleMenu = await Promise.all(
    items.map(
      role => ctx.model.RoleMenu
        .find({
          _role: role._id,
        }).populate('_menu')
    )
  );

  const resItems = [];
  items.forEach((role, roleIndex) => {
    role = role.toJSON();
    const role_menu = roleMenu[roleIndex].filter(v => String(v._role) === String(role._id));
    role.role_menu = role_menu;
    resItems.push(role);
  });

  ctx.body = ctx.helper.success({
    items: resItems,
    total,
  });

  logger.info(logPrefix, ctx.query);
};
