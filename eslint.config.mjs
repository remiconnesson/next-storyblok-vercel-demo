const globals = {
	console: 'readonly',
	fetch: 'readonly',
	process: 'readonly',
	Response: 'readonly',
	setTimeout: 'readonly',
	URL: 'readonly',
};

const eslintConfig = [
	{
		ignores: ['.next/**', 'node_modules/**'],
	},
	{
		files: ['**/*.{js,jsx,mjs}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals,
		},
		rules: {
			'no-undef': 'error',
			'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
		},
	},
];

export default eslintConfig;
