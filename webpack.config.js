const path = require("path");
const { EvalSourceMapDevToolPlugin } = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ESLintPlugin = require("eslint-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-v5-plugin");
const smp = new SpeedMeasurePlugin();

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";
  const config = {
    entry: "./src/index.tsx",
    devtool: isProduction ? false : "eval-source-map",
    output: {
      path: path.resolve(__dirname, "dist"),
      filename: "[name].[contenthash].js",
      chunkFilename: "[name].[contenthash].chunk.js",
      clean: true,
    },
    mode: argv.mode,
    resolve: {
      extensions: [".tsx", ".ts", ".js", ".jsx"],
      alias: {
        "@components": path.resolve(__dirname, "src/components"),
        "@assets": path.resolve(__dirname, "src/assets"),
        "@layouts": path.resolve(__dirname, "src/layouts"),
        "@pages": path.resolve(__dirname, "src/pages"),
        "@stores": path.resolve(__dirname, "src/store"),
        "@hooks": path.resolve(__dirname, "src/hooks"),
      }
    },
    devServer: {
      historyApiFallback: true, // SPA support
    },
    module: {
      rules: [
        {
          test: /\.(j|t)sx?$/,
          loader: "esbuild-loader",
          exclude: /node_modules/,
          options: {
            target: "esnext",
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader"],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg)$/,
          type: "asset/resource",
          generator: {
            filename: "assets/images/[path][name]-[hash][ext]",
          },
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf|eot)$/i,
          type: "asset/resource",
          generator: {
            filename: "assets/fonts/[path][name]-[hash][ext]",
          },
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/index.html",
        favicon: "./src/favicon.ico",
        minify: isProduction,
        inject: true,
        scriptLoading: "blocking",
        templateParameters: {
          isDevelopment: !isProduction,
        },
      }),
      new ESLintPlugin({
        extensions: ["js", "jsx", "ts", "tsx"],
        fix: true,
        emitWarning: false,
        emitError: true,
        configType: "flat",
      }),
      new MiniCssExtractPlugin({
        filename: "[name].[contenthash].css",
        chunkFilename: "[name].[contenthash].chunk.css",
      }),
      ...(isProduction
        ? []
        : [
            new EvalSourceMapDevToolPlugin({
              exclude: [/vendors\.[^.]+\.js$/],
            }),
          ]),
    ],
    optimization: {
      splitChunks: {
        chunks: "all",
        maxSize: 1000000,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name: "vendors",
            chunks: "all",
          },
          default: {
            minChunks: 2,
            reuseExistingChunk: true,
            name(module) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `npm.${packageName.replace("@", "")}`;
            },
          },
        },
      },
    },
    performance: {
      hints: "warning",
      maxEntrypointSize: Infinity,
      maxAssetSize: Infinity,
    },
    cache: {
      type: "filesystem",
      buildDependencies: {
        config: [__filename],
      },
    },
  };

  return isProduction ? config : smp.wrap(config, ["MiniCSSExtractPlugin"]);
};