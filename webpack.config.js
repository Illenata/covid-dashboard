const path = require('path');
const HTMLWebpackPlagin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all',
    },
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetsPlugin(),
      new TerserWebpackPlugin(),
    ];
  }

  return config;
};

const cssLoaders = (extra) => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: '',
      },
    },
    'css-loader',
  ];

  if (extra) {
    loaders.push(extra);
  }

  return loaders;
};

const sourceMap = () => {
  if (isDev) {
    return 'source-map';
  }
  return undefined;
};

module.exports = {
  context: path.resolve(__dirname, 'src'),
  mode: 'development',
  entry: {
    main: ['@babel/polyfill', './index.js'],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      "./images/layers.png$": path.resolve(
        __dirname,
        "./node_modules/leaflet/dist/images/layers.png"
      ),
      "./images/layers-2x.png$": path.resolve(
          __dirname,
          "./node_modules/leaflet/dist/images/layers-2x.png"
      ),
      "./images/marker-icon.png$": path.resolve(
          __dirname,
          "./node_modules/leaflet/dist/images/marker-icon.png"
      ),
      "./images/marker-icon-2x.png$": path.resolve(
          __dirname,
          "./node_modules/leaflet/dist/images/marker-icon-2x.png"
      ),
      "./images/marker-shadow.png$": path.resolve(
          __dirname,
          "./node_modules/leaflet/dist/images/marker-shadow.png"
      ),
      "./leaflet.toolbar.js": path.resolve(
          __dirname,
          "node_modules/leaflet-toolbar/dist/leaflet.toolbar.js"
      )
    },
  },
  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
    hot: isDev,
    injectHot: (compilerConfig) => compilerConfig.name === 'only-include',
  },
  devtool: sourceMap(),
  plugins: [
    new HTMLWebpackPlagin({
      template: './index.html',
      minify: {
        collapseWhitespace: isProd,
      },
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'src/assets/static/favicon.ico'),
          to: path.resolve(__dirname, 'dist'),
        },
        {
          from: path.resolve(__dirname, 'src/assets/img'),
          to: path.resolve(__dirname, 'dist/img'),
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new ESLintPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: cssLoaders(),
      },
      {
        test: /\.s[ac]ss$/,
        use: cssLoaders('sass-loader'),
      },
      {
        test: /\.(png|jpg|svg|gif)$/,
        use: ['file-loader'],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        use: ['file-loader'],
      },
      {
        test: /\.m?js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
            ],
            plugins: [
              '@babel/plugin-proposal-class-properties',
            ],
          },
        },
      },
    ],
  },
};
