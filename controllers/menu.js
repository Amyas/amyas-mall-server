'use strict';

const logger = require('../lib/logger').logger('controller-menu');

/**
 * @api {POST} /menu 创建菜单
 * @apiGroup menu
 * @apiParam  {String} menu_name 菜单名称
 * @apiParam  {String} menu_type 菜单类型 [ 'menu', 'button' ]
 * @apiParam  {String} permission_tag 权限标识 (button专属)
 * @apiParam  {String} route_name 路由名称 (menu专属)
 * @apiParam  {String} [_parent] 菜单父级
 */

exports.create = async ctx => {
  const logPrefix = '创建菜单';
  const data = ctx.request.body;

  const rules = {
    menu_name: { type: 'string', required: true },
    menu_type: { type: 'enum', values: [ 'menu', 'button' ], required: true },
    permission_tag: { type: 'string', required: false },
    route_name: { type: 'string', required: false },
    _parent: { type: 'string', required: false },
  };

  ctx.validate(rules, data);

  try {
    const menu = new ctx.model.Menu(data);
    await menu.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('菜单已存在');
      return;
    }
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};

/**
 *
 * @api {DELETE} /menu/:id 删除菜单
 * @apiGroup menu
 *
 */

exports.delete = async ctx => {
  const logPrefix = '删除菜单';

  const id = ctx.params.id;

  const goodsCate = await ctx.model.Menu.remove({ _id: id });

  if (goodsCate.n !== 1) {
    ctx.body = ctx.helper.fail('菜单不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 *
 * @api {PUT} /menu/:id 更新菜单
 * @apiGroup menu
 * @apiParam  {String} [_parent] 菜单父级
 * @apiParam  {String} menu_name 菜单名称
 * @apiParam  {String} menu_type 菜单类型
 * @apiParam  {String} [permission_tag] 权限标识
 * @apiParam  {String} [route_name] 路由名称
 *
 */

exports.update = async ctx => {
  const logPrefix = '修改菜单';

  const filter = [
    '_parent',
    'menu_name',
    'menu_type',
    'permission_tag',
    'route_name',

  ];
  const rules = {
    menu_name: { type: 'string', required: true },
    menu_type: { type: 'string', required: true },
    _parent: { type: 'string', required: false },
    permission_tag: { type: 'string', required: false },
    route_name: { type: 'string', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const menu = await ctx.model.Menu.findByIdAndUpdate(id, { $set: data });

  if (!menu) {
    ctx.body = ctx.helper.fail('菜单不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /menu 菜单列表
 * @apiGroup menu
 */

exports.index = async ctx => {
  const logPrefix = '获取菜单列表';

  const items = await ctx.service.menu.getItems();

  ctx.body = ctx.helper.success({
    items,
  });

  logger.info(logPrefix, ctx.query);
};
