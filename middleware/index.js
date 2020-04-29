'use strict';

const compose = require('koa-compose');
const errHandler = require('./errHandler');

module.exports = function() {
  return compose(
    [
      errHandler(),
    ]
  );
};
