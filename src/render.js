import { render } from 'react-pages'

import settings from './react-pages'
import { autoDarkMode } from './utility/style'

export default async function() {
	autoDarkMode(true, (value) => console.log('Dark mode:', value))
	// Renders the webpage on the client side
	const result = await render(settings)
	// If there was an error during the initial rendering
	// then `result` will be `undefined`.
	if (result) {
		const { store, rerender } = result
		// Webpack "Hot Module Replacement"
		if (module.hot) {
			module.hot.accept('./react-pages', () => {
				store.hotReload(settings.reducers)
				rerender()
			})
		}
	}
}