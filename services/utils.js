'use strict';

const qiniu = require('qiniu');
const Promise = require('bluebird');
const config = require('../config');

// 创建七牛token
exports.createQiniuToken = async (key, fileType) => {
  const mac = new qiniu.auth.digest.Mac(config.qiniu.ak, config.qiniu.sk);
  const options = {
    scope: config.qiniu[fileType].bucket + ':' + key,
  };
  const putPolicy = new qiniu.rs.PutPolicy(options);
  return putPolicy.uploadToken(mac);
};

// 创建七牛bucketManager
exports.createBucketManager = async () => {
  const mac = new qiniu.auth.digest.Mac(config.qiniu.ak, config.qiniu.sk);
  const qnConfig = new qiniu.conf.Config();
  qnConfig.zone = qiniu.zone.Zone_z1;
  const bucketManager = new qiniu.rs.BucketManager(mac, qnConfig);
  return Promise.promisifyAll(bucketManager);
};

// 上传文件到七牛
exports.uploadFile = async (token, key, stream) => {
  const qnConfig = new qiniu.conf.Config();
  qnConfig.zone = qiniu.zone.Zone_z1;
  const formUploader = Promise.promisifyAll(new qiniu.form_up.FormUploader(qnConfig));
  const putExtra = new qiniu.form_up.PutExtra();

  const data = await formUploader.putStreamAsync(token, key, stream, putExtra);

  return data;
};

// 获取文件外链
exports.getUrl = async (key, fileType) => {
  return `http://${config.qiniu[fileType].domain}/${key}`;
};
