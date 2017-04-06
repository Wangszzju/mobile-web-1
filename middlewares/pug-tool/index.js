'use strict';
const pug = require('pug');
const fs = require('fs');


//# pug渲染中间件
module.exports = function(logger, config) {
  const pugOptions = config.get('pug');
  const rootPath = config.get('rootPath');
  const pageAssets = config.getIn(['assets', 'pageAssets']);
  const nodeEnv = config.get('env');

  let getDefaultData;
  let timestamp = '';
  if(nodeEnv === 'daily') {
    timestamp = '?t=' + Date.now();
  }
  function getPageData(pageName, defaultData){
    let pageInfo = JSON.parse(defaultData);
    let pageCSS,pageJS;
    if(nodeEnv ==='daily'){
      pageCSS = `${pageAssets}${pageName}.${pageInfo.cssHash}.css${timestamp}`;
      pageJS =  `${pageAssets}${pageName}.${pageInfo.jsHash}.js${timestamp}`;
    }
    else{
      pageCSS =`${pageAssets}${pageName}.css${timestamp}`;
      pageJS =  `${pageAssets}${pageName}.js${timestamp}`;
    };
    return {
      pageCSS: pageCSS,
      pageJS: pageJS,
      pageName: pageName,
      libJS: '//cdn.withme.cn/withme.web.lib.jquery-2.2.4.min.js?t=20160805',
      jsData: '{}'
    };
  }
  if(nodeEnv === 'dev') {
    getDefaultData = path => {
      let jsonStr = fs.readFileSync(path, 'utf8');
      return JSON.parse(jsonStr);
    };
  } else {
    getDefaultData = path => {
      return require(path);
    };
  }

  function mRender(options, dir){
    dir = this.gRouter.path || dir;
    let filename = `${dir}/node.tpl.pug`;
    let defaultDataFile = `${dir}/node.data.json`;
    let defaultData = getDefaultData(defaultDataFile);
    let pageData = getPageData(this.gRouterKeys[1], defaultData);
    this.mPageData = {
      json: defaultData,
      info: pageData
    };
    options = options || {};
    options = Object.assign(pugOptions.toJS(), pageData, defaultData, options);
    options.filename = filename;
    this.body = pug.renderFile(filename, options);
  }

  return Promise.resolve({
    middlewares: [function*pugTool(next) {
      this.mRender = mRender;
      yield next;
    }]
  });
};
