import { Redirect } from 'react-website'

import Application from './pages/Application'
import AccountProfile from './pages/AccountProfile'

import { ERROR_PAGES, NOT_FOUND } from './routes.common'

export default [{
	path: '/',
	Component: Application,
	children: [
		new Redirect({ from: '/', to: '/alice' }),
		...ERROR_PAGES,
		{ path: ':id', Component: AccountProfile },
		NOT_FOUND
	]
}]