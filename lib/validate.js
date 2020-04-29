'use strict';

const Parameter = require('parameter');

module.exports = app => {
  const validator = new Parameter();
  app.context.validate = (rules, data) => {
    const errors = validator.validate(rules, data);
    if (errors) {
      // const errorsFormat = errors.map(v => {
      //   return Object.keys(v).map(j => {
      //     return `${j}:${v[j]}`;
      //   });
      // });
      throw new Error('校验失败');
    }
  };
};
