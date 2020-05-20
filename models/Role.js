'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;

const RoleSchema = new mongoose.Schema({
  // 角色名称
  role_name: {
    type: String,
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

RoleSchema.pre('findOneAndUpdate', updateHook);
RoleSchema.pre('update', updateHook);

module.exports = mall.model('Role', RoleSchema);
