import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-website'

import AccountPicture from './AccountPicture'
import PostInlineContent from './PostInlineContent'
import PostDate from './PostDate'
import { accountLink } from './AccountLink'
import { postShape, postBadge } from '../PropTypes'

import EllipsisIcon from '../../assets/images/icons/ellipsis.svg'

import './PostHeader.css'

export default class PostHeader extends React.PureComponent {
	toggleMenu = () => {
		alert('Not implemented')
	}

	render() {
		const {
			url,
			locale,
			post,
			thread
		} = this.props

		let {
			badges
		} = this.props

		if (badges) {
			badges = badges.filter(({ condition }) => condition(post, thread))
		}

		return (
			<header className="post__header">
				<div className="post__header-top">
					<div className="post__summary">
						{post.account &&
							<React.Fragment>
								<Link to={accountLink(post.account)}>
									<AccountPicture
										account={post.account}
										className="post__account-picture"/>
								</Link>
								<div className="post__name-and-date">
									<Link
										to={accountLink(post.account)}
										rel="author"
										className="post__name">
										{post.account.name}
									</Link>
									<PostDate
										date={post.createdAt}
										link={url}
										locale={locale}/>
								</div>
							</React.Fragment>
						}
						{!post.account &&
							<PostDate
								date={post.createdAt}
								link={url}
								locale={locale}/>
						}
					</div>
					<div className="post__actions">
						{badges && badges.length > 0 &&
							<ul className="post__badges">
								{badges.map(({ name, title, icon: Icon }) => (
									<li key={name} title={title(locale)} className="post__badge">
										<Icon className={`post__badge-icon post__badge-icon--${name}`}/>
									</li>
								))}
							</ul>
						}
						<button
							type="button"
							onClick={this.toggleMenu}
							className="rrui__button-reset post__more-actions">
							<EllipsisIcon className="post__more-actions-icon"/>
						</button>
					</div>
				</div>
				{post.title &&
					<h1 className="post__heading">
						{post.titleCensored &&
							<PostInlineContent>
								{post.titleCensored}
							</PostInlineContent>
						}
						{!post.titleCensored && post.title}
					</h1>
				}
			</header>
		)
	}
}

PostHeader.propTypes = {
	post: postShape.isRequired,
	thread: PropTypes.object,
	badges: PropTypes.arrayOf(postBadge),
	url: PropTypes.string,
	locale: PropTypes.string
}