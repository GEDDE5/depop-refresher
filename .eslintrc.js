module.exports = {
  env: {
    browser: false,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  parser: 'babel-eslint',
  rules: {
    'arrow-parens': 'off',
    camelcase: 'off',
    'import/first': 'off',
    'import/newline-after-import': 'off',
    'no-bitwise': 'off',
    'no-console': 'off',
    'no-underscore-dangle': 'off',
    'no-unused-expressions': [
      'error',
      { allowShortCircuit: true, allowTernary: true },
    ],
    'no-unused-vars': 'warn',
    semi: 'off',
  },
  settings: {
    'import/extensions': ['.js', '.json'],
    'import/resolver': {
      node: {
        paths: ['.'],
      },
    },
  },
}
