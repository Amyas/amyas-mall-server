'use strict';

const router = require('koa-router')();

router.get('/', async ctx => {
  ctx.body = ctx.helper.success({
    name: 'Amyas',
  });
});

router.get('/string', async ctx => {
  ctx.body = ctx.helper.fail(10001, '错误测试');
});

router.get('/json', async ctx => {
  ctx.body = {
    title: 'koa2 json',
  };
});

module.exports = router;
