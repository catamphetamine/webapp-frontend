import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-website'

import AccountPicture from './AccountPicture'
import PostInlineContent from './PostInlineContent'
import PostDate from './PostDate'
import { accountLink } from './AccountLink'
import { post, postBadge } from '../PropTypes'

import EllipsisIcon from '../../assets/images/icons/ellipsis.svg'
import LeftArrowIcon from '../../assets/images/icons/left-arrow-minimal.svg'

import './PostHeader.css'

export default class PostHeader extends React.Component {
	toggleMenu = () => {
		const { onMoreActions } = this.props
		if (onMoreActions) {
			onMoreActions()
		}
	}

	onUpVoteClick = () => {
		const { onVote } = this.props
		onVote(true)
	}

	onDownVoteClick = () => {
		const { onVote } = this.props
		onVote(false)
	}

	render() {
		const {
			post,
			url,
			locale,
			header: Header,
			moreActionsLabel,
			replyLabel,
			onReply,
			onVote
		} = this.props

		let {
			badges
		} = this.props

		if (badges) {
			badges = badges.filter(({ condition }) => condition(post))
		}

		const hasBadges = badges && badges.length > 0
		const hasVotes = onVote !== undefined

		return (
			<header className="post__header">
				<div className="post__header-top">
					<div className="post__summary">
						{post.author &&
							<div className="post__summary__account">
								<Link to={accountLink(post.author)}>
									<AccountPicture
										account={post.author}
										className="post__account-picture"/>
								</Link>
								<div className="post__account-name-and-date">
									<Link
										to={accountLink(post.author)}
										rel="author"
										className="post__account-name">
										{post.author.name}
									</Link>
									{post.createdAt &&
										<PostDate
											date={post.createdAt}
											link={url}
											locale={locale}/>
									}
								</div>
							</div>
						}
						{!post.author && post.createdAt &&
							<div className="post__summary-item">
								<PostDate
									date={post.createdAt}
									link={url}
									locale={locale}/>
							</div>
						}
						{!post.author && post.createdAt && onReply &&
							<div className="post__summary-item-separator">
								·
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
						{(hasBadges || hasVotes) &&
							<div className="post__actions-except-more">
								{hasBadges &&
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
								{hasVotes &&
									<div className="post__votes">
										<button
											type="button"
											className="hover-button post__summary-button post__vote post__vote--down rrui__button-reset"
											onClick={this.onDownVoteClick}>
											<LeftArrowIcon className="post__vote-icon post__vote-icon--down"/>
										</button>
										<div className={classNames('post__votes-count', {
											'post__votes-count--neutral': post.upvotes === post.downvotes,
											'post__votes-count--positive': post.upvotes > post.downvotes,
											'post__votes-count--negative': post.upvotes < post.downvotes
										})}>
											{(post.downvotes > post.upvotes) && '−'}
											{Math.abs(post.upvotes - post.downvotes)}
										</div>
										<button
											type="button"
											className="hover-button post__summary-button post__vote post__vote--up rrui__button-reset"
											onClick={this.onUpVoteClick}>
											<LeftArrowIcon className="post__vote-icon post__vote-icon--up"/>
										</button>
									</div>
								}
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
				{Header &&
					<Header post={post} locale={locale}/>
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
	post: post.isRequired,
	badges: PropTypes.arrayOf(postBadge),
	url: PropTypes.string,
	locale: PropTypes.string,
	header: PropTypes.func,
	moreActionsLabel: PropTypes.string,
	onMoreActions: PropTypes.func,
	replyLabel: PropTypes.string,
	onReply: PropTypes.func,
	onVote: PropTypes.func
}