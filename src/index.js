// Add ES6 polyfill (for older browsers).
require('@babel/polyfill')

// Maintain CSS styles order.
require('./styles/style.css')

// `utility` self-test.
setTimeout(() => require('./utility/test'))

// Run the application.
require('./render').default().catch(error => console.error(error))