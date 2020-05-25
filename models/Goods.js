'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.Schema.Types;


const GoodsSchema = new mongoose.Schema({
  // 商品名称
  goods_name: {
    type: String,
    required: true,
  },
  // 商品分类
  goods_cate: {
    type: ObjectId,
    ref: 'GoodsCate',
  },
  // 商品价格
  goods_price: {
    type: Number,
    required: true,
  },
  // 商品简介
  goods_intro: {
    type: String,
    required: true,
  },
  // 商品详情
  goods_detail: {
    type: String,
    required: true,
  },
  // 商品轮播图
  goods_carousel: {
    type: Array,
    required: true,
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

GoodsSchema.pre('findOneAndUpdate', updateHook);
GoodsSchema.pre('update', updateHook);

module.exports = mall.model('Goods', GoodsSchema);
