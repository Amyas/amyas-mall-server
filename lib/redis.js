'use strict';

const session = require('koa-generic-session');
const redisConfig = require('../config').redis;
const redisStore = require('koa-redis')(redisConfig);

exports.session = () => session({
  prefix: 'mall:',
  // 配置cookie
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  },
  // 配置redis
  store: redisStore,
});

exports.redis = redisStore.client;
