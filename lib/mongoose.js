'use strict';

const mongoose = require('mongoose');
const config = require('../config');
const logger = require('./logger').logger('mongoose');

const dbs = {};
const mongodbConfig = config.mongodb;

for (const clientName in mongodbConfig) {
  const currentClient = mongodbConfig[clientName];
  const {
    host,
    dbName,
    userName,
    password,
    authSource,
    replicaSet,
  } = currentClient;

  let connectionURL = 'mongodb://';

  if (userName && password) {
    connectionURL += `${userName}:${password}@`;
  }

  connectionURL += `${host}/${dbName}?`;

  if (replicaSet) {
    connectionURL += `replicaSet=${replicaSet}`;
  }

  if (authSource) {
    connectionURL += `authSource=${authSource}`;
  }

  const db = mongoose.createConnection(connectionURL, {
    poolSize: 10, // 连接池数量
    useNewUrlParser: true, // 解决使用字符串连接url报错
    useFindAndModify: false, // 用于解决findAndModify()弃用警告
    useUnifiedTopology: true, // 解决监视引擎弃用警告
    useCreateIndex: true, // 解决 createIndex 弃用报错
  });
  dbs[clientName] = db;

  db.on('error', error => logger.error(error))
    .on('close', () => logger.info('Database connection closed.'))
    .once('open', () => logger.info(`DB ${clientName} opend!`));

}

module.exports = dbs;
