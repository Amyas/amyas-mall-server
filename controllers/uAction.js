'use strict';

const logger = require('../lib/logger').logger('controller-uAction');

/**
 * @api {POST} /u-action/add-shop-cart 加入购物车
 * @apiGroup uAction
 * @apiParam  {String} _user 用户id
 * @apiParam  {String} _goods 商品id
 */

exports.addShopCart = async ctx => {
  const logPrefix = '加入购物车';
  const data = ctx.request.body;

  const rules = {
    _user: 'string',
    _goods: 'string',
  };

  ctx.validate(rules, data);


  const shopCart = new ctx.model.ShopCart(data);
  await shopCart.save();

  ctx.body = ctx.helper.success(shopCart);

  logger.info(logPrefix, data);
};

/**
 * @api {GET} /u-action/query-shop-cart 获取购物车
 * @apiGroup uAction
 */

exports.queryShopCart = async ctx => {
  const logPrefix = '获取购物车';

  const id = ctx.params.id;

  const items = await ctx.model.ShopCart.find({
    _user: id,
  })
    .populate('_user')
    .populate('_goods');

  ctx.body = ctx.helper.success(items);

  logger.info(logPrefix, items);
};

/**
 * @api {GET} /u-action/remove-shop-cart 删除购物车
 * @apiGroup uAction
 */

exports.removeShopCart = async ctx => {
  const logPrefix = '删除购物车';

  const id = ctx.params.id;

  const item = await ctx.model.ShopCart.remove({ _id: id });

  ctx.body = ctx.helper.success(item);

  logger.info(logPrefix, item);
};
