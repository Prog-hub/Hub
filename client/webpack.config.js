const path = require('path');
var FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');

console.log("OUTPUT FOLDER IS IN ", __dirname);
module.exports = {
  devServer: {
    contentBase: path.join(__dirname, 'dist'),
    compress: true,
    port: 9001,
    host: process.env.HOST_IP,//'10.242.34.255',
    historyApiFallback: true,
  },
  
  resolve: {
    alias: {
      Network:    path.resolve(__dirname, 'src/network/'),
      Components: path.resolve(__dirname, 'src/components/'),
      Routes:     path.resolve(__dirname, 'src/routes/'),
      Styles:     path.resolve(__dirname, 'src/css/'),
      Utility:    path.resolve(__dirname, 'src/utility'),
      Context:    path.resolve(__dirname, 'src/context'),
      App:        path.resolve(__dirname, 'src/app'),
    }
  },

  entry: './src/main.js',
  output: {
    //path: "/dist",
    path: path.join(__dirname,'dist'),
    //publicPath: '/dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      { test: /\.js$/, exclude: /node_modules/, use: ["babel-loader", "eslint-loader"] },
      {
        test: /\.css$/,
        use: [
          // style-loader
          { loader: 'style-loader' },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass-loader
          { loader: 'sass-loader' }
        ]
      },
            {
        test: /\.scss$/,
        use: [
          // style-loader
          { loader: 'style-loader' },
          // css-loader
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          },
          // sass-loader
          { loader: 'sass-loader' }
        ]
      }
    ]
  },
  plugins: [
    new FlowBabelWebpackPlugin(),
  ]
};