module.exports = {
  globals: {
    __dirname: false,
  },
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:jest/recommended',
  ],
  parserOptions: {
    ecmaVersion: 9,
    ecmaFeatures: {
      impliedStrict: true,
    },
    sourceType: 'module',
  },
  plugins: ['prettier', 'jest'],
  rules: {
    semi: ['error', 'never'],
    indent: ['error', 2],
    quotes: ['warn', 'single'],
    'linebreak-style': ['error', 'unix'],
    'prettier/prettier': 'error',
    'jest/no-disabled-tests': 'warn',
    'jest/no-focused-tests': 'error',
    'jest/no-identical-title': 'error',
    'jest/prefer-to-have-length': 'warn',
    'jest/consistent-test-it': 'error',
    'jest/valid-expect': 'error',
    'jest/valid-describe': 'error',
  },
}
