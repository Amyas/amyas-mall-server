'use strict';

const logger = require('../lib/logger').logger('controller-goodsCate');

/**
 * @api {POST} /goods-cate 创建商品分类
 * @apiGroup goods-cate
 * @apiParam  {String} name 分类名称
 * @apiParam  {String} [_parent] 分类父级
 */

exports.create = async ctx => {
  const logPrefix = '创建商品分类';
  const data = ctx.request.body;

  const rules = {
    name: { type: 'string', required: true },
    _parent: { type: 'string', required: false },
  };

  ctx.validate(rules, data);

  try {
    const goodsCate = new ctx.model.GoodsCate(data);
    await goodsCate.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('商品分类已存在');
      return;
    }
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};

/**
 *
 * @api {DELETE} /goods-cate/:id 删除商品分类
 * @apiGroup goods-cate
 *
 */

exports.delete = async ctx => {
  const logPrefix = '删除商品分类';

  const id = ctx.params.id;

  const goodsCate = await ctx.model.GoodsCate.remove({ _id: id });

  if (goodsCate.n !== 1) {
    ctx.body = ctx.helper.fail('商品分类不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 *
 * @api {PUT} /goods-cate/:id 更新商品分类
 * @apiGroup goods-cate
 * @apiParam  {String} [name] 商品分类昵称
 * @apiParam  {String} [_parent] 商品分类父级
 *
 */

exports.update = async ctx => {
  const logPrefix = '修改商品分类';

  const filter = [ 'name', '_parent' ];
  const rules = {
    name: { type: 'string', required: false },
    _parent: { type: 'string', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const goodsCate = await ctx.model.GoodsCate.findByIdAndUpdate(id, { $set: data });

  if (!goodsCate) {
    ctx.body = ctx.helper.fail('商品分类不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /api/goods-cate 商品分类列表
 * @apiGroup goods-cate
 * @apiParam  {String} [pageNumber=1] 当前页数
 * @apiParam  {String} [pageSize=20] 每页显示的个数
 */

exports.index = async ctx => {
  const logPrefix = '获取商品分类列表';

  const items = await ctx.service.goodsCate.getItems();

  ctx.body = ctx.helper.success({
    items,
  });

  logger.info(logPrefix, ctx.query);
};
