import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Form as Form_ } from 'easy-react-form'
export { Field, Submit } from 'easy-react-form'
import { useSelector, useDispatch } from 'react-redux'

import { notify } from '../redux/notifications'

import './Form.css'

export function Form({
	notify,
	...rest
}, ref) {
	const dispatch = useDispatch()
	const notification = useSelector(({ notifications }) => notifications.notification)
	const onError = useCallback((error) => {
		console.error(error)
		dispatch(notify(error.message, { type: 'critical' }))
	}, [dispatch])
	return (
		<Form_
			ref={ref}
			onError={onError}
			{...rest}/>
	)
}

Form = React.forwardRef(Form)

Form.propTypes = {
	notify: PropTypes.func.isRequired
}