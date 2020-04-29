'use strict';

const router = require('koa-router')({
  prefix: '/api',
});

const $ = require('../controllers');

// 用户
router
  .post('/user', $.user.create)
  .delete('/user/:id', $.user.delete)
  .put('/user/:id', $.user.update)
  .get('/user', $.user.index);

module.exports = router;
