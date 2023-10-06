/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020, // Set to the appropriate ECMAScript version
    sourceType: 'module',
    project: ['./tsconfig.json'], // Specify your tsconfig.json path
  },
  plugins: ['react', '@typescript-eslint', 'react-hooks'],
  rules: {
    // Add your project-specific ESLint rules here
  },
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  ignorePatterns: ['.eslintrc.cjs'],
};
