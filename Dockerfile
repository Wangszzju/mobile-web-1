## 公网地址
FROM registry.cn-hangzhou.aliyuncs.com/cl_node/cl_node:6-alpine
## 内网地址
# FROM registry-internal.cn-hangzhou.aliyuncs.com/cl_node/cl_node:6-alpine
MAINTAINER ykan <nameyukan@gmail.com>

## 环境变量
ENV NODE_ENV online
ENV WEB_ROOT /root/home/app
ENV PORT 6020

## 数据卷
VOLUME $WEB_ROOT/_logs

## 初始化环境
RUN mkdir -p $WEB_ROOT
WORKDIR $WEB_ROOT
COPY . .

## 安装node模块
RUN npm install --production

CMD [ "node", "server.js" ]
EXPOSE $PORT
