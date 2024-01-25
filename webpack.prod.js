const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCssAssetsPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
var HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  output: {
    filename: "[name].[contenthash].bundle.js",
    path: path.resolve(__dirname, "dist")
  },
  optimization: {
    minimizer: [
      new OptimizeCssAssetsPlugin(),
      new TerserPlugin(),
      
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
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
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader, //3. Extract css into files
          "css-loader", //2. Turns css into commonjs
          "sass-loader" //1. Turns sass into css
        ]
      }
    ]
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true,
    hot: true
  },
});


// const path = require("path");
// const common = require("./webpack.common");
// const { merge } = require("webpack-merge");
// const { CleanWebpackPlugin } = require("clean-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
// // const CssMinimizerPlugin = require();
// const HtmlWebpackPlugin = require('html-webpack-plugin');
// const TerserPlugin = require("terser-webpack-plugin");

// module.exports = merge(common, {
//   mode: "production",
//   output: {
//     filename: "[name].[contenthash].bundle.js",
//     path: path.resolve(__dirname, "dist"),
//     publicPath: "/", // Ensuring the correct base path for assets
//   },
//   optimization: {
//     minimizer: [
//       new OptimizeCssAssetsPlugin (),
//       // new CssMinimizerPlugin(), // Updated from OptimizeCssAssetsPlugin
//       new TerserPlugin(),
//       // new HtmlWebpackPlugin({
//       //   template: "./src/template.html",
//       //   minify: {
//       //     removeAttributeQuotes: true,
//       //     collapseWhitespace: true,
//       //     removeComments: true
//       //   }
//       // })
//     ],
//     splitChunks: {
//       chunks: 'all', // Split vendor code for caching benefits
//     },
//   },
//   plugins: [
//     new MiniCssExtractPlugin({ filename: "[name].[contenthash].css" }),
//     new CleanWebpackPlugin(),
//   ],
//   module: {
//     rules: [
//       {
//         test: /\.scss$/,
//         use: [
//           MiniCssExtractPlugin.loader,
//           "css-loader",
//           "sass-loader"
//         ]
//       }
//     ]
//   }
// });
