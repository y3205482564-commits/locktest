import antfu from "@antfu/eslint-config";
import unocss from "@unocss/eslint-plugin";

export default antfu(
  {
    rules: {
      "no-console": "off",
      "node/prefer-global/process": "off",
      "vue/custom-event-name-casing": "off",
      "vue/component-name-in-template-casing": "off",
      "vue/require-toggle-inside-transition": "off",
      "style/semi": ["error", "always"],
      semi: ["error", "always"],
      "style/quotes": "off",
      // quotes: ['error', 'single'],
      quotes: "off",
      eqeqeq: "off",
      "antfu/top-level-function": "off",
      curly: ["error", "all"],
      "style/brace-style": ["error", "1tbs"],
      "style/arrow-parens": ["error", "always"],
      "ts/no-duplicate-enum-values": "off",
    },
  },
  unocss.configs.flat
);
