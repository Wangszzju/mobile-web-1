'use strict';
const path = require('path');
const rootPath = path.normalize(__dirname + '/..');
module.exports = {
  version: '0.15.0',
  port: 6020,
  rootPath: rootPath,
  assets: {
    cdnHost: 'cdn.withme.cn',
  },
  pug: {
    basedir: `${rootPath}/assets`
  },
  qiniuKey: 'tBp6z8XoFNZV45YJ2NRdEsc-jKxCScWbg83GCNGl',
  qiniuSecret: 'phWig8TOv9N5F0gT1eiWVYv8kc4jYUUtfPxfdCsI',
  env: process.env.NODE_ENV || 'dev'
};
