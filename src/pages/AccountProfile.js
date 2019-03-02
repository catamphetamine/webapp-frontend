import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, preload, Link } from 'react-website'
import classNames from 'classnames'

import {
	accountShapeProfile,
	postShape
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

import {
	ContentSection,
	ContentSectionHeader
} from '../components/ContentSection'

import './AccountProfile.css'

@meta(({ account: { account } }) => ({
	title: account && account.name,
	description: account && account.description,
	type: 'profile',
	'profile:first_name': account && account.firstName,
	'profile:last_name': account && account.lastName,
	'profile:username': account && account.idAlias,
	image: account && account.picture && account.picture.sizes.map((size) => ({
		_: size.url,
		width: size.width,
		height: size.height,
		type: account.picture.type
	}))
}))
@preload(async ({ dispatch, params }) => {
	// `id` could be an `id` and it could be an `idAlias`.
	const account = await dispatch(getAccount(params.id))
	// Get the list of account's posts.
	await dispatch(getAccountPosts(account.id))
}, { client: true })
@connect(({ account }) => ({
	account: account.account,
	posts: account.posts
}), {
	openSlideshow
})
export default class Profile extends React.Component
{
	static propTypes = {
		account: accountShapeProfile,
		posts: PropTypes.arrayOf(postShape),
		openSlideshow: PropTypes.func.isRequired
	}

	render() {
		const {
			account,
			posts
		} = this.props

		if (!account) {
			return null
		}

		const editing = false

		return (
			<section className="account-profile">
				{/* Background picture, account picture, account name. */}
				<AccountHeader account={account}/>

				{/* Account summary and action buttons on the left side. */}
				<div className="container">
					<div className="row">
						<div className="col-12 col-l-4 col-xl-3">
							{/* Account blocked notice */}
							{ account.blockedAt && this.render_account_blocked_notice() }

							<AccountSummary account={account}/>
							<AccountActions account={account}/>
						</div>

						<div className="col-12 col-l-8 col-xl-6">
							{/* Tabs */}
							<AccountTabs account={account}/>

							{/* Page content */}
							{posts && posts.map((post) => (
								<ContentSection key={post.id}>
									{/*<ContentSectionHeader>
										Craft
									</ContentSectionHeader>*/}
									<Post post={post} openSlideshow={openSlideshow}/>
								</ContentSection>
							))}
						</div>
					</div>
				</div>
			</section>
		)
	}
}