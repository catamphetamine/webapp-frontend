import React from 'react'
import { Route } from 'react-website'

import Application from './pages/Application'

import AccountProfile from './pages/AccountProfile'

import GenericError from './pages/Error'
import Unauthenticated from './pages/Unauthenticated'
import Unauthorized from './pages/Unauthorized'
import NotFound from './pages/NotFound'

export default
(
	<Route
		path="/"
		Component={Application}>

		<Route
			path="unauthenticated"
			Component={Unauthenticated}
			status={401}/>

		<Route
			path="unauthorized"
			Component={Unauthorized}
			status={403}/>

		<Route
			path="not-found"
			Component={NotFound}
			status={404}/>

		<Route
			path="error"
			Component={GenericError}
			status={500}/>

		<Route
			path=":id"
			Component={AccountProfile}/>
	</Route>
)