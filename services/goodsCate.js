'use strict';

const GoodsCate = require('../models/GoodsCate');

/**
 * 获取商品分类子级
 */

exports.getChildren = async arr => {
  const res = arr.map(v => v.toJSON());
  for (let i = 0; i < res.length; i++) {
    const node = res[i];
    const children = await GoodsCate.find({
      _parent: node._id,
    });
    if (children.length) {
      node.children = await this.getChildren(children);
    }
  }
  return res;
};

/**
 * 获取商品分类列表
 */

exports.getItems = async () => {
  const roots = await GoodsCate.find({
    _parent: { $in: null },
  });

  const items = await this.getChildren(roots);

  return items;
};
