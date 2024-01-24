const path = require("path");
const common = require("./webpack.common.js")
const { merge } = require("webpack-merge");
var HtmlWebpackPlugin = require("html-webpack-plugin");


module.exports = merge(common,{
    mode: "development",
    output: {
        filename:"[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/template.html"
      })
    ],
    module:{
        rules: [
          {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
              ],
          },
        ]  
      },
});

// const path = require("path");
// const common = require("./webpack.common.js");
// const { merge } = require("webpack-merge");

// module.exports = merge(common, {
//   mode: "development",
//   output: {
//     filename: "[name].bundle.js",
//     path: path.resolve(__dirname, "dist"),
//   },
//   devtool: 'inline-source-map', // Added source map for better debugging
//   devServer: {
//     contentBase: './dist', // Config for Webpack Dev Server
//   },
//   module: {
//     rules: [
//       {
//         test: /\.scss$/,
//         use: [
//           "style-loader",
//           "css-loader",
//           "sass-loader"
//         ],
//       },
//     ]
//   },
// });
// const path = require("path");
// const common = require("./webpack.common.js");
// const { merge } = require("webpack-merge");

// module.exports = merge(common, {
//   mode: "development",
//   output: {
//     filename: "[name].bundle.js",
//     path: path.resolve(__dirname, "dist"),
//   },
//   devtool: 'inline-source-map', // Retaining source map for better debugging
//   devServer: {
//     static: {
//       directory: path.join(__dirname, 'dist'), // Updated from 'contentBase' to 'static.directory'
//     },
//     open: true, // Automatically opens the browser
//     hot: true, // Enables Hot Module Replacement without page refresh
//     compress: true, // Enables gzip compression
//     port: 3000, // Specify the port number that you want the server to run on
//   },
//   module: {
//     rules: [
//       {
//         test: /\.scss$/,
//         use: [
//           "style-loader",
//           "css-loader",
//           "sass-loader"
//         ],
//       },
//     ]
//   },
// });
