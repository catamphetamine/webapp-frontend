import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-pages'

import AccountPicture from './AccountPicture'
import PostInlineContent from './PostInlineContent'
import PostDate from './PostDate'
import PostMoreActions, { moreActionsType } from './PostMoreActions'
import Button from './Button'
import { accountLink } from './AccountLink'
import { post, postBadge } from '../PropTypes'

import LeftArrowIcon from '../../assets/images/icons/left-arrow-minimal.svg'
import MessageIcon from '../../assets/images/icons/message-rounded-rect-square.svg'
// import ReplyIcon from '../../assets/images/icons/reply.svg'
// import ClockIcon from '../../assets/images/icons/clock.svg'

import './PostHeader.css'

export default function PostHeader({
	post,
	url,
	locale,
	header: Header,
	badges,
	messages,
	moreActions,
	onReply,
	showingReplies,
	onShowReplies,
	toggleShowRepliesButtonRef,
	vote,
	onVote
}) {
	const onUpVote = useCallback(() => onVote(true), [onVote])
	const onDownVote = useCallback(() => onVote(false), [onVote])
	if (badges) {
		badges = badges.filter(({ condition }) => condition(post))
	}
	const hasBadges = badges && badges.length > 0
	const hasVotes = onVote !== undefined
	return (
		<header className="post__header">
			<div className="post__header-top">
				<div className="post__summary">
					{/*moreActions &&
						<PostMoreActions
							title={messages.moreActions.title}>
							{moreActions}
						</PostMoreActions>
					*/}
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
					{(!post.author && post.createdAt) &&
						<div className="post__summary-item">
							<PostDate
								date={post.createdAt}
								link={url}
								locale={locale}/>
						</div>
					}
					{onReply && (!post.author && post.createdAt)  &&
						<div className="post__summary-item-separator">
							·
						</div>
					}
					{onReply &&
						<div className="post__summary-item">
							<Button
								onClick={onReply}
								className="post__summary-button hover-button">
								{/*<ReplyIcon className="post__summary-item-icon post__summary-item-icon--reply"/>*/}
								{messages.reply}
							</Button>
						</div>
					}
					{onShowReplies && onReply &&
						<div className="post__summary-item-separator">
							·
						</div>
					}
					{onShowReplies &&
						<div className="post__summary-item">
							<Button
								ref={toggleShowRepliesButtonRef}
								onClick={onShowReplies}
								title={messages.repliesCount}
								className={classNames('post__summary-button', 'post__summary-button--replies', 'hover-button', {
									'hover-button--pushed': showingReplies
								})}>
								<MessageIcon className="post__summary-item-icon post__summary-item-icon--replies"/>
								{post.replies.length}
							</Button>
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
									<Button
										title={vote !== undefined ? messages.alreadyVoted : messages.downvote}
										disabled={vote !== undefined}
										onClick={onDownVote}
										className={classNames('hover-button', 'post__summary-button', 'post__vote post__vote--down', {
											'post__vote--voted': vote !== undefined,
											'post__vote--downvoted': vote === false
										})}>
										<LeftArrowIcon className="post__vote-icon post__vote-icon--down"/>
									</Button>
									<div className={classNames('post__votes-count', {
										'post__votes-count--neutral': post.upvotes === post.downvotes,
										'post__votes-count--positive': post.upvotes > post.downvotes,
										'post__votes-count--negative': post.upvotes < post.downvotes
									})}>
										{(post.downvotes > post.upvotes) && '−'}
										{Math.abs(post.upvotes - post.downvotes)}
									</div>
									<Button
										title={vote !== undefined ? messages.alreadyVoted : messages.upvote}
										disabled={vote !== undefined}
										onClick={onUpVote}
										className={classNames('hover-button', 'post__summary-button', 'post__vote post__vote--up', {
											'post__vote--voted': vote !== undefined,
											'post__vote--upvoted': vote === true
										})}>
										<LeftArrowIcon className="post__vote-icon post__vote-icon--up"/>
									</Button>
								</div>
							}
						</div>
					}
					{moreActions &&
						<PostMoreActions
							alignment="right"
							title={messages.moreActions.title}>
							{moreActions}
						</PostMoreActions>
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

PostHeader.propTypes = {
	post: post.isRequired,
	badges: PropTypes.arrayOf(postBadge),
	url: PropTypes.string,
	locale: PropTypes.string,
	header: PropTypes.func,
	moreActions: moreActionsType,
	messages: PropTypes.object.isRequired,
	onReply: PropTypes.func,
	showingReplies: PropTypes.bool,
	onShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	vote: PropTypes.bool,
	onVote: PropTypes.func
}