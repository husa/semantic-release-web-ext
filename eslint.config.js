import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
  },
  {
    files: ['**/*.test.{js,ts}'],
    languageOptions: { globals: globals.jest },
  },
  {
    ignores: ['dist/**'],
  },
  {
    languageOptions: { globals: globals.node },
  },
  pluginJs.configs.recommended,
];
