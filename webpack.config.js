const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
      path: __dirname + '/dist',
      filename: 'bundle.js',
      // 打包的暴露模块规则
      libraryExport: 'default',
      libraryTarget: 'umd'
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    // 下面这些不打包
    externals: {
      react: {
        root: "React",
        commonjs2: "react",
        commonjs: "react",
        amd: "react"
      },
      antd: {
        root: "Antd",
        commonjs2: "antd",
        commonjs: "antd",
        amd: "antd"
      },
      "react-dom": {
        root: "ReactDOM",
        commonjs2: "react-dom",
        commonjs: "react-dom",
        amd: "react-dom"
      }
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader'
          }
        }
      ]
    }
  }