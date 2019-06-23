import Container from './Container'

export function createConfig({ reducers, routes, container, transformURL, ...rest }) {
	return {
		...rest,

		reducers,
		routes,
		container: container || Container,

		// When the website is open in a web browser
		// hide website content under a "preloading" screen
		// until the application has finished loading.
		// It still "blinks" a bit in development mode
		// because CSS styles in development mode are included
		// not as `*.css` files but dynamically via javascript
		// by adding a `<style/>` DOM element, and that's why
		// in development mode styles are not applied immediately
		// in a web browser. In production mode CSS styles are
		// included as `*.css` files so they are applied immediately.
		showPreloadInitially: true,

		onError,

		// Pass all API requests to the API server.
		http: {
			transformURL: (url, server) => {
				if (transformURL) {
					const _url = transformURL(url, server)
					if (_url !== undefined) {
						return _url
					}
				}
				return url
			}
		}
	}
}

export function onError(error, { path, url, redirect, dispatch, getState, server }) {
  console.error('--------------------------------');
  console.error(`Error while loading "${url}"`);
  console.error('--------------------------------');
	console.error(error.stack)
	const redirectToErrorPage = (errorPagePath) => {
		// Prevents infinite redirection loop or double redirection.
		// For example, a double redirection in case of `/unauthenticated`.
		// (e.g. when two parallel `Promise`s load inside `@preload()`
		//  and both get Status 401 HTTP Response).
		// Or, for example, an infinite redirection loop in case of `/error`
		// when there're overall page rendering bugs, etc.
		if (path !== errorPagePath) {
			redirect(`${errorPagePath}?url=${encodeURIComponent(url)}`)
		}
	}
	// Not authenticated.
	if (error.status === 401) {
		return redirectToErrorPage('/unauthenticated')
	}
	// Not authorized.
	if (error.status === 403) {
		return redirectToErrorPage('/unauthorized')
	}
	// Not authorized.
	if (error.status === 404) {
		return redirectToErrorPage('/not-found')
	}
	// Redirect to a generic error page.
	return redirectToErrorPage('/error')
}