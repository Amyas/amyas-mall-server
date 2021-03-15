'use strict';

const logger = require('../lib/logger').logger('controller-topic');

/**
 * @api {POST} /topic 创建面试题
 * @apiGroup topic
 * @apiParam  {String} topic_name       面试题名称
 * @apiParam  {String} topic_analysis   面试题解析
 */

exports.create = async ctx => {
  const logPrefix = '创建面试题';
  const data = ctx.request.body;

  const rules = {
    topic_name: { type: 'string', required: true },
    topic_analysis: { type: 'string', required: true },
  };

  ctx.validate(rules, data);

  try {
    const topic = new ctx.model.Topic(data);
    await topic.save();
  } catch (error) {
    if (error.code === 11000) {
      ctx.body = ctx.helper.fail('面试题已存在');
      return;
    }
    ctx.body = ctx.helper.fail(error);
    return;
  }

  ctx.body = ctx.helper.success('创建成功');

  logger.info(logPrefix, data);
};

/**
 * @api {DELETE} /topic/:id 删除面试题
 * @apiGroup topic
 */

exports.delete = async ctx => {
  const logPrefix = '删除面试题';

  const id = ctx.params.id;

  const topic = await ctx.model.Topic.remove({ _id: id });

  if (topic.n !== 1) {
    ctx.body = ctx.helper.fail('面试题不存在');
    return;
  }

  ctx.body = ctx.helper.success('删除成功');

  logger.info(logPrefix, id);
};

/**
 * @api {PUT} /topic/:id 更新面试题
 * @apiGroup topic
 * @apiParam  {String} [topic_name]     面试题名称
 * @apiParam  {String} [topic_analysis] 面试题解析
 */

exports.update = async ctx => {
  const logPrefix = '修改面试题';

  const filter = [
    'topic_name',
    'topic_analysis',
  ];

  const rules = {
    topic_name: { type: 'string', required: false },
    topic_analysis: { type: 'string', required: false },
  };

  const id = ctx.params.id;
  const data = await ctx.helper.filterParams(ctx.request.body, filter);
  ctx.validate(rules, data);

  const topic = await ctx.model.Topic.findByIdAndUpdate(id, { $set: data });

  if (!topic) {
    ctx.body = ctx.helper.fail('面试题不存在');
    return;
  }

  ctx.body = ctx.helper.success('修改成功');

  logger.info(logPrefix, id, data);
};

/**
 * @api {GET} /api/topic 面试题列表
 * @apiGroup topic
 * @apiParam  {String} [pageNumber=1] 当前页数
 * @apiParam  {String} [pageSize=20] 每页显示的个数
 */

exports.index = async ctx => {
  const logPrefix = '获取面试题列表';

  const {
    pageNumber,
    pageSize,
    sortBy,
    orderBy,
    filter,
  } = await ctx.helper.handleQuery(ctx.query);

  const [ items, total ] = await Promise.all([
    ctx.model.Topic.find(filter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize)
      .sort({ [sortBy]: orderBy }),
    ctx.model.Topic.count(filter),
  ]);

  ctx.body = ctx.helper.success({
    items,
    total,
  });

  logger.info(logPrefix, ctx.query, items, total);
};
