'use strict';

const compose = require('koa-compose');
const auth = require('./auth');
const errHandler = require('./errHandler');

module.exports = function() {
  return compose(
    [
      auth(),
      errHandler(),
    ]
  );
};
