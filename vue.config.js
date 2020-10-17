const TIMESTAMP = new Date().getTime();

module.exports = {
  publicPath: './', // 上线后需要注释该行
  configureWebpack: {
    output: { // 输出重构  打包编译后的 文件名称  【模块名称.时间戳.js】
      filename: `js/[name]_${TIMESTAMP}.js`,
      // 修改chunk-vendors输出名称
      chunkFilename: `js/[name]_${new Date().getTime()}.js`
    }
  },
  css: {
    extract: { // 输出重构  打包编译后的 文件名称  【模块名称.时间戳.css】
      filename: `css/[name]_${TIMESTAMP}.css`,
      // 修改chunk-vendors输出名称
      chunkFilename: `css/[name]_${new Date().getTime()}.css`
    },
  },
  chainWebpack: config => { // 压缩图片
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => Object.assign(options, { limit: 10240 }))
  },
  productionSourceMap: false,
    // devServer: {
    //     proxy: {
    //         '/api': {
    //             target: 'http://192.168.0.100',
    //             changeOrigin: true,
    //             ws: true,
    //             pathRewrite: {
    //                 '^/api': ''
    //             }
    //         },
    //     }
    // },
}