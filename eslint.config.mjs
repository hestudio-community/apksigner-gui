import js from "@eslint/js";
import globals from "globals";
import pluginVue from "eslint-plugin-vue";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier/flat";

export default defineConfig([
  {
    basePath: "src",
    files: ["**/*.{js,mjs,cjs,vue}"],
    plugins: { js, pluginVue },
    extends: ["js/recommended", "pluginVue/flat/essential"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    rules: {
      "no-unused-vars": "off",
      "no-dupe-keys": "off",
      "vue/require-v-for-key": "off",
      "vue/multi-word-component-names": "off",
    },
  },
  eslintConfigPrettier,
]);
