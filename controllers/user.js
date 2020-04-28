'use strict';

exports.create = async ctx => {
  const data = ctx.request.body;
  const rules = {
    username: 'string',
    password: 'string',
    name: 'string',
  };

  ctx.validate(rules, data);
};
