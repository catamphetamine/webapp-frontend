import { ReduxModule } from 'react-website'

// Using an explicit Redux event namespace here to prevent
// autogenerated Redux event name collision due to different
// `node_modules/react-website` packages being used.
const redux = new ReduxModule('NOTIFICATIONS')

export const notify = redux.simpleAction
(
	(content, options) => ({ content, ...options }),
	'notification'
)

export default redux.reducer()