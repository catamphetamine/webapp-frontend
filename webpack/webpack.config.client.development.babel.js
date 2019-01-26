import webpack from 'webpack'

import { clientConfiguration } from 'universal-webpack'
import settings from './universal-webpack-settings'
import baseConfiguration from './webpack.config'

import { createDevServerConfig, setDevFileServer } from './devserver'

import applicationConfiguration from '../configuration'

export function createConfig(baseConfiguration, settings, applicationConfiguration) {
	let configuration = clientConfiguration(baseConfiguration, settings)

	// `webpack-serve` can't set the correct `mode` by itself
	// so setting `mode` to `"development"` explicitly.
	// https://github.com/webpack-contrib/webpack-serve/issues/94
	configuration.mode = 'development'

	// Fetch all files from webpack development server.
	configuration = setDevFileServer(
		configuration,
		applicationConfiguration.webpack.devserver
	)

	// Run `webpack-dev-server`.
	configuration.devServer = createDevServerConfig({
		devServer: applicationConfiguration.webpack.devserver,
		apiService: applicationConfiguration.services.api,
		renderingService: applicationConfiguration.services.rendering
	})

	configuration.plugins.push(
		// Prints more readable module names in the browser console on HMR updates.
		new webpack.NamedModulesPlugin()
	)

	return configuration
}

export default createConfig(baseConfiguration, settings, applicationConfiguration)