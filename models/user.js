'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;

const UserSchema = new mongoose.Schema({
  // 账号
  username: {
    type: String,
    required: true,
    unique: true,
  },
  // 密码
  password: {
    type: String,
    required: true,
  },
  // 昵称
  name: {
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

UserSchema.pre('findOneAndUpdate', updateHook);
UserSchema.pre('update', updateHook);

module.exports = mall.model('User', UserSchema);
