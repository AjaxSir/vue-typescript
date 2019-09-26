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
    }
  },
  // 生产环境 sourceMap
  productionSourceMap: false
};
