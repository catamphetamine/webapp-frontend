import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, preload, Link } from 'react-website'
import { Button, TextInput } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'
import classNames from 'classnames'

import { periodical } from '../utility/timer'
import { accountShape } from '../PropTypes'

import {
	getAccount,
	getLatestActivityTime,
	setNewBackgroundPicture,
	uploadPicture
} from '../redux/account'

// import DefaultBackground from '../../assets/images/account-background-pattern.svg'
import DefaultBackgroundPicture from '../../assets/images/account-background-picture.jpg'

import ClockIcon from '../../assets/images/icons/clock.svg'
import MessageIcon from '../../assets/images/icons/message.svg'
import PersonAddIcon from '../../assets/images/icons/person-add.svg'

import UploadablePicture from '../components/UploadablePicture'
import Picture from '../components/Picture'
import AccountPicture from '../components/AccountPicture'

import './Profile.css'

const LATEST_ACTIVITY_TIME_REFRESH_INTERVAL = 60 * 1000 // once in a minute

const ONLINE_STATUS_TIME_SPAN = 5 * 60 * 1000 // 5 minutes

const DEFAULT_BACKGROUND_COLOR = '#ffffff'

// const DEFAULT_BACKGROUND_PATTERN =
// {
// 	sizes:
// 	[{
// 		width  : 188,
// 		height : 178,
// 		url    : DefaultBackground
// 	}]
// }

const DEFAULT_BACKGROUND_PICTURE =
{
	sizes:
	[{
		width  : 2429,
		height : 782,
		url    : DefaultBackgroundPicture
	}]
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
		edit : 'Edit'
	}
}

function translate(key)
{
	return messages.en[key]
}

@meta(({ account: { account } }) => ({
	title: account ? account.name : ''
}))
@preload(({ dispatch, params }) => dispatch(getAccount(params.id)), { client: true })
// @onPageLoaded(({ dispatch, getState }) => {
// 	const account = getState().account.account

// 	// // If this is a user's account then also show "was online" time
// 	// if (account.user) {
// 	// 	// Refresh this user's latest activity time periodically.
// 	// 	// Do it in a timeout because `react-time-ago` also
// 	// 	// refreshes the time label once a minute,
// 	// 	// therefore to eliminate jitter due to the race condition
// 	// 	// a delay of half a minute is imposed.
// 	// 	this.stopLatestActivityTimeRefresh = periodical(() => dispatch(getLatestActivityTime(account.user.id)), LATEST_ACTIVITY_TIME_REFRESH_INTERVAL, 30 * 1000)
// 	// }
// })
@connect(({ account }) => ({
	account: account.account
}), {
	getLatestActivityTime,
	setNewBackgroundPicture,
	uploadPicture
})
export default class Profile extends React.Component
{
	static propTypes = {
		account: accountShape
	}

	state = {}

	constructor()
	{
		super()
		this.saveChangesHeader = this.saveChangesHeader.bind(this)
	}

	componentWillUnmount()
	{
		// Stop refreshing this user's latest activity time.
		if (this.stopLatestActivityTimeRefresh) {
			this.stopLatestActivityTimeRefresh()
		}
	}

	canEdit()
	{
		const {
			account,
			user
		} = this.props

		return true

		return account // && account.user.id === user.id
	}

	render()
	{
		const {
			account
		} = this.props

		const {
			editing,
			editingHeader,
			previewingNewBanner
		} = this.state

		if (!account) {
			return null
		}

		const wide_content = true

		const background_color_enabled = false

		const background_color = undefined

		const upload_picture = async () => {
			//
		}

		const set_upload_picture_error = () => {}
		const set_uploaded_account_background_pattern = () => {}


		const show_banner_while_editing = false

		const submitting = false

		const showBannerWhileEditing = previewingNewBanner || account.banner

		account.data.backgroundPicture = DEFAULT_BACKGROUND_PICTURE

		return (
			<section
				className={ classNames('account-profile',
				{
					'account-profile--editing' : editing,
				}) }>

				{React.createElement(
					editingHeader ? Form : 'div',
					{
						className: 'account-profile__background-picture-container',
						...(editingHeader ? { onSubmit: this.saveChangesHeader, autoFocus: true } : null)
					},
					this.renderTopSection()
				)}

				{/* Account info. */}
				<div className="account-profile__body content-sections">
					{ !wide_content &&
						<div
							style={ styles.personal_info_column }
							className="account-profile__info">

							{/* Account's personal info */}
							<section
								className={ classNames
								({
									'background-section' : !editing,
									'content-section'    : editing
								}) }>

								{/* Account blocked notice */}
								{ account.blocked_at && this.render_account_blocked_notice() }

								{/* User's personal info (description, place, etc) */}
								{ !editing &&
									<PersonalInfo account={ account }/>
								}

								{/* User's personal info form (name, description, place, etc) */}
								{ editing &&
									<PersonalInfoForm
										account={ account }
										busy={ account_form_busy }
										onSubmit={ this.save_profile_edits }
										storeSubmitButton={ ref => this.account_form_submit_button = ref }>

										{/* Account profile edit errors */}
										{ this.render_account_edit_errors() }
									</PersonalInfoForm>
								}

								{/* Block this account (not self) */}
								{ !this.can_edit_profile() && this.render_moderator_actions() }

								{/* Other account actions: "Send message", "Subscribe" */}
								{ !this.can_edit_profile() && this.render_other_account_actions() }

								{/* User online status: "Last seen: an hour ago" */}
								{/* account.user && !this.can_edit_profile() && this.render_online_status() */}
								{ account.user && this.render_online_status() }
							</section>
						</div>
					}

					<div className="account-profile__content">
						{/* Tabs */}
						<div className="account-profile__tabs-container">
							{/* this.render_tabs(route) */}
						</div>

						{/* Page content */}
						{/* children */}
					</div>

					<div className="account-profile__right-aside">
					</div>
				</div>
			</section>
		)
	}

	renderTopSection()
	{
		const {
			account,
			setNewBackgroundPicture,
			uploadingNewBackgroundPicture,
			newBackgroundPicture
		} = this.props

		const {
			editingHeader,
			savingChangesHeader,
			previewingNewBanner
		} = this.state

		const submitting = false

		return (
			<React.Fragment>
				{/* Background picture. */}
				{ !editingHeader && account.data.backgroundPicture &&
					<Picture
						fit="cover"
						sizes={account.data.backgroundPicture.sizes}
						className="account-profile__background-picture"/>
				}

				{/* Background picture shadow. */}
				{/*
				{ !editingHeader && account.data.backgroundPicture &&
					<div className="account-profile__background-picture-shadow"/>
				}
				*/}

				{/* Preview new background picture. */}
				{ editingHeader && newBackgroundPicture &&
					<Picture
						picture={newBackgroundPicture}
						className="account-profile__background-picture"/>
				}

				{/* Account picture (editable). */}
				{ editingHeader &&
					<UploadablePicture
						disabled={savingChangesHeader}
						onUploaded={setNewBackgroundPicture}
						className={classNames('account-profile__uploadable-picture', 'account-profile__picture-container', 'card')}>

						{this.renderAccountPicture({ uploadable: true })}
					</UploadablePicture>
				}

				{/* Account picture. */}
				{ !editingHeader && this.renderAccountPicture() }

				{ !editingHeader &&
					<Link
						to={`/${account.id}`}
						className="account-profile__name">
						{ account.name }
					</Link>
				}

				{ editingHeader &&
					<Field
						name="name"
						value={account.name}
						component={TextInput}
						className="account-profile__name-input"/>
				}

				{/* Edit/Save own profile. */}
				{this.canEdit() && this.renderEditActionsHeader()}
			</React.Fragment>
		)
	}

	renderAccountPicture(props = {})
	{
		const { account } = this.props
		const { uploadable } = props

		return (
			<Link
				to={`/${account.id}`}
				className={classNames('account-profile__picture', {
					'account-profile__picture-container': !uploadable
				})}>
				<AccountPicture
					account={account}
					className="account-profile__picture-image"/>
			</Link>
		);
	}

	renderEditActionsHeader()
	{
		// const { translate } = this.props
		const { editingHeader, savingChangesHeader } = this.state

		return (
			<div className="account-profile__edit-actions card__actions">

				{/* "Edit profile". */}
				{ !editingHeader &&
					<Button
						onClick={this.toggleEditModeHeader}
						className="card__action">
						{translate('edit')}
					</Button>
				}

				{/* "Cancel changes". */}
				{ editingHeader &&
					<Button
						onClick={this.toggleEditModeHeader}
						className="card__action"
						disabled={savingChangesHeader}>
						{translate('cancel')}
					</Button>
				}

				{/* "Save changes". */}
				{ editingHeader &&
					<Submit
						component={Button}
						className="card__action card__action--primary">
						{translate('save')}
					</Submit>
				}
			</div>
		)
	}

	toggleEditModeHeader = () =>
	{
		this.setState(({ editingHeader }) => ({
			editingHeader: !editingHeader
		}))
	}

	async saveChangesHeader(values)
	{
		this.setState({ savingChangesHeader: true })
		console.log(values)
		this.setState({ editingHeader: false, savingChangesHeader: false })
	}
}