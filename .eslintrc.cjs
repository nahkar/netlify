/* eslint-env node */

module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:@typescript-eslint/recommended-requiring-type-checking',
		'plugin:react-hooks/recommended',
		"eslint-config-prettier",
		"plugin:prettier/recommended",
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
		project: true,
		tsconfigRootDir: __dirname,
	},
	plugins: ['react-refresh','react', '@typescript-eslint', 'prettier'],
	rules: {
		'react/react-in-jsx-scope': 'off',
		'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
		'@typescript-eslint/no-non-null-assertion': 'off',
		'@typescript-eslint/no-unsafe-assignment': 'off',
		'@typescript-eslint/no-unsafe-call': 'off',
		'@typescript-eslint/no-explicit-any': 'off',
		'@typescript-eslint/no-unsafe-member-access': 'off',
		'@typescript-eslint/no-misused-promises': 'off',
		"no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error"],
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
	ignorePatterns: ['.eslintrc.cjs', 'src/utils/dnd/dnd.d.ts', 'src/**/*.test.*', 'vite.config.ts'],
};
