const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
  entry: {
      home: './src/home.jsx'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [{
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: {
            loader: 'babel-loader',
            options:{
                presets: ['@babel/preset-env','@babel/preset-react']
            }
        }
    }],
  },
  plugins: [new HtmlWebpackPlugin({
       template: './src/home.html',
       filename: 'home.html' 
    }),
    new HtmlWebpackPlugin({
      template: './src/test.html',
      filename: 'test.html' 
   }),
    new CopyPlugin({
        patterns: [
          { from: "public" },
          { from: "node_modules/bootstrap/dist/css", 
            to: "media/css/bootstrap"}
        ],
      })],
};