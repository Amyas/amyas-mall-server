'use strict';

exports.success = data => ({
  status: {
    errCode: -1,
    message: 'success',
  },
  data,
});

exports.fail = message => ({
  status: {
    errCode: 1,
    message,
  },
});
