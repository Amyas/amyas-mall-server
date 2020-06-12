'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.Schema.Types;


const ShopCartSchema = new mongoose.Schema({
  // 用户
  _user: {
    type: ObjectId,
    ref: 'User',
  },
  // 商品
  _goods: {
    type: ObjectId,
    ref: 'Goods',
  },
  createTime: {
    type: Number,
    default: Date.now,
  },
  updateTime: {
    type: Number,
    default: Date.now,
  },
});

const updateHook = function() {
  if (this.options.overwrite) {
    this._update.updateTime = Date.now();
  } else {
    this._update.$set = this._update.$set || {};
    this._update.$set.updateTime = Date.now();
  }
};

ShopCartSchema.pre('findOneAndUpdate', updateHook);
ShopCartSchema.pre('update', updateHook);

module.exports = mall.model('ShopCart', ShopCartSchema);
