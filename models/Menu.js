'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;
const { ObjectId } = mongoose.Schema.Types;

const MenuSchema = new mongoose.Schema({
  // 菜单名称
  menu_name: {
    type: String,
    required: true,
  },
  // 菜单类型
  menu_type: {
    type: String,
    // menu -> 菜单 button -> 按钮
    enum: [ 'menu', 'button' ],
    default: 'menu',
  },
  // 权限标识
  permission_tag: {
    type: String,
  },
  // 路由名称
  route_name: {
    type: String,
  },
  // 菜单父级
  _parent: {
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

MenuSchema.pre('findOneAndUpdate', updateHook);
MenuSchema.pre('update', updateHook);

module.exports = mall.model('Menu', MenuSchema);
