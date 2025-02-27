module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    browser: true,
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  plugins: ["spellcheck", "@typescript-eslint"],
  parser: "@typescript-eslint/parser",
  root: true,
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  ignorePatterns: ["node_modules/**/*"],
  rules: {
    "spellcheck/spell-checker": [
      "warn",
      {
        comments: true,
        skipWords: [
          "ondemand",
          "webhook",
          "webhooks",
          "nes",
          "wb",
          "axios",
          "paircode",
          "ecma",
          "mb",
          "num",
          "bg",
          "Fxns",
          "usehooks",
        ],
      },
    ],
    "react/no-unescaped-entities": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-extra-semi": "warn",
  },
};
