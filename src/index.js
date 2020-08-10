// ES6 polyfill.
require('core-js/stable')
// `async/await` support.
require('regenerator-runtime/runtime')

// https://github.com/gaearon/react-hot-loader
// "Make sure `react-hot-loader` is required before `react` and `react-dom`".
require('react-hot-loader');

// Maintain CSS styles order.
require('./styles/style.css')

if (process.env.NODE_ENV !== 'production') {
	// `utility` self-test.
	setTimeout(() => require('./utility/test'))
}

// Run the application.
require('./render').default().catch((error) => {
	console.error(error.stack || error)
	alert('Error')
})