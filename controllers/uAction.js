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
 * @api {PUT} /u-action/remove-shop-cart 删除购物车
 * @apiGroup uAction
 */

exports.removeShopCart = async ctx => {
  const logPrefix = '删除购物车';

  const id = ctx.params.id;

  const item = await ctx.model.ShopCart.remove({ _id: id });

  ctx.body = ctx.helper.success(item);

  logger.info(logPrefix, item);
};


/**
 * @api {POST} /u-action/submit-order 提交订单
 * @apiGroup uAction
 * @apiParam  {String} _user 用户id
 * @apiParam  {Array} goods_list 商品列表
 */

exports.submitOrder = async ctx => {
  const logPrefix = '提交订单';

  const data = ctx.request.body;

  const rules = {
    _user: { type: 'string', required: true },
    goods_list: { type: 'array', required: true },
  };

  ctx.validate(rules, data);


  data.order_price = data.goods_list.reduce((total, current) => total + current.goods_price, 0);

  const order = new ctx.model.Order(data);
  await order.save();

  await ctx.model.ShopCart.deleteMany({
    _user: data._user,
  });

  ctx.body = ctx.helper.success(order);

  logger.info(logPrefix, order);
};
