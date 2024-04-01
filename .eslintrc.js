module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended', // Enables ESLint plugin for Prettier
  ],
  ignorePatterns: ['*.test.js'],
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    // Additional ESLint rules can go here if needed
  },
};
