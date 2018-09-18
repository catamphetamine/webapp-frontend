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

import './Profile.css'

@meta(({ account: { account } }) => ({
	title: account ? account.name : ''
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
				<div className="account-profile__body content-sections">
					{ true &&
						<div className="account-profile__left-aside">

							{/* Account summary info */}
							<section
								className={ classNames
								({
									'background-section' : !editing,
									'content-section'    : editing
								}) }>

								{/* Account blocked notice */}
								{ account.blockedAt && this.render_account_blocked_notice() }

								<AccountSummary account={account}/>
								<AccountActions account={account}/>
							</section>
						</div>
					}

					<div className="account-profile__content">
						{/* Tabs */}
						<AccountTabs account={account}/>

						{/* Page content */}
						{/* children */}
					</div>

					<div className="account-profile__right-aside">
					</div>
				</div>
			</section>
		)
	}
}