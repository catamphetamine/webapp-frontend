import GenericError from './pages/Error'
import Unauthenticated from './pages/Unauthenticated'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

export const ERROR_PAGES = [
	{ path: 'unauthenticated', status: 401, Component: Unauthenticated },
	{ path: 'unauthorized', status: 403, Component: Unauthorized },
	{ path: 'not-found', status: 404, Component: NotFound },
	{ path: 'error', status: 500, Component: GenericError }
]

export const NOT_FOUND = { path: '*', status: 404, Component: NotFound }