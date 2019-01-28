import { Redirect } from 'react-website'

import Application from './pages/Application'
import AccountProfile from './pages/AccountProfile'

import { ERROR_PAGES_ROUTES } from './routes.common'

export default [{
	path: '/',
	Component: Application,
	children: [
		new Redirect({ from: '/', to: '/alice' }),
		...ERROR_PAGES_ROUTES,
		{ path: ':id', Component: AccountProfile }
	]
}]