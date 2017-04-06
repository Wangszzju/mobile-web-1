'use strict';
const staticConfig = require('./static');
const Immutable = require('immutable');

let config = Object.assign(staticConfig, {
  port:6029,
  pug: {
    basedir: `${staticConfig.rootPath}/assets`,
    // debug: true,
    compileDebug: true
  },
  assets: {
    pageAssets: '//localhost:12126/'
  },
  hflServer: {
    key: '483OedYnY945yTfdUd5Rxruf',
    secret: '1rogPFfwMpa3U5cgrjsns99wy2QSx909',
    version: '20161012',
    path: 'http://112.124.8.214:8082'
  },
  mongoUrl: 'mongodb://192.168.0.100/angel-back-test'
});

module.exports = Immutable.fromJS(config);
