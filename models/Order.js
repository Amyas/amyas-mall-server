'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.Schema.Types;


const OrderSchema = new mongoose.Schema({
  // 购买人
  _user: {
    type: ObjectId,
    ref: 'GoodsCate',
  },
  // 订单价格
  order_price: {
    type: Number,
    required: true,
  },
  // 订单状态
  order_status: {
    type: Number,
    default: 1,
    // 1->未付款 2->未发货 3->未收获 4->已收获 5->已评价
    enum: [ 1, 2, 3, 4, 5 ],
  },
  // 商品列表
  goods_list: {
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

OrderSchema.pre('findOneAndUpdate', updateHook);
OrderSchema.pre('update', updateHook);

module.exports = mall.model('Order', OrderSchema);
