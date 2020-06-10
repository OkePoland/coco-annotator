module.exports = {
  devServer: {
    disableHostCheck: true,
    proxy: {
      "/api/*": {
        target: "http://webserver:5000/api/",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/api": ""
        }
      },
      "/socket.io*": {
        target: "http://webserver:5000/socket.io",
        secure: false,
        changeOrigin: true,
        pathRewrite: {
          "^/socket.io": ""
        }
      }
    }
  },
  lintOnSave: undefined,
  runtimeCompiler: true
};
