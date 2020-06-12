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

exports.filterParams = async (data, filter) => {
  const result = {};
  filter.forEach(v => {
    const val = data[v];
    if (val !== null && val !== undefined && val !== '') {
      result[v] = data[v];
    }
  });
  return result;
};

exports.handleQuery = async query => {
  const newQuery = Object.assign({}, query); // 将对象复制一份，不破坏原数据
  const result = {
    pageNumber: Number(newQuery.pageNumber) || 1, // 页数
    pageSize: Number(newQuery.pageSize) || 20, // 每页个数
    sortBy: newQuery.sortBy || 'updateTime', // 排序字段
    orderBy: Number(newQuery.orderBy) || -1, // 1 - 升序， -1 - 降序
  };
  delete newQuery.pageNumber;
  delete newQuery.pageSize;
  delete newQuery.sortBy;
  delete newQuery.orderBy;
  result.filter = newQuery;
  return result;
};
