const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  context: __dirname + '/public',
  entry: './app/app.js',
  output: {
    filename: './public/dist/bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: 'style-loader!css-loader!stylus-loader'
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        loader: 'babel-loader'
      },
      {
        test: /.vue?$/,
        loader: 'vue-loader',
        exclude: '/node_modules/',
        query: {
          presets: ['es2017', 'vue', 'stage-0']
        }
      }
    ]
  },
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost',
      port: 3005,
      proxy: 'http://localhost:3004'
    })
  ],
}
