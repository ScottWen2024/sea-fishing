module.exports = {
  env: { es2021: true, node: true, jest: true, browser: true },
  parserOptions: { ecmaVersion: "latest" },
  extends: ["eslint:recommended"],
  rules: {
    "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "no-undef": "error",
    "no-empty": "warn",
    "no-var": "error",
    "prefer-const": "warn",
    "no-console": "off",
    "no-debugger": "warn",
    "eqeqeq": ["warn", "always"],
    "curly": ["warn", "multi-line"],
  },
};
