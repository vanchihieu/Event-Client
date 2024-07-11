module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    'prettier/prettier': ['error', {endOfLine: 'auto'}],
    '@typescript-unused-imports/no-unused-imports': 0,
    '@typescript-eslint/no-unused-vars': 0,
    '@typescript-eslint/no-inline-styles': 0,
    'react-native/no-inline-styles': 0,
  },
};
