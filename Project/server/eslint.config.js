import { defineConfig } from "eslint/config";
import js from "@eslint/js";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";

export default defineConfig([
  {
    files: ["**/*.js"],
    plugins: {
      prettier: prettierPlugin,
    },
    extends: [
      js.configs.recommended,
      prettierConfig, // disables conflicting ESLint rules
    ],
    rules: {
      "no-unused-vars": "warn",
      "no-undef": "warn",
      "prettier/prettier": "error", // enables Prettier inside ESLint
    },
  },
]);
