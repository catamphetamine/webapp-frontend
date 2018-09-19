import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import { accountLink } from './AccountLink'

import { accountShape, locationShape } from '../PropTypes'
import _translate from '../translate'

import './AccountTabs.css'

@connect(({ found }) => ({
	location: found.resolvedMatch.location
}))
export default class AccountTabs extends React.Component
{
	static propTypes = {
		account: accountShape.isRequired,
		location: locationShape.isRequired
	}

	render()
	{
		const { account, location } = this.props

		// Extract "content type" from URL.
		// E.g. `/alice/photos` -> `photos`.
		const contentType = getContentType(location)

		return (
			<ul className="account-tabs">
				{TABS.map((tab) => (
					<li
						key={tab}
						className="account-tabs__tab">
						<Link
							to={`${accountLink(account)}${tab === 'feed' ? '' : '/' + tab}`}
							className={ classNames('account-tabs__tab-link', {
								'account-tabs__tab-link--active' : tab === 'feed' ? !contentType : contentType === tab
							}) }>
							{translate(`account.tabs.${tab}`)}
						</Link>
					</li>
				))}
			</ul>
		)
	}
}

const messages =
{
	ru: {
	},
	en: {
		account : {
			tabs : {
				feed: 'Feed',
				subscriptions: 'Subscriptions',
				photos: 'Photos',
				videos: 'Videos'
			}
		}
	}
}

const translate = (key, substitutes) => _translate(messages, 'en', key, substitutes)

const TABS = [
	'feed',
	'subscriptions',
	'photos',
	'videos'
]

// Extracts "content type" from URL.
// E.g. `/alice/photos` -> `photos`.
function getContentType(location) {
	const parsedSubpath = location.pathname.match(/^\/(?:[^\/]+)\/([^\/]+)/)
	if (parsedSubpath) {
		return parsedSubpath[1]
	}
}