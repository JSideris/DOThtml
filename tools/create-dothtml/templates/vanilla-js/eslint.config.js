import js from "@eslint/js";

export default [
  js.configs.recommended,
  {
    rules: {
      "newline-per-chained-call": "off",
    },
  }
];
