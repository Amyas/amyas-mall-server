'use strict';

const Menu = require('../models/Menu');

/**
 * 获取子级
 */

exports.getChildren = async arr => {
  const res = arr.map(v => v.toJSON());
  for (let i = 0; i < res.length; i++) {
    const node = res[i];
    const children = await Menu.find({
      _parent: node._id,
    });
    if (children.length) {
      node.children = await this.getChildren(children);
    }
  }
  return res;
};

/**
 * 获取列表
 */

exports.getItems = async () => {
  const roots = await Menu.find({
    _parent: { $in: null },
  });

  const items = await this.getChildren(roots);

  return items;
};
