import { createConfig } from './react-pages.common'

import routes  from './routes'
import * as reducers from './redux'

// "Favicon" must be imported on the client side too
// since no assets are emitted on the server side
export { default as icon } from '../assets/images/icon.png'

export default createConfig({
	routes,
	reducers,
	transformUrl(url, { server }) {
		// Pass all `api://` requests to the API server.
		if (configuration.api && url.indexOf('api://') === 0) {
			//
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
			// https://stackoverflow.com/a/10892392/970769
			//
			if (!server && window.location.hostname === 'localhost') {
				return '/api/' + url.slice('api://'.length)
			}
			// Transform to an absolute URL.
			return configuration.api + '/' + url.slice('api://'.length)
		}
	},
	meta: {
		site_name   : 'WebApp',
		title       : 'WebApp',
		description : 'A generic web application boilerplate',
		image       : 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
		locale      : 'ru_RU',
		locales     : ['ru_RU', 'en_US']
	}
})