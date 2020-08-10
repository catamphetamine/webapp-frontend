import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form as Form_ } from 'easy-react-form'
export { Field, Submit } from 'easy-react-form'
import { useSelector, useDispatch } from 'react-redux'

import { showError } from '../redux/notifications'

import './Form.css'

export function Form({
	...rest
}, ref) {
	const dispatch = useDispatch()
	const notification = useSelector(({ notifications }) => notifications.notification)
	const onError = useCallback((error) => {
		console.error(error)
		dispatch(showError(error))
	}, [dispatch])
	return (
		<Form_
			ref={ref}
			onError={onError}
			{...rest}/>
	)
}

Form = React.forwardRef(Form)