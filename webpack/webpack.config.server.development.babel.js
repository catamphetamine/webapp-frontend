import configuration from './webpack.config.server.production.babel'
import applicationConfiguration from '../configuration'
import { setDevFileServer } from './devserver'

// Same as production configuration
// with the only change that all files
// are served by webpack devserver.
export function createConfig(productionConfig, applicationConfiguration) {
	return setDevFileServer(
		productionConfig,
		applicationConfiguration.webpack.devserver
	)
}

export default createConfig(configuration, applicationConfiguration)
