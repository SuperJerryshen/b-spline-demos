const { fixBabelImports } = require("customize-cra");

module.exports = {
  webpack: config => {
    return fixBabelImports("import", {
      libraryName: "antd",
      libraryDirectory: "es",
      style: "css",
    })(config);
  },
};
