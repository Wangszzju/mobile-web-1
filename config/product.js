'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  port:6023,
  assets: {
    pageAssets: `//${staticConfig.assets.cdnHost}/a/online/angel.back/${staticConfig.version}/`
  },
  hflServer: {
    key: '483OedYnY945yTfdUd5Rxruf',
    secret: '1rogPFfwMpa3U5cgrjsns99wy2QSx909',
    version: '20161012',
    path: 'http://api.heifengli.withme.cn'
  },
  mongoUrl: 'mongodb://online:withme_321@121.40.136.76/clweb'
});

module.exports = Immutable.fromJS(config);
