import React from 'react'
import { Route, Redirect } from 'react-website'

import Application from './pages/Application'

import AccountProfile from './pages/AccountProfile'

import { createErrorPagesRoutes } from './routes.common'

export default
(
	<Route
		path="/"
		Component={Application}>

		<Redirect from="/" to="/alice"/>

		{createErrorPagesRoutes()}

		<Route
			path=":id"
			Component={AccountProfile}/>
	</Route>
)