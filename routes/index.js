'use strict';

const router = require('koa-router')({
  prefix: '/api',
});

const $ = require('../controllers');

// 工具
router
  .post('/upload', $.utils.uploadfile); // 上传文件

// 权限
router
  .post('/sign-in', $.auth.signIn) // 登陆
  .post('/sign-out', $.auth.signOut) // 退出
  .get('/user-menu', $.auth.userMenu); // 用户菜单

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

// 商品管理
router
  .post('/goods', $.goods.create)
  .delete('/goods/:id', $.goods.delete)
  .put('/goods/:id', $.goods.update)
  .get('/goods', $.goods.index);

// 用户行为
router
  .post('/u-action/add-shop-cart', $.uAction.addShopCart)
  .get('/u-action/query-shop-cart/:id', $.uAction.queryShopCart)
  .put('/u-action/remove-shop-cart/:id', $.uAction.removeShopCart)
  .post('/u-action/submit-order', $.uAction.submitOrder);


// 依赖管理
router
  .get('/dependence', $.dependence.update);
// .delete('/menu/:id', $.menu.delete)
// .put('/menu/:id', $.menu.update)
// .get('/menu', $.menu.index);


module.exports = router;
