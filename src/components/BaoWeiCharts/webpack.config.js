// eslint-disable-next-line no-undef
var path = require('path')
// eslint-disable-next-line no-undef
var webpack = require('webpack')

// 执行环境
// const NODE_ENV = 'production';
function resolve (dir) {
  // eslint-disable-next-line no-undef
  return path.join(__dirname, '..', dir)
}
// eslint-disable-next-line no-undef
module.exports = {
  // 根据不同的执行环境配置不同的入口
  entry: {
    entry: './src/components/BaoWeiCharts/pack.js'
  },
  output: {
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, '../dist'),
    publicPath: '/dist/',
    filename: 'baoweiCharts.js',
    library: 'baoweiCharts', // 指定的就是你使用require时的模块名
    libraryTarget: 'umd', // 指定输出格式
    umdNamedDefine: true // 会对 UMD 的构建过程中的 AMD 模块进行命名。否则就使用匿名的 define
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
        // options: {
        //   loaders: {
        //     css: ['vue-style-loader', 'css-loader']
        //   }
        // }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader'
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    overlay: true
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map'
}

// eslint-disable-next-line no-undef
module.exports.devtool = '#source-map'
// eslint-disable-next-line no-undef
module.exports.plugins = (module.exports.plugins || []).concat([
  new webpack.DefinePlugin({
    'process.env.NODE_ENV': JSON.stringify('production')
  }),
  new webpack.optimize.UglifyJsPlugin({
    sourceMap: true,
    compress: {
      warnings: false
    }
  }),

  new webpack.LoaderOptionsPlugin({
    minimize: true
  })
])
