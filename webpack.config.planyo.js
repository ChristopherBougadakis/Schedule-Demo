/* eslint-disable import/no-extraneous-dependencies */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

// Check if running Planyo mode via environment variable
const isPlanyoMode = process.env.PLANYO_MODE === 'true';

module.exports = {
  entry: isPlanyoMode ? './src/planyo-index.jsx' : './src/examples/index.jsx',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(svg|png|jpe?g|gif|woff|woff2|eot|ttf|otf|pdf)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
        generator: {
          filename: 'assets/[name][ext][query]',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/examples/index.html',
      favicon: './src/examples/assets/banner.png',
      title: isPlanyoMode ? 'Planyo Booking Scheduler' : 'React Big Schedule',
    }),
    new ESLintPlugin({
      emitError: false,
      emitWarning: true,
      failOnError: false,
      extensions: ['js', 'jsx'],
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 8080,
    historyApiFallback: true,
  },
  mode: 'development',
  devtool: 'source-map',
};
