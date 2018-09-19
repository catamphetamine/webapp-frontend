import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button } from 'react-responsive-ui'
import classNames from 'classnames'

import { accountShape } from '../PropTypes'
import _translate from '../translate'

import MessageIcon from '../../assets/images/icons/message.svg'
import PersonAddIcon from '../../assets/images/icons/person-add.svg'

import './AccountActions.css'

export default class AccountActions extends React.Component
{
	subscribe = () =>
	{
		const { account } = this.props
		console.log('...')
	}

	sendMessage = () =>
	{
		const { account } = this.props
		console.log('...')
	}

	render()
	{
		// const { translate } = this.props
		const { user } = this.props

		return (
			<div className="account-actions">
				{/* "Subscribe" */}
				<Button
					action={this.subscribe}
					className="account-action">
					{/* Icon */}
					<PersonAddIcon className="account-action__icon"/>
					{/* Text */}
					{translate('account.actions.subscribe')}
				</Button>

				{/* "Send message" */}
				<Button
					action={this.sendMessage}
					className="account-action">
					{/* Icon */}
					<MessageIcon className="account-action__icon"/>
					{/* Text */}
					{translate('account.actions.sendMessage')}
				</Button>

				{user && user.moderator && this.renderModeratorActions()}
			</div>
		)
	}

	renderModeratorActions()
	{
		return (
			<React.Fragment>
				{/* "Block" */}
				<Button
					action={this.subscribe}
					className="account-action">
					{/* Text */}
					{translate('account.actions.block')}
				</Button>

				{/* "Unblock" */}
				<Button
					action={this.sendMessage}
					className="account-action">
					{/* Text */}
					{translate('account.actions.unblock')}
				</Button>
			</React.Fragment>
		)
	}
}

const messages =
{
	ru: {
		cancel : 'Отмена',
		save : 'Сохранить',
		edit : 'Изменить'
	},
	en: {
		cancel : 'Cancel',
		save : 'Save',
		edit : 'Edit',
		account : {
			actions: {
				sendMessage: 'Send Message',
				subscribe: 'Subscribe',
				block: 'Block',
				unblock: 'Unblock'
			}
		}
	}
}

const translate = (key, substitutes) => _translate(messages, 'en', key, substitutes)