module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
	},
	extends: [
		"eslint:recommended",
		"plugin:react-hooks/recommended",
		"plugin:react/recommended",
		"plugin:@typescript-eslint/recommended",
		"next/core-web-vitals",
		"prettier",
	],
	overrides: [],
	parserOptions: {
		ecmaVersion: "latest",
		tsconfigRootDir: __dirname,
		project: ["./tsconfig.json"],
	},
	root: true,
	plugins: ["react"],
	rules: {
		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
			},
		],
		"@typescript-eslint/consistent-type-definitions": ["error", "interface"],
		"@typescript-eslint/strict-boolean-expressions": ["error"],
		"@typescript-eslint/no-floating-promises": ["error"],
		"react/jsx-uses-react": "off",
		"react/react-in-jsx-scope": "off",
		"import/order": [
			"warn",
			{
				groups: [
					"builtin",
					"external",
					"parent",
					"sibling",
					"index",
					"object",
					"type",
				],
				pathGroupsExcludedImportTypes: ["builtin", "type"],
				pathGroups: [
					{
						pattern: "@/**",
						group: "parent",
						position: "before",
					},
				],
				alphabetize: {
					order: "asc",
				},
				"newlines-between": "always",
			},
		],
		"@typescript-eslint/consistent-type-imports": [
			"warn",
			{ prefer: "type-imports" },
		],
		"func-style": ["error", "declaration"],
		"react/jsx-curly-brace-presence": [
			"error",
			{
				props: "never",
				children: "never",
				propElementValues: "always",
			},
		],
	},
	ignorePatterns: ["node_modules"],
	settings: {
		react: {
			version: "detect",
		},
	},
};
