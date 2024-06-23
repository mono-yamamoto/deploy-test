// eslint.config.js
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

import security from "eslint-plugin-security";
import jsdoc from "eslint-plugin-jsdoc";
import noUnsanitized from "eslint-plugin-no-unsanitized";
import editorconfig from "eslint-plugin-editorconfig";
import prettier from "eslint-config-prettier";

import globals from "globals";

const compat = new FlatCompat();

export default [
	{
		ignores: [
			"node_modules/",

			"**/angular.min.js",
			"**/top.js",
			"**/ir.js",
			"**/excelcms-adjacent.js",
			"**/excelcms_newsroom_201902.js",
			"**/excelcms-newsroom-adjacent_kentico.js",
			"**/slick.js",
			"**/g-alert-exec.js",
			"**/excelcms_newsroom_kentico.js",
			"**/local-navigation-1.0.js",
			"**/jquery-2.2.4.min.js",
			"**/angular-sanitize.min.js",
			"**/jquery-1.7.1.min.js",
			"**/excelcms_newsroom.js",
			"**/keyvisual-slider.js",
			"**/excelcms.js",
			"**/g-alert.js",
			"**/excelcms-newsroom-adjacent.js",
			"**/kentico-add.js",
			"**/default.js",
			"**/filtering-function.js",
			"**/jquery.smoothScroll.js",
			"**/loop.js",
			"**/slick.min.js",
			"**/mf-custom.js",
			"**/keyvisual-slider_lazyloading.js",
		],
	},
	...compat.extends("airbnb-base"),
	js.configs.recommended,
	security.configs.recommended,
	prettier,
	{
		languageOptions: {
			globals: {
				...globals.browser,
				myCustomGlobal: "readonly",
			},
			parserOptions: {
				ecmaVersion: 2022,
				sourceType: "module",
			},
		},

		plugins: {
			editorconfig,
			jsdoc,
			"no-unsanitized": noUnsanitized,
		},

		rules: {
			"import/no-extraneous-dependencies": "off",
			curly: ["error", "all"],
			"brace-style": ["error", "1tbs", { allowSingleLine: false }],
			"jsdoc/require-jsdoc": [
				"error",
				{
					publicOnly: true,
					require: {
						ArrowFunctionExpression: true,
						ClassDeclaration: true,
						ClassExpression: true,
						FunctionDeclaration: true,
						FunctionExpression: true,
						MethodDefinition: true,
					},
					contexts: [
						"VariableDeclaration",
						"TSInterfaceDeclaration",
						"TSTypeAliasDeclaration",
						"TSPropertySignature",
						"TSMethodSignature",
					],
				},
			],
			"no-unsanitized/method": "error",
			"no-unsanitized/property": "error",
			// Define additional rules if needed
		},
		ignores: [
			// Define patterns for files to ignore
		],
		linterOptions: {
			reportUnusedDisableDirectives: true,
			// Define additional linter options if needed
		},
		// Define additional configuration elements if needed
	},
];
