import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import { Button } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'
import classNames from 'classnames'

import { accountShape } from '../PropTypes'
import _translate from '../translate'

// import DefaultBackground from '../../assets/images/account-background-pattern.svg'
import DefaultBackgroundPicture from '../../assets/images/account-background-picture.jpg'

import UploadablePicture from './UploadablePicture'
import Picture from './Picture'
import AccountPicture from './AccountPicture'

import { accountLink } from './AccountLink'

import './AccountHeader.css'

const DEFAULT_BACKGROUND_PICTURE =
{
	type: 'image/jpeg',
	width: 2429,
	height: 782,
	url: DefaultBackgroundPicture
}

export default class AccountHeader extends React.Component
{
	static propTypes = {
		account: accountShape.isRequired
	}

	state = {}

	constructor()
	{
		super()
		this.saveChanges = this.saveChanges.bind(this)
	}

	canEdit()
	{
		const {
			account,
			user
		} = this.props

		return account // && account.user.id === user.id
	}

	setNewAccountPicture = (picture) => this.setState({ newAccountPicture: picture })
	setNewBackgroundPicture = (picture) => this.setState({ newBackgroundPicture: picture })

	render()
	{
		const {
			account
		} = this.props

		const {
			editing
		} = this.state

		account.backgroundPicture = DEFAULT_BACKGROUND_PICTURE

		return React.createElement(
			// Container: either a <div/> or a <form/>.
			editing ? Form : 'div',
			{
				className: classNames('account-header', {
					'account-header--editing' : editing
				}),
				...(editing ? { onSubmit: this.saveChanges } : null)
			},
			this.renderContent()
		)
	}

	renderContent()
	{
		const {
			account
		} = this.props

		const {
			editing,
			savingChanges
		} = this.state

		return (
			<React.Fragment>
				{/* Background picture. */}
				{ !editing && account.backgroundPicture &&
					this.renderBackgroundPicture()
				}

				{/* Background picture (editable). */}
				{ editing &&
					<UploadablePicture
						editMode={editing}
						onChange={this.setNewBackgroundPicture}
						disabled={savingChanges}
						changeLabel={(
							<Button
								className="account-header__change-background card__action card__action--on-background">
								{translate('account.header.change_background_picture')}
							</Button>
						)}
						className="account-header__uploadable-background-picture">

						{this.renderBackgroundPicture({ uploadable: true })}
					</UploadablePicture>
				}

				{/* Background picture shadow. */}
				{/*
				{ !editing && account.backgroundPicture &&
					<div className="account-header__background-picture-shadow"/>
				}
				*/}

				<div className="container account-header__container">
					{/* Account picture (editable). */}
					{ editing &&
						<UploadablePicture
							editMode={editing}
							onChange={this.setNewAccountPicture}
							disabled={savingChanges}
							className={classNames('account-header__uploadable-picture', 'account-header__picture-container', 'card')}>

							{this.renderAccountPicture({ uploadable: true })}
						</UploadablePicture>
					}

					{/* Account picture. */}
					{ !editing && this.renderAccountPicture() }

					{/* "Edit"/"Save". */}
					{this.canEdit() && this.renderEditActions()}
				</div>
			</React.Fragment>
		)
	}

	renderBackgroundPicture(props = {})
	{
		const { account } = this.props
		const { uploadable } = props
		const { newBackgroundPicture } = this.state

		return (
			<Picture
				fit="cover"
				picture={newBackgroundPicture || account.backgroundPicture}
				className="account-header__background-picture"/>
		);
	}

	renderAccountPicture(props = {})
	{
		const { account } = this.props
		const { uploadable } = props
		const { newAccountPicture } = this.state

		return (
			<Link
				to={accountLink(account)}
				className={classNames('account-header__picture', {
					'account-header__picture-container': !uploadable,
					'card': !uploadable
				})}>
				<AccountPicture
					account={account}
					picture={newAccountPicture}
					className="account-header__picture-image"/>
			</Link>
		);
	}

	renderEditActions()
	{
		// const { translate } = this.props
		const { editing, savingChanges } = this.state

		return (
			<div className="account-header__actions card__actions">

				{/* "Edit". */}
				{ !editing &&
					<Button
						onClick={this.toggleEditMode}
						className="card__action card__action--on-background">
						{translate('edit')}
					</Button>
				}

				{/* "Cancel". */}
				{ editing &&
					<Button
						onClick={this.toggleEditMode}
						className="card__action card__action--on-background"
						disabled={savingChanges}>
						{translate('cancel')}
					</Button>
				}

				{/* "Save". */}
				{ editing &&
					<Submit
						submit
						component={Button}
						className="card__action card__action--on-background card__action--primary">
						{translate('save')}
					</Submit>
				}
			</div>
		)
	}

	toggleEditMode = () =>
	{
		this.setState(({ editing }) => ({
			editing: !editing
		}))
	}

	async saveChanges(values)
	{
		this.setState({ savingChanges: true })
		console.log(values)
		this.setState({ editing: false, savingChanges: false })
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
		account: {
			header: {
				change_background_picture : 'Change background'
			}
		}
	}
}

const translate = (key, substitutes) => _translate(messages, 'en', key, substitutes)