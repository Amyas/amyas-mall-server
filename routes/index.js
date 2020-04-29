'use strict';

const router = require('koa-router')({
  prefix: '/api',
});

const $ = require('../controllers');

// 用户
router
  .get('/user', $.user.index)
  .post('/user', $.user.create);

module.exports = router;
