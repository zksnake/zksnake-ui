const { defineConfig } = require('@vue/cli-service')
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    plugins: [
      new NodePolyfillPlugin()
    ],
    resolve: { fallback: { fs: false } }
  },
  chainWebpack: config => {
    config
      .plugin('eslint')
      .tap(args => {
        args[0].fix = true
        return args
      })
  }
})
