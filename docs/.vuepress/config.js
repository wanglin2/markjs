var path = require('path');
var OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

var webpackConfig = {
  module: {
    rules: [{
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.resolve(__dirname, '../../markjs')]
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader',
        options: {
          implementation: require('sass')
        }
      }
    ]
  },
  plugins: [
    new OptimizeCSSPlugin({
      cssProcessorOptions: {
        safe: true
      }
    })
  ]
};

module.exports = {
  base: '/',
  dest: 'public',
  title: 'Markjs_一个简单的标注库',
  description: '如题。',
  themeConfig: {
    sidebar: [
      ['/zh/markjs/', '文档']
    ]
  },

  configureWebpack: webpackConfig,
  
  chainWebpack: (webpackConfig) => {
    webpackConfig.module
      .rule('js')
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: 2
            }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      });

    webpackConfig.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap(options => {
        options.compilerOptions.preserveWhitespace = false; // 模版中 HTML 标签之间的空格将会被忽略
        return options;
      });

    webpackConfig.module
      .rule('compile')
      .test(/\.js$/)
      .include.add(/@vuepress/)
      .add(/gitlabment/)
      .end()
      .use('babel-loader')
      .loader('babel-loader')
      .options({
        presets: [
          [
            '@babel/preset-env',
            {
              useBuiltIns: 'usage',
              corejs: 2
            }
          ]
        ],
        plugins: ['@babel/plugin-syntax-dynamic-import']
      });
  },

  plugins: ['@vuepress/back-to-top']
};