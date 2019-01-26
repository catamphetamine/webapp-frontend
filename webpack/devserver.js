// `webpack-dev-server` settings.
export function createDevServerConfig({ devServer, apiService, renderingService }) {
	return {
		// The port to serve assets on.
		port: devServer.port,

		// Chrome won't allow querying `localhost` from `localhost`
		// so had to just proxy the `/api` path using `webpack-dev-server`.
		//
		// The Chrome error was:
		//
		// "Failed to load http://localhost:3003/example/users:
		//  Response to preflight request doesn't pass access control check:
		//  No 'Access-Control-Allow-Origin' header is present on the requested resource.
		//  Origin 'http://localhost:3000' is therefore not allowed access."
		//
		proxy: [{
			context: (path) => {
				return path !== '/api' && path.indexOf('/api/') !== 0
			},
			target: `http://localhost:${renderingService.port}`
		}, {
			context: '/api',
			target: `${apiService.secure ? 'https' : 'http'}://${apiService.host || 'localhost'}:${apiService.port}`,
			pathRewrite: { '^/api' : '' }
	  }],

	 	// This is just for forcing `webpack-dev-server`
	 	// to not disable proxying for root path (`/`).
	  index: '',

		// Uncomment if using `index.html` instead of Server-Side Rendering.
		// https://webpack.js.org/configuration/dev-server/#devserver-historyapifallback
		// historyApiFallback : true
	}
}

// Modifies webpack configuration to get all files
// from webpack development server.
export function setDevFileServer(configuration, { host, port })
{
	return {
		...configuration,
		output:
		{
			...configuration.output,
			publicPath: `http://${host}:${port}${configuration.output.publicPath}`
		}
	}
}