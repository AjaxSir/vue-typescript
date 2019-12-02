"use strict";
const path = require("path");
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  outputDir: "dist",
  devServer: {
    proxy: {
      "/v1": {
        target: "http://192.168.3.19:8094", // 测试服务器 http://192.168.3.122:8080 开波 http://192.168.3.19:8094 测试
        changeOrigin: true,
        pathRewrite: {
          "^/v1": "/"
        }
      },
      '/v2': {
        target: 'http://api.map.baidu.com/geocoder/', // http://192.168.3.19:8000/ 192.168.2.175:9000
        changeOrigin: true,
        pathRewrite: {
          '^/v2': '/v2' // 需要rewrite的,
        }
      }
    },
    host: '192.168.3.172'
  },
  // 生产环境 sourceMap
  productionSourceMap: false,
  publicPath: process.env.NODE_ENV === "production" ? "./" : "/",
  assetsDir: 'static',
  chainWebpack(config) {
    // set svg-sprite-loader
    config.module
      .rule("svg")
      .exclude.add(resolve("src/icons"))
      .end();
    config.module
      .rule("icons")
      .test(/\.svg$/)
      .include.add(resolve("src/icons"))
      .end()
      .use("svg-sprite-loader")
      .loader("svg-sprite-loader")
      .options({
        symbolId: "icon-[name]"
      })
      .end();

    // set preserveWhitespace
    config.module
      .rule("vue")
      .use("vue-loader")
      .loader("vue-loader")
      .tap(options => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  }
};
