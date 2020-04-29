'use strict';

const router = require('koa-router')({
  prefix: '/api',
});

const $ = require('../controllers');

// 用户
router
  .post('/user', $.user.create)
  .delete('/user/:id', $.user.delete);

module.exports = router;
