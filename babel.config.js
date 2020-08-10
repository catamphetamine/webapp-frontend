module.exports = {
	presets: [
		"@babel/preset-env"
	],
	plugins: [
		["@babel/plugin-proposal-decorators", { "legacy": true }],
		["@babel/plugin-proposal-class-properties", { "loose" : true }]
	],
	overrides: [{
		include: [
			"./src",
			"../webapp-frontend/src"
		],
		presets: [
			"@babel/preset-react"
		],
		plugins: [
			["babel-plugin-transform-react-remove-prop-types", { removeImport: true }],
			"react-hot-loader/babel"
		]
	}, {
		include: "./rendering-service",
		presets: [
			"@babel/preset-react"
		]
	}]
}