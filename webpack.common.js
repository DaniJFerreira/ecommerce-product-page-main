
module.exports = {
    entry: {
      main:"./src/app.js",
    },

    module: {
        rules: [
          {
            test: /\.html$/,
            use: [
              "html-loader"
            ],
          },
          // // {
          // //   test: /\.(png|jpg|gif|svg)$/,
          // //   loader: 'url-loader',
          // //   type: "asset/resource",
          // //   generator: {
          // //     filename: "assets/[name].[ext]",
          // //   },
          // // },
          
          // {
          //   test: /\.(svg|png|jpg|gif)$/,
          //   use: {
          //     loader: "file-loader",
          //     options: {
          //       name: "[name].[hash].[ext]",
          //       outputPath: "assets"
          //     }
          //   },
          // }
          
        ],
      },
     

}


// const HtmlWebpackPlugin = require('html-webpack-plugin');

// module.exports = {
//   entry: {
//     main: "./src/app.js",
//   },
//   module: {
//     rules: [
//       {
//         test: /\.html$/,
//         use: [
//           "html-loader"
//         ],
//       },
//       {
//         test: /\.(png|jpg|gif|svg)$/,
//         type: "asset/resource", // Using asset modules instead of file-loader
//         generator: {
//           filename: "assets/images/[name].[hash][ext]", // Assets organized in images folder
//         },
//       },
//     ],
//   },
//   plugins: [new HtmlWebpackPlugin({
//     template: "./src/template.html"
//   })],
// };
