import js from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "newline-per-chained-call": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  }
);
