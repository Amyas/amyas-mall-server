'use strict';

const mongoose = require('mongoose');
const mall = require('../lib/mongoose').mall;


const TopicSchema = new mongoose.Schema({
  // 面试题名称
  topic_name: {
    type: String,
    required: true,
  },
  // 面试题解析
  topic_analysis: {
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

TopicSchema.pre('findOneAndUpdate', updateHook);
TopicSchema.pre('update', updateHook);

module.exports = mall.model('Topic', TopicSchema);
