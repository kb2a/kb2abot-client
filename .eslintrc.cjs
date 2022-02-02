module.exports = {
	"env": {
		"es2021": true,
		"node": true
	},
	"extends": "eslint:recommended",
	"parser": "@babel/eslint-parser",
	"parserOptions": {
		"ecmaVersion": 2021,
		"sourceType": 'module'
	},
	"rules": {
		"indent": [
			"error",
			"tab"
		],
		"linebreak-style": [
			"error",
			"unix"
		],
		"quotes": [
			"error",
			"double"
		],
		"semi": [
			"error",
			"never"
		]
	}
}
