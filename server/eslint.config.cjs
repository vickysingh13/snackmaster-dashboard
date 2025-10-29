module.exports = [
  { ignores: ["node_modules/**"] },
  {
    files: ["**/*.js"],
    languageOptions: { ecmaVersion: 2021, sourceType: "module" },
    env: { node: true, es2021: true, jest: true },
    extends: "eslint:recommended",
    rules: {
      "no-console": "off"
    }
  }
];