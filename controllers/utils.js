'use strict';
const fs = require('fs');
const path = require('path');

/**
 * @api {POST} /api/uploadfile 上传单个文件
 * @apiGroup file
 * @apiVersion  1.0.0
 */

exports.uploadfile = async ctx => {
  // 获取上传文件
  const file = ctx.request.files.file;
  // 创建可读流
  const reader = fs.createReadStream(file.path);

  // 处理文件名：时间戳-随机数.后缀
  const random = Math.ceil(Math.random() * 1000000);
  const extension = path.extname(file.name);
  const fileName = `${Date.now()}-${random}${extension}`;

  // 处理文件类型;
  const FILE_ENUM = [ 'image', 'audio', 'video' ];
  const fileType = FILE_ENUM.find(v => file.type.indexOf(v) !== -1) || 'file';

  // 创建七牛token
  const token = await ctx.service.utils.createQiniuToken(fileName, fileType);

  // 上传文件
  const data = await ctx.service.utils.uploadFile(token, fileName, reader);

  // 获取URL
  const url = await ctx.service.utils.getUrl(data.key, fileType);

  ctx.body = {
    url,
  };
};
