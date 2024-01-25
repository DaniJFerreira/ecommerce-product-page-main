const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

let mode = "development";

if (process.env.NODE_ENV === "production") {
  mode = "production";
}

module.exports = {
  entry: {
    main:"./src/app.js",
  },

  mode: mode,
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist"),
    assetModuleFilename: "assets/[hash].[ext].[query]",
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].bundle.css"}),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./src/template.html",
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true
      } 
   })
  ],
  module: {
    rules: [
      {
        test: /\.html$/,
        use: [
          "html-loader"
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: "asset",
      },
      {
        test: /\.scss$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: { publicPath: "" } 
          },
          "css-loader", //2. Turns css into commonjs
          "sass-loader" //1. Turns sass into css
        ]
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          }
        },
      },
    ],
  },
  devtool: false,
  devServer: {
    contentBase: './dist',
    hot: true,
  },
};
