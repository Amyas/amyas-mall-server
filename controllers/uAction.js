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
