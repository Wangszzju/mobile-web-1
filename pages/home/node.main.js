'use strict';

module.exports = function(logger, config) {
  return Promise.resolve({
    middlewares: [function*(next){

      this.mRender({
      });
      yield next;
    }]
  });
};
