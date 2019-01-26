import React from 'react'
import { Route } from 'react-website'

import GenericError from './pages/Error'
import Unauthenticated from './pages/Unauthenticated'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

export function createErrorPagesRoutes() {
	return [
		<Route
			key="unauthenticated"
			path="unauthenticated"
			Component={Unauthenticated}
			status={401}/>,

		<Route
			key="unauthorized"
			path="unauthorized"
			Component={Unauthorized}
			status={403}/>,

		<Route
			key="not-found"
			path="not-found"
			Component={NotFound}
			status={404}/>,

		<Route
			key="error"
			path="error"
			Component={GenericError}
			status={500}/>
	]
}