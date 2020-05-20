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

// 商品分类
router
  .post('/goods-cate', $.goodsCate.create)
  .delete('/goods-cate/:id', $.goodsCate.delete)
  .put('/goods-cate/:id', $.goodsCate.update)
  .get('/goods-cate', $.goodsCate.index);

// 菜单管理
router
  .post('/menu', $.menu.create)
  .delete('/menu/:id', $.menu.delete)
  .put('/menu/:id', $.menu.update)
  .get('/menu', $.menu.index);

// 角色管理
router
  .post('/role', $.role.create)
  .delete('/role/:id', $.role.delete)
  .put('/role/:id', $.role.update)
  .get('/role', $.role.index);

module.exports = router;
