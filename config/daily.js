'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  // 换了个端口叫
  port: 6024,
  assets: {
    pageAssets: `//${staticConfig.assets.cdnHost}/a/daily/angel.back/${staticConfig.version}/`
  },
  hflServer: {
    key: '483OedYnY945yTfdUd5Rxruf',
    secret: '1rogPFfwMpa3U5cgrjsns99wy2QSx909',
    version: '20161012',
    path: 'http://112.124.8.214:8082'
  },
  mongoUrl: 'mongodb://192.168.0.100/clweb-dev'
});

module.exports = Immutable.fromJS(config);
