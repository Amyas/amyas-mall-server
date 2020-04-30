'use strict';

const router = require('koa-router')({
  prefix: '/api',
});

const $ = require('../controllers');

// 权限
router
  .post('/sign-in', $.auth.signIn) // 登陆
  .post('/sign-out', $.auth.signOut); // 退出

// 用户
router
  .post('/user', $.user.create)
  .delete('/user/:id', $.user.delete)
  .put('/user/:id', $.user.update)
  .get('/user', $.user.index);

module.exports = router;
