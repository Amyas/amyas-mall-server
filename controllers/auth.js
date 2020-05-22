'use strict';

const logger = require('../lib/logger').logger('controller-auth');

/**
 * @api {POST} /sign-in 登陆
 * @apiGroup auth
 * @apiParam  {String} username 账号
 * @apiParam  {String} password 密码
 */

exports.signIn = async ctx => {
  const logPrefix = '登陆';
  const data = ctx.request.body;

  const rules = {
    username: 'string',
    password: 'string',
  };

  ctx.validate(rules, data);

  const user = await ctx.model.User.findOne(data);

  if (!user) {
    ctx.body = ctx.helper.fail('账号密码错误');
    return;
  }

  ctx.session.user = user;
  ctx.body = ctx.helper.success(user);

  logger.info(logPrefix, data);
};

/**
 * @api {POST} /sign-out 退出
 * @apiGroup auth
 */

exports.signOut = async ctx => {
  const logPrefix = '退出登陆';

  const user = ctx.session.user;

  ctx.session = null;

  ctx.body = ctx.helper.success('退出成功');

  logger.info(logPrefix, user);
};

/**
 * @api {GET} /user-menu 用户菜单
 * @apiGroup auth
 */

exports.userMenu = async ctx => {
  const logPrefix = '获取用户菜单';
  const user = ctx.session.user;
  const roleId = user._role;

  // 获取用户角色菜单
  const roleMenu = await ctx.model.RoleMenu.find({
    _role: roleId,
  }).populate('_menu');


  const res = [];
  for (let i = 0; i < roleMenu.length; i++) {
    const menu = roleMenu[i]._menu.toJSON();
    if (!menu._parent) {
      res.push(Object.assign({}, menu, {
        children: [],
      }));
      continue;
    }

    const parent = res.find(v => String(v._id) === String(menu._parent));

    parent.children.push(menu);
  }


  ctx.body = ctx.helper.success(res);

  logger.info(logPrefix, user, roleMenu);
};
