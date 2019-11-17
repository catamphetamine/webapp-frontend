import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { accountShape } from '../PropTypes'
import _translate from '../translate'

import Button from './Button'

// import MessageIcon from '../../assets/images/icons/message.svg'
// import PersonAddIcon from '../../assets/images/icons/person-add.svg'

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
				{/* "Follow" */}
				<Button
					action={this.subscribe}
					className="account-action button--outline button--outline-base-color">
					{/* Text */}
					{translate('account.actions.follow')}
				</Button>

				{/* "Send message" */}
				<Button
					action={this.sendMessage}
					className="account-action button--outline button--outline-base-color">
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
					className="account-action button--generic">
					{/* Text */}
					{translate('account.actions.block')}
				</Button>

				{/* "Unblock" */}
				<Button
					action={this.sendMessage}
					className="account-action button--generic">
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
				sendMessage: 'Contact',
				follow: 'Follow',
				block: 'Block',
				unblock: 'Unblock'
			}
		}
	}
}

const translate = (key, substitutes) => _translate(messages, 'en', key, substitutes)