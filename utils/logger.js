'use strict';
const log4js = require('log4js');
module.exports = function(config) {
  let env = config.get('env');
  let appenders = [{ type: 'console' }];
  if(env !== 'dev') {
    appenders = [{
      type: 'dateFile',
      filename: '_logs/angel.back.log',
      pattern: '-yyyy-MM-dd',
      alwaysIncludePattern: false
    }];
  }
  log4js.configure({
    appenders: appenders,
    replaceConsole: true
  });
  let logger = log4js.getLogger(`[${env}]`);
  if(env === 'dev') {
    logger.setLevel('debug');
  } else {
    logger.setLevel('info');
  }
  return logger;
};
