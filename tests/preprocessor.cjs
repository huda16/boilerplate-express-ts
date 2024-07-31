// preprocessor.cjs
const tsc = require("typescript");
const tsConfig = require("../tsconfig.json");

module.exports = {
  process(src, path) {
    if (path.endsWith(".ts") || path.endsWith(".tsx") || path.endsWith(".js")) {
      const result = tsc.transpile(src, tsConfig.compilerOptions, path, []);
      return {
        code: result,
        map: "", // You can provide source maps if needed
      };
    }
    return {
      code: src,
    };
  },
};
