const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const prettierConfig = require('eslint-config-prettier/flat');
const prettierPlugin = require('eslint-plugin-prettier/recommended');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  resolvePluginsRelativeTo: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  {
    ignores: ['node_modules/', 'lib/', 'example/', 'coverage/'],
  },
  ...compat.extends('@react-native'),
  prettierConfig,
  prettierPlugin,
  {
    rules: {
      'prettier/prettier': 'error',
    },
  },
];
