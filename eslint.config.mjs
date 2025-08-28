// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs'
import stylistic from '@stylistic/eslint-plugin'

export default withNuxt([
	{
		plugins: {
			'@stylistic': stylistic,
		},
		files: ['**/*.js', '**/*.vue', '**/*.ts', '**/*.tsx'],
		rules: {
			// Remove 'semi' rule
			// Enforce single quotes
			'@stylistic/quotes': ['error', 'single', { avoidEscape: true }],
			'@stylistic/semi': ['error', 'never'],
		},
		ignores: [
			'node_modules/**',
      'dist/**'
		]
	},
])
