'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.Schema.Types;

const GoodsCateSchema = new mongoose.Schema({
  // 商品类型名称
  name: {
    type: String,
    required: true,
    unique: true,
  },
  // 商品类型父级
  _parent: {
    type: ObjectId,
    ref: 'GoodsType',
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

GoodsCateSchema.pre('findOneAndUpdate', updateHook);
GoodsCateSchema.pre('update', updateHook);

module.exports = mall.model('GoodsCate', GoodsCateSchema);
