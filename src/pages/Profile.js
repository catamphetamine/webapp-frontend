import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, preload, Link } from 'react-website'
import classNames from 'classnames'

import { accountShape } from '../PropTypes'

import {
	getAccount
} from '../redux/account'

import AccountHeader from '../components/AccountHeader'
import AccountSummary from '../components/AccountSummary'
import AccountActions from '../components/AccountActions'
import AccountTabs from '../components/AccountTabs'

import {
	ContentSection,
	ContentSectionHeader
} from '../components/ContentSection'

import './Profile.css'

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
@preload(({ dispatch, params }) => dispatch(getAccount(params.id)), { client: true })
@connect(({ account }) => ({
	account: account.account
}), {
})
export default class Profile extends React.Component
{
	static propTypes = {
		account: accountShape
	}

	render()
	{
		const {
			account
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
						<div className="col-4 col-xs-12 col--no-padding">

							{/* Account summary info */}
							<ContentSection
								background={!editing}>

								{/* Account blocked notice */}
								{ account.blockedAt && this.render_account_blocked_notice() }

								<AccountSummary account={account}/>
								<AccountActions account={account}/>
							</ContentSection>
						</div>

						<div className="col-8 col-xs-12 col--no-padding">
							{/* Tabs */}
							<AccountTabs account={account}/>

							{/* Page content */}
							{/* children */}
							<ContentSection>
								<ContentSectionHeader>
									Craft
								</ContentSectionHeader>
								<p>
									A craft or trade is a pastime or a profession that requires particular skills and knowledge of skilled work. In a historical sense, particularly the Middle Ages and earlier, the term is usually applied to people occupied in small-scale production of goods, or their maintenance, for example by tinkers. The traditional term craftsman is nowadays often replaced by artisan and rarely by craftsperson (craftspeople).
								</p>
								<p>
									Historically, the more specialized crafts with high value products tended to concentrate in urban centers and formed guilds. The skill required by their professions and the need to be permanently involved in the exchange of goods often demanded a generally higher level of education, and craftsmen were usually in a more privileged position than the peasantry in societal hierarchy. The households of craftsmen were not as self-sufficient as those of people engaged in agricultural work and therefore had to rely on the exchange of goods. Some crafts, especially in areas such as pottery, woodworking, and the various stages of textile production, could be practiced on a part-time basis by those also working in agriculture, and often formed part of village life.
								</p>
							</ContentSection>
						</div>
					</div>
				</div>
			</section>
		)
	}
}