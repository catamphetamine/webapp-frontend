import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import { accountLink } from './AccountLink'

import { accountShape, locationShape } from '../PropTypes'
import _translate from '../translate'

import './AccountTabs.css'

export default function AccountTabs({ account }) {
	const location = useSelector(({ found }) => found.resolvedMatch.location)

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

AccountTabs.propTypes = {
	account: accountShape.isRequired,
	location: locationShape.isRequired
}

const messages =
{
	ru: {
	},
	en: {
		account : {
			tabs : {
				feed: 'Feed',
				subscriptions: 'Following',
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