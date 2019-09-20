import React from 'react'
import { Form as Form_ } from 'easy-react-form'
export { Field, Submit } from 'easy-react-form'
import { connect } from 'react-redux'

import { notify } from '../redux/notifications'

import './Form.css'

@connect(({ notifications }) => ({
	notification: notifications.notification
}), {
	notify
}, null, {
	withRef: true
})
export class Form extends React.Component {
	form = React.createRef()

	focus = (field) => this.form.current.focus(field)

	onError = (error) => {
		const { notify } = this.props
		console.error(error)
		notify(error.message, { type: 'critical' })
	}

	render() {
		const {
			notify,
			...rest
		} = this.props
		return (
			<Form_
				ref={this.form}
				onError={this.onError}
				{...rest}/>
		)
	}
}