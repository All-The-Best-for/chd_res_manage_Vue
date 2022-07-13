// 进行个性配置
module.exports = {
  lintOnSave:false,    //关闭语法检查

  //法2 可以配置多个代理服务器,且可以控制到底请求代理服务器还是通过代理服务器请求最终服务器
  devServer: {
    // host:'localhost',
    port:8081,
    proxy: {
      '^/api': {      //请求前缀，使用此前缀的请求就使用代理，可以自定义
        target: 'http://localhost:9001',
        pathRewrite:{'^/api':''},    //重写请求，代理服务器会将请求中的请求前缀剔除后再转发给服务器
        ws: true,       //用于支持websocket
        changeOrigin: true    //用于控制请求头中的host值，开启后，代理服务器会向最终请求服务器谎称请求来自与最终服务器相同的端口，通常是开启的
      }
    }
  }
}
