'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.SchemaTypes;

const RoleMenuSchema = new mongoose.Schema({
  // 角色
  _role: {
    type: ObjectId,
    ref: 'Role',
  },
  // 菜单
  _menu: {
    type: ObjectId,
    ref: 'Menu',
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

RoleMenuSchema.pre('findOneAndUpdate', updateHook);
RoleMenuSchema.pre('update', updateHook);

module.exports = mall.model('RoleMenu', RoleMenuSchema);
