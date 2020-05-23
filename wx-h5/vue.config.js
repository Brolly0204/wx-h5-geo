module.exports = {
  devServer: {
    host: 'm.brolly.com',
    port: 80,
    proxy: {
      '/api': {
         target: 'http://localhost:5000',
         ws: false,
         changeOrigin: true
      }
    },
    disableHostCheck: true
  }
}
