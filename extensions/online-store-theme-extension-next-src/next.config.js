/** @type {import('next').NextConfig} */
const path = require("path");

module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = { main: "./src/index.tsx" };
      webpackConfig.output = { filename: "js/[name].js" };
      paths.appBuild = webpackConfig.output.path = path.resolve("dist");
      return webpackConfig;
    },
  },
};
