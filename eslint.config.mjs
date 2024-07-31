// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default {
  ...eslint.configs.recommended,
  ...tseslint.configs.recommended,
  env: {
    node: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2021, // Use a specific ECMAScript version
    sourceType: "module", // Use ES modules
    project: "./tsconfig.json", // Specify the path to your tsconfig.json
  },
  rules: {
    // Add any additional rules or overrides here
  },
};
