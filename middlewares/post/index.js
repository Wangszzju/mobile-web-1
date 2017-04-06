'use strict';
const koaBody = require('koa-body');
module.exports = function(logger, config) {
  return Promise.resolve({
    middlewares: [koaBody()]
  });
};
