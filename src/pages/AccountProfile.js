import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import {
	accountShapeProfile,
	post
} from '../PropTypes'

import {
	getAccount,
	getAccountPosts
} from '../redux/account'

import { openSlideshow } from '../redux/slideshow'

import AccountHeader from '../components/AccountHeader'
import AccountSummary from '../components/AccountSummary'
import AccountActions from '../components/AccountActions'
import AccountTabs from '../components/AccountTabs'
import Post from '../components/Post'
import { isSlideSupported } from '../components/Slideshow'

import {
	ContentSection,
	ContentSectionHeader
} from '../components/ContentSection'

import getSortedAttachments from 'social-components/commonjs/utility/post/getSortedAttachments'

import './AccountProfile.css'

export default function Profile() {
	const dispatch = useDispatch()
	const account = useSelector(({ account }) => account.account)
	const posts = useSelector(({ account }) => account.posts)
	const onAttachmentClick = useCallback((attachment, post) => {
		const attachments = getSortedAttachments(post).filter(isSlideSupported)
		const i = attachments.indexOf(attachment)
		// If an attachment is either an uploaded one or an embedded one
		// then it will be in `post.attachments`.
		// If an attachment is only attached to a `link`
		// (for example, an inline-level YouTube video link)
		// then it won't be included in `post.attachments`.
		if (i >= 0) {
			dispatch(openSlideshow(attachments, i))
		} else {
			dispatch(openSlideshow([attachment], 0))
		}
	}, [dispatch])
	if (!account) {
		return null
	}
	return (
		<section className="account-profile">
			{/* Background picture, account picture, account name. */}
			<AccountHeader account={account}/>

			{/* Account summary and action buttons on the left side. */}
			<div className="container">
				<div className="row">
					<div className="col-12 col-l-4 col-xl-3">
						{/* Account blocked notice */}
						{ account.blockedAt &&
							<AccountBlockedNotice account={account} />
						}

						<AccountSummary account={account}/>
						<AccountActions account={account}/>
					</div>

					<div className="col-12 col-l-8 col-xl-6">
						{/* Tabs */}
						<AccountTabs account={account}/>

						{/* Page content */}
						{posts && posts.map((post) => (
							<ContentSection key={post.id} className="account-profile__post-section">
								{/*<ContentSectionHeader>
									Craft
								</ContentSectionHeader>*/}
								<Post
									post={post}
									onAttachmentClick={(attachment) => onAttachmentClick(attachment, post)}/>
							</ContentSection>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}

Profile.meta = ({ account: { account } }) => ({
	title: account && account.name,
	description: account && account.description,
	type: 'profile',
	'profile:first_name': account && account.firstName,
	'profile:last_name': account && account.lastName,
	'profile:username': account && account.idAlias,
	image: account && account.picture && {
		_: account.picture.url,
		width: account.picture.width,
		height: account.picture.height,
		type: account.picture.type
	}
})

Profile.load = async ({ dispatch, params }) => {
	// `id` could be an `id` and it could be an `idAlias`.
	const account = await dispatch(getAccount(params.id))
	// Get the list of account's posts.
	await dispatch(getAccountPosts(account.id))
}

Profile.propTypes = {
	account: accountShapeProfile,
	posts: PropTypes.arrayOf(post),
	dispatch: PropTypes.func.isRequired
}

function AccountBlockedNotice({ account }) {
	return 'Blocked'
}

AccountBlockedNotice.propTypes = {
	account: accountShapeProfile.isRequired
}