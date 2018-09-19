import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import { Button, TextInput } from 'react-responsive-ui'
import { Form, Field, Submit } from 'easy-react-form'
import classNames from 'classnames'

// import { periodical } from '../utility/timer'

import {
	getLatestActivityTime
} from '../redux/account'

import { accountShape } from '../PropTypes'
import _translate from '../translate'

import ClockIcon from '../../assets/images/icons/clock.svg'
import GeoPointIcon from '../../assets/images/icons/geopoint.svg'

import './AccountSummary.css'

const LATEST_ACTIVITY_TIME_REFRESH_INTERVAL = 60 * 1000 // once in a minute
const ONLINE_STATUS_TIME_SPAN = 5 * 60 * 1000 // 5 minutes

export default class AccountSummary extends React.Component
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

	componentDidMount()
	{
		const { account, getLatestActivityTime } = this.props

		// If this is a user's account then also show "was online" time
		if (account && account.user && !this.stopLatestActivityTimeRefresh) {
			// Refresh this user's latest activity time periodically.
			// Do it in a timeout because `react-time-ago` also
			// refreshes the time label once a minute,
			// therefore to eliminate jitter due to the race condition
			// a delay of half a minute is imposed.
			// this.stopLatestActivityTimeRefresh = periodical(() => getLatestActivityTime(account.user.id), LATEST_ACTIVITY_TIME_REFRESH_INTERVAL, 30 * 1000)
		}
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

		return account // && account.user.id === user.id
	}

	render()
	{
		const {
			account
		} = this.props

		const {
			editing
		} = this.state

		return React.createElement(
			// Container: either a <div/> or a <form/>.
			editing ? Form : 'div',
			{
				className: classNames('account-summary', {
					'account-summary--editing' : editing
				}),
				...(editing ? { onSubmit: this.saveChanges, autoFocus: true } : null)
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
				{/* Description. */}
				{!editing && account.description &&
					<p className="account-summary__description">
						{account.description}
					</p>
				}

				{/* Whereabouts. */}
				{!editing && account.whereabouts &&
					<div className="account-summary__whereabouts">
						<GeoPointIcon className="account-summary__icon"/>
						{account.whereabouts}
					</div>
				}

				{/* User online status: "Last seen: an hour ago". */}
				{!editing && false && account.user && this.renderOnlineStatus()}

				{/* "Edit"/"Save". */}
				{this.canEdit() && this.renderEditActions()}
			</React.Fragment>
		)
	}

	renderEditActions()
	{
		// const { translate } = this.props
		const { editing, savingChanges } = this.state

		return (
			<div className="account-header__edit-actions card__actions">

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
			summary: {
				blocked: 'This user was temporarily blocked {blockedAt}',
				blockedDetails: 'This user was blocked {blockedAt} by {blockedBy} with reason: "{blockedReason}"'
			}
		}
	}
}

const translate = (key, substitutes) => _translate(messages, 'en', key, substitutes)

// renderOnlineStatus()
// {
// 	const {
// 		latestActivityTime,
// 		translate
// 	} = this.props
//
// 	if (!latestActivityTime) {
// 		return
// 	}
//
// 	let latestActivityTimeLabel
// 	if (Date.now() - latestActivityTime.getTime() < Online_status_time_span) {
// 		latestActivityTimeLabel = translate(messages.online)
// 	} else {
// 		// "an hour ago"
// 		latestActivityTimeLabel = <Time_ago tick={ false }>{ latestActivityTime }</Time_ago>
// 	}
//
// 	return (
// 		<div className="poster-profile__last-seen">
// 			{/* Icon */}
// 			<ClockIcon className="poster-profile__last-seen-icon"/>
// 			{/* "an hour ago" */}
// 			{ latestActivityTimeLabel }
// 		</div>
// 	)
// }

// renderBlockedNotice()
// {
// 	const {
// 		account,
// 		user
// 	} = this.props
//
// 	return (
// 		<div className="content-section__errors content-section__errors--top">
// 			{ account.blockedBy.id === user.id
// 				?
// 				<FormattedMessage
// 					{ ...messages.blocked }
// 					values=
// 					{ {
// 						blockedAt : <Time_ago>{ account.blockedAt }</Time_ago>
// 					} }/>
// 				:
// 				<FormattedMessage
// 					{ ...messages.blocked_detailed }
// 					values=
// 					{ {
// 						blockedAt     : <Time_ago>{ account.blockedAt }</Time_ago>,
// 						blockedBy     : <Poster>{ account.blockedBy.account }</Poster>,
// 						blockedReason : account.blockedReason
// 					} }/>
// 			}
// 		</div>
// 	)
// }
