const path = require("path");
module.exports = {
  webpack: {
    configure: (webpackConfig, { env, paths }) => {
      webpackConfig.entry = {
        main: "./src/index.tsx",
        customPagination: "./src/Components/CustomPagination/index.tsx",
      };
      webpackConfig.output = { filename: "js/[name].js" };
      paths.appBuild = webpackConfig.output.path = path.resolve("dist");
      return webpackConfig;
    },
  },
};
