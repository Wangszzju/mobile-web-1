'use strict';

let log = () => {};
if(process.env.NODE_ENV !== 'production' && console) {
  log = console.log.bind(this);
}
module.exports = log;
