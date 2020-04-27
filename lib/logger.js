'use strict';

const log4js = require('log4js');

const logLayout = {
  type: 'pattern',
  pattern: '%h %x{pid} [%d] [%p] %c > %m',
  tokens: {
    pid() {
      return process.pid;
    },
  },
};

log4js.configure({
  appenders: {
    out: {
      type: 'DateFile',
      filename: 'log.log',
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      layout: logLayout,
    },
  },
  categories: {
    default: {
      appenders: [ 'out' ],
      level: 'info',
    },
  },
});

// logger.info('msg');
// logger.warn('msg');
// logger.error('msg');
// logger.fatal('msg');
exports.logger = moduleName => {
  const l = log4js.getLogger(moduleName);
  return l;
};
