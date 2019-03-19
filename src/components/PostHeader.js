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
import PersonIcon from '../../assets/images/icons/menu/person-outline.svg'

import './PostHeader.css'

export default class PostHeader extends React.PureComponent {
	toggleMenu = () => {
		alert('Not implemented')
	}

	render() {
		const {
			post,
			thread,
			url,
			locale,
			moreActionsLabel,
			replyLabel,
			onReply
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
							<div className="post__summary-item">
								<Link to={accountLink(post.account)}>
									<AccountPicture
										account={post.account}
										className="post__account-picture"/>
								</Link>
								<div className="post__account-name-and-date">
									<Link
										to={accountLink(post.account)}
										rel="author"
										className="post__account-name">
										{post.account.name}
									</Link>
									<PostDate
										date={post.createdAt}
										link={url}
										locale={locale}/>
								</div>
							</div>
						}
						{!post.account &&
							<div className="post__summary-item">
								<PostDate
									date={post.createdAt}
									link={url}
									locale={locale}/>
							</div>
						}
						{onReply &&
							<div className="post__summary-item">
								<button
									type="button"
									onClick={onReply}
									className="rrui__button-reset hover-button post__summary-button">
									{replyLabel}
								</button>
							</div>
						}
					</div>
					<div className="post__actions">
						{badges && badges.length > 0 &&
							<div className="post__header-badges">
								{badges.map(({ name, title, icon, getIcon, getIconProps }) => {
									const Icon = getIcon ? getIcon(post, locale) : icon
									const props = getIconProps && getIconProps(post, locale)
									// `title` doesn't work on SVGs for some reason
									// (perhaps because SVGs don't have background)
									// so I moved `title` to a `<div/>`.
									return (
										<div
											key={name}
											title={title && title(post, locale)}
											className="post__header-badge-container">
											<Icon
												{...props}
												className={`post__header-badge post__header-badge--${name}`}/>
										</div>
									)
								})}
							</div>
						}
						{moreActionsLabel &&
							<button
								type="button"
								title={moreActionsLabel}
								onClick={this.toggleMenu}
								className="rrui__button-reset hover-button post__more-actions">
								<EllipsisIcon className="post__more-actions-icon"/>
							</button>
						}
					</div>
				</div>
				{(post.authorName || post.authorName2) &&
					<div className={classNames('post__author', post.authorRole && `post__author--${post.authorRole}`)}>
						<PersonIcon className="post__author-icon"/>
						{post.authorName &&
							<div className="post__author-name">
								{post.authorName}
							</div>
						}
						{post.authorName2 &&
							<div className="post__author-name-2">
								{post.authorName2}
							</div>
						}
					</div>
				}
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
	locale: PropTypes.string,
	moreActionsLabel: PropTypes.string,
	replyLabel: PropTypes.string,
	onReply: PropTypes.func
}