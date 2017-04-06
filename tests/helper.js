'use strict';
const path = require('path');
const should = require('should');
require('should-sinon');
const rootPath = path.normalize(__dirname + '/..');
const co = require('co');
const koa = require('koa');
const testConfig = require(`${rootPath}/config/test`);
const sinon = require('sinon');
const testLogger = {
  info: sinon.spy(),
  debug: console.log,
  fatal: sinon.spy(),
  error: sinon.spy(),
  warn: sinon.spy()
};

// console.log('>>>>>test helper init');

function buildConfig(config) {
  config.depMiddlewares = config.depMiddlewares || [];
  let l = config.logger || testLogger;
  let c = config.config || testConfig;
  let deps = [l, c];
  config.deps = config.deps || deps;
  config.ctx  = config.ctx || {};
  let dir = config.dir = config.dir || 'interfaces';
  config.defaultFile = dir === 'interfaces' ? 'index': 'node.main';
  config.before = config.before || function*(next){
    yield next;
  };
  config.after = config.after || function*(next){
    if(dir === 'interfaces') {
      this.body = this.body || '{ "status": 200, "data":"hello, world"}';
    } else {
      this.body = this.body || 'hello, world';
    }
    yield next;
  };
  config.middlewares = config.middlewares || [];
  return config;
}

//## 模拟中间件
// * middlewareName: 中间件名
// * deps: 依赖数组
// * depMiddlewares: 依赖的中间件数组
// * ctx: 附加的ctx
// * before: 在中间件之前添加一个中间件，测试使用
// * after: 在中间件之后添加一个中间件，测试使用
// * config: 自定义配置，默认为testConfig
// * logger: 自定义日志，默认为testLogger
// * routerType: 自定义routerType类型
// Return app:koa
function mockMiddleware(config) {
  let {
    name,
    depMiddlewares,
    deps,
    before,
    after,
    ctx,
    routerType
  } = buildConfig(config);
  return co(function*(){
    depMiddlewares.push(name);
    let middlewares = [];
    for (let i = 0, l = depMiddlewares.length; i < l ; i++) {
      let mName = depMiddlewares[i];
      let mFunc = require(`${rootPath}/middlewares/${mName}/`);
      let m = yield mFunc.apply(this, deps);
      middlewares = middlewares.concat(m.middlewares);
    }
    let app = koa();
    app.keys = ['test.helper'];
    let keys = Object.keys(ctx);

    middlewares.unshift(before);
    middlewares.push(after);
    app.use(function*(next){
      let tCtx = this;
      keys.forEach(key => {
        tCtx[key] = ctx[key];
      });
      if(routerType) {
        tCtx.gRouter = tCtx.gRouter || {};
        tCtx.gRouter.type = routerType;
      }
      for (let i = middlewares.length - 1; i >= 0; i--) {
        next = middlewares[i].call(this, next);
      }
      // listenForQuitCache(this);
      yield *next;
    });
    return app;
  });
}


//## 模拟路由
// * middlewares: 中间件数组，比如['i-helper', 'cache']
// * routerName: 路由名
// * deps: 工厂传递的参数数组
// * before: 在中间件之前添加一个中间件，测试使用
// * after: 在中间件之后添加一个中间件，测试使用
// * config: 自定义配置，默认为testConfig
// * logger: 自定义日志，默认为testLogger
// * attach: 附加
// * dir: 路由所在的目录
// Return app:koa
function mockRouter(config) {
  let {
    name,
    depMiddlewares,
    deps,
    before,
    after,
    ctx,
    dir,
    defaultFile,
    middlewares,
  } = buildConfig(config);
  let routerName = name;

  return co(function*(){
    let rFunc = require(`${rootPath}/${dir}/${routerName}/${defaultFile}`);
    let router = yield rFunc.apply(this, deps);
    router.name = routerName;
    router.path = `${rootPath}/${dir}/${routerName}`;
    router.type = dir === 'interfaces' ? 'interface': 'page';
    middlewares = middlewares.concat(router.middlewares);
    let ms = [];
    for (let i = 0, l = middlewares.length; i < l ; i++) {
      let m = middlewares[i];
      if(typeof m === 'string') {
        let mFunc = require(`${rootPath}/middlewares/${m}/`);
        let mItem = yield mFunc.apply(this, deps);
        ms = ms.concat(mItem.middlewares);
      } else if(m.constructor.name === 'GeneratorFunction') {
        ms.push(m);
      }
    }
    let app = koa();
    app.keys = ['test.helper'];
    let keys = Object.keys(ctx);
    ms.unshift(before);
    ms.push(after);
    app.use(function*(next){
      let tCtx = this;
      keys.forEach(key => {
        tCtx[key] = ctx[key];
      });
      for (let i = ms.length - 1; i >= 0; i--) {
        next = ms[i].call(this, next);
      }
      this.gRouter = router;
      let type = dir === 'interfaces' ? 'i': 'p';
      this.gRouterKeys = [type, routerName];
      if(next.next) {
        yield *next;
      } else {
        yield next;
      }
    });
    return app;
  });
}

//## 等待
function wait(time) {
  return new Promise(resolve => {
    setTimeout(resolve, time);
  });
}

global._testHelper = {
  rootPath,
  testConfig,
  testLogger,
  wait,
  mockRouter,
  mockMiddleware
};
