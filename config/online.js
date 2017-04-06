'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  assets: {
    pageAssets: `//${staticConfig.assets.cdnHost}/a/online/angel.back/${staticConfig.version}/`
  },
  hflServer: {
    key: '483OedYnY945yTfdUd5Rxruf',
    secret: '1rogPFfwMpa3U5cgrjsns99wy2QSx909',
    version: '20161012',
    path: 'http://api.yufa.mywithme.net'
  }
});

module.exports = Immutable.fromJS(config);
