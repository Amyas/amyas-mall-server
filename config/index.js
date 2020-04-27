'use strict';

const common = require('./common');

const env = process.env.NODE_ENV;

const config = require(`./${env}`);

const result = Object.assign({}, common, config);

module.exports = result;
