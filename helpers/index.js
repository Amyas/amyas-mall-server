'use strict';

exports.success = data => ({
  status: {
    errCode: -1,
    message: 'success',
  },
  data,
});

exports.fail = (errCode, message) => ({
  status: {
    errCode,
    message,
  },
});
