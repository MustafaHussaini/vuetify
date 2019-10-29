require('dotenv').config()

const path = require('path')
const webpack = require('webpack')
const vueConfig = require('./vue-loader.config')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const isProd = process.env.NODE_ENV === 'production'
const resolve = file => path.resolve(__dirname, file)

const plugins = [
  new webpack.DefinePlugin({
    'process.env': JSON.stringify(process.env),
  }),
  new VueLoaderPlugin(),
]

const devtool = isProd ? 'none' : 'source-map'

module.exports = {
  mode: isProd ? 'production' : 'development',
  devtool,
  output: {
    path: resolve('../dist'),
    pathinfo: isProd,
    publicPath: '/dist/',
    filename: isProd ? '[name].[chunkhash].js' : '[name].js',
    chunkFilename: isProd ? '[name].[chunkhash].js' : '[name].js',
  },
  resolve: {
    extensions: ['*', '.js', '.json', '.vue'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
      vue$: 'vue/dist/vue.runtime.esm.js',
    },
    symlinks: false,
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      {
        // Load sourcemaps from vuetify, both css + js
        test: /\.(js|css)$/,
        loader: 'source-map-loader',
        include: /vuetify[\\/](dist|es5|lib|src)/,
        enforce: 'pre',
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        include: [
          resolve('../src/components'),
          resolve('../src/examples'),
          resolve('../src/layouts'),
          resolve('../src/pages'),
          resolve('../src/views'),
          resolve('../src/usages'),
          resolve('../src/App.vue'),
        ],
        options: vueConfig,
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)(\?.*)?$/,
        loader: 'url-loader',
        include: [
          resolve('../src/public'),
          resolve('../src/themes'),
        ],
        query: {
          limit: 10000,
          name: 'img/[name].[hash:7].[ext]',
        },
      },
      {
        test: /\.txt$/,
        use: [
          'thread-loader',
          'raw-loader',
        ],
        include: resolve('../src/snippets'),
      },
    ],
  },
  performance: {
    hints: false,
  },
  stats: {
    children: false,
    assets: !isProd,
  },
  plugins,
}

plugins.push(
  new FriendlyErrorsPlugin()
)
