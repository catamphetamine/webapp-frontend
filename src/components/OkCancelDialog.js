import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useSelector, useDispatch } from 'react-redux'
import { Modal, Button } from 'react-responsive-ui'

import { close } from '../redux/okCancelDialog'
import { getPromise, resolve } from './OkCancelDialogPromise'

import './OkCancelDialog.css'

export default function OkCancelDialog({
	okLabel,
	cancelLabel,
	yesLabel,
	noLabel
}) {
	const dispatch = useDispatch()

	const isOpen = useSelector(({ okCancelDialog }) => okCancelDialog.isOpen)
	const title = useSelector(({ okCancelDialog }) => okCancelDialog.title)
	const content = useSelector(({ okCancelDialog }) => okCancelDialog.content)
	const input = useSelector(({ okCancelDialog }) => okCancelDialog.input)

	const onClose = useCallback((value = false) => {
		resolve(value)
		dispatch(close())
	}, [dispatch])

	const onOk = useCallback(() => onClose(true), [onClose])

	return (
		<Modal
			isOpen={isOpen}
			close={onClose}>
			{title &&
				<Modal.Title>
					{title}
				</Modal.Title>
			}
			<Modal.Content>
				{content}
			</Modal.Content>
			<Modal.Actions className="form__actions">
				<Button
					onClick={onClose}
					className="rrui__button--text form__action">
					{input ? cancelLabel : noLabel}
				</Button>
				<Button
					onClick={onOk}
					className="rrui__button--background form__action">
					{input ? okLabel : yesLabel}
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

OkCancelDialog.getPromise = getPromise

OkCancelDialog.propTypes = {
	// isOpen: PropTypes.bool,
	// close: PropTypes.func.isRequired,
	// title: PropTypes.string,
	// content: PropTypes.node,
	// input: PropTypes.bool,
	okLabel: PropTypes.string.isRequired,
	cancelLabel: PropTypes.string.isRequired,
	yesLabel: PropTypes.string.isRequired,
	noLabel: PropTypes.string.isRequired
}