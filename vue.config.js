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
        target: "https://192.168.2.175:9000", // https://douban.uieee.com http://192.168.3.19:8000/
        changeOrigin: true,
        pathRewrite: {
          "^/v1": "/v1"
        }
      }
    },
    host: '192.168.3.108'
  },
  // 生产环境 sourceMap
  productionSourceMap: false,
  baseUrl: './',
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
