var webpack = require('webpack');
var path = require('path');

// var BUILD_DIR = path.resolve(__dirname, './compiled');
// var APP_DIR = path.resolve(__dirname, './');

var config = {
  devtool: 'inline-source-map',
  context: path.join(__dirname),
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'react-web-terminal.js',
    libraryTarget: 'umd',
    library: 'WebTerminal'
  },
  externals: {
   'react': 'var React',
   'react/addons': 'var React'
  },
  resolve: {
    modulesDirectories: ['node_modules', 'src'],
    extentions: ['','.js','.jsx','.css','.scss']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        loaders: ['babel?presets[]=react,presets[]=es2015']
      },
      {
        test: /\.scss$/,
        // Query parameters are passed to node-sass
        loader: 'style!css!sass?outputStyle=expanded&' +
          'includePaths[]=' + (path.resolve(__dirname, './bower_components')) + '&' +
          'includePaths[]=' + (path.resolve(__dirname, './node_modules'))
      }
    ]
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ]
};

module.exports = config;
