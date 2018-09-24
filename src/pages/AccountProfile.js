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
	title: account && account.name || '',
	description: account && account.data.description || '',
	type: 'profile',
	'profile:username': account && account.name || '',
	image: account && account.data.picture && account.data.picture.sizes[0].url || '',
	'og:image:width': account && account.data.picture && account.data.picture.sizes[0].width || '',
	'og:image:height': account && account.data.picture && account.data.picture.sizes[0].height || '',
	'og:image:type': account && account.data.picture && account.data.picture.sizes[0].type || ''
}))
@preload(async ({ dispatch, params }) => {
	// `id` could be an `id` and it could be a `nameId`.
	const account = await dispatch(getAccount(params.id))
	// Get the list of account's posts.
	await dispatch(getAccountPosts(account.id))
}, { client: true })
@connect(({ account }) => ({
	account: account.account,
	posts: account.posts
}), {
})
export default class Profile extends React.Component
{
	static propTypes = {
		account: accountShapeProfile,
		posts: PropTypes.arrayOf(postShape)
	}

	render()
	{
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
						<div className="col-12 col-xl-4">
							{/* Account blocked notice */}
							{ account.blockedAt && this.render_account_blocked_notice() }

							<AccountSummary account={account}/>
							<AccountActions account={account}/>
						</div>

						<div className="col-12 col-xl-8">
							{/* Tabs */}
							<AccountTabs account={account}/>

							{/* Page content */}
							{posts && posts.map((post) => (
								<ContentSection key={post.id}>
									{/*<ContentSectionHeader>
										Craft
									</ContentSectionHeader>*/}
									<Post post={post}/>
								</ContentSection>
							))}
						</div>
					</div>
				</div>
			</section>
		)
	}
}