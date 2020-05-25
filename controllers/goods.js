'use strict';

const logger = require('../lib/logger').logger('controller-goods');

/**
 * @api {POST} /goods 创建商品
 * @apiGroup goods
 * @apiParam  {String} goods_name   商品名称
 * @apiParam  {String} goods_cate   商品分类
 * @apiParam  {Number} goods_price  商品价格
 * @apiParam  {String} goods_intro  商品简介
 * @apiParam  {String} goods_detail 商品详情
 * @apiParam  {Array}  goods_carousel 商品轮播图
 */

exports.create = async ctx => {
  const logPrefix = '创建商品';
  const data = ctx.request.body;

  const rules = {
    goods_name: { type: 'string', required: true },
    goods_cate: { type: 'string', required: true },
    goods_price: { type: 'number', required: true },
    goods_intro: { type: 'string', required: true },
    goods_detail: { type: 'string', required: true },
    goods_carousel: { type: 'array', itemType: 'string', required: true },
  };

  ctx.validate(rules, data);

  try {
    const goods = new ctx.model.Goods(data);
    await goods.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('商品已存在');
      return;
    }
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};

/**
 * @api {DELETE} /goods/:id 删除商品
 * @apiGroup goods
 */

exports.delete = async ctx => {
  const logPrefix = '删除商品';

  const id = ctx.params.id;

  const goods = await ctx.model.Goods.remove({ _id: id });

  if (goods.n !== 1) {
    ctx.body = ctx.helper.fail('商品不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 * @api {PUT} /goods/:id 更新商品
 * @apiGroup goods
 * @apiParam  {String} [goods_name] 商品名称
 * @apiParam  {String} [goods_cate] 商品分类
 * @apiParam  {Number} [goods_price] 商品价格
 * @apiParam  {String} [goods_intro] 商品简介
 * @apiParam  {String} [goods_detail] 商品详情
 * @apiParam  {Array} [goods_carousel] 商品轮播图
 */

exports.update = async ctx => {
  const logPrefix = '修改商品';

  const filter = [
    'goods_name',
    'goods_cate',
    'goods_price',
    'goods_intro',
    'goods_detail',
    'goods_carousel',
  ];

  const rules = {
    goods_name: { type: 'string', required: false },
    goods_cate: { type: 'string', required: false },
    goods_price: { type: 'number', required: false },
    goods_intro: { type: 'string', required: false },
    goods_detail: { type: 'string', required: false },
    goods_carousel: { type: 'array', itemType: 'string', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const goods = await ctx.model.Goods.findByIdAndUpdate(id, { $set: data });

  if (!goods) {
    ctx.body = ctx.helper.fail('商品不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /api/goods 商品列表
 * @apiGroup goods
 * @apiParam  {String} [pageNumber=1] 当前页数
 * @apiParam  {String} [pageSize=20] 每页显示的个数
 */

exports.index = async ctx => {
  const logPrefix = '获取商品列表';

  const {
    pageNumber,
    pageSize,
    sortBy,
    orderBy,
    filter,
  } = await ctx.helper.handleQuery(ctx.query);

  const [ items, total ] = await Promise.all([
    ctx.model.Goods.find(filter)
      .populate('goods_cate')
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: orderBy }),
    ctx.model.Goods.count(filter),
  ]);

  ctx.body = ctx.helper.success({
    items,
    total,
  });

  logger.info(logPrefix, ctx.query, items, total);
};
