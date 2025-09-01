// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt([
  {
    plugins: {
      '@stylistic': stylistic
    },
    files: [
      '**/*.js',
      '**/*.vue',
      '**/*.ts',
      '**/*.tsx',
      '**/*.mjs',
      '**/*.cjs'
    ],
    languageOptions: {
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: false
      }
    },
    rules: {
      // Style rules
      '@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/indent': ['error', 2],

      // Allow console in development
      'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',

      // Allow unused variables starting with underscore
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }]
    },
    ignores: [
      'node_modules/**',
      'dist/**',
      '.nuxt/**',
      '.output/**',
      'coverage/**'
    ]
  }
])
