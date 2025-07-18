// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    extends: ["expo", "plugin:@typescript-eslint/recommended"],
    plugins: ["eslint-plugin-tsdoc"],
    ignores: ["dist/*"],
    rules: {
      // Allow @env imports
      "import/no-unresolved": [
        "error",
        {
          ignore: ["@env"],
        },
      ],
      "tsdoc/syntax": "warn",
    },
  },
]);
