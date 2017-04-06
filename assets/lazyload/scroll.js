'use strict';
module.exports = function(config){
  let {checkFunc, time, scrollNode } = config;
  scrollNode = scrollNode || window;
  time = time || 100;
  let timer;
  let lastTime = $.now();
  checkFunc();
  $(scrollNode).on('scroll', () => {
    let currentTime = $.now();
    if(timer) {
      clearTimeout(timer);
      timer = null;
    }
    if(currentTime - lastTime > time) {
      lastTime = currentTime;
      checkFunc();
    } else {
      timer = setTimeout(()=> {
        checkFunc();
      }, time);
    }
  });
};
