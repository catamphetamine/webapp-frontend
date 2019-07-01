import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal, Button } from 'react-responsive-ui'

import { close } from '../redux/okCancelDialog'
import { getPromise, resolve } from './OkCancelDialogPromise'

import './OkCancelDialog.css'

@connect(({ okCancelDialog }) => ({
	isOpen: okCancelDialog.isOpen,
	title: okCancelDialog.title,
	content: okCancelDialog.content,
	input: okCancelDialog.input
}), {
	close
})
export default class OkCancelDialog extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		close: PropTypes.func.isRequired,
		title: PropTypes.string,
		content: PropTypes.node,
		input: PropTypes.bool,
		okLabel: PropTypes.string.isRequired,
		cancelLabel: PropTypes.string.isRequired,
		yesLabel: PropTypes.string.isRequired,
		noLabel: PropTypes.string.isRequired
	}

	onOk = () => {
		this.close(true)
	}

	close = (value = false) => {
		const { close } = this.props
		resolve(value)
		close()
	}

	render() {
		const {
			isOpen,
			close,
			title,
			content,
			input,
			okLabel,
			cancelLabel,
			yesLabel,
			noLabel
		} = this.props
		return (
			<Modal
				isOpen={isOpen}
				close={this.close}>
				{title &&
					<Modal.Title>
						{title}
					</Modal.Title>
				}
				<Modal.Content>
					{content}
				</Modal.Content>
				<Modal.Actions>
					<Button
						onClick={this.close}
						className="ok-cancel-dialog__cancel rrui__button--text">
						{input ? cancelLabel : noLabel}
					</Button>
					<Button
						onClick={this.onOk}
						className="ok-cancel-dialog__ok rrui__button--background">
						{input ? okLabel : yesLabel}
					</Button>
				</Modal.Actions>
			</Modal>
		)
	}

	static getPromise() {
		return getPromise()
	}
}