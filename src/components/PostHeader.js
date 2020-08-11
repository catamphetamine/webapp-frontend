import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-pages'

import AccountPicture from './AccountPicture'
import PostDate from './PostDate'
import PostMoreActions, { moreActionsType } from './PostMoreActions'
import PostTitle from './PostTitle'
import PostBadge from './PostBadge'
import PostVotes from './PostVotes'
import HoverButton from './HoverButton'
import { accountLink } from './AccountLink'

import { post, postBadge } from '../PropTypes'

import MessageIcon from '../../assets/images/icons/message-rounded-rect-square.svg'
// import ReplyIcon from '../../assets/images/icons/reply.svg'
// import ClockIcon from '../../assets/images/icons/clock.svg'

import './PostHeader.css'
import './Padding.css'

export default function PostHeader({
	post,
	url,
	urlBasePath,
	onPostUrlClick,
	locale,
	header: Header,
	items,
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
	return (
		<header className="PostHeader">
			<div className="PostHeader-top">
				<PostHeaderLeft
					post={post}
					url={url}
					urlBasePath={urlBasePath}
					onPostUrlClick={onPostUrlClick}
					locale={locale}
					messages={messages}
					items={items}
					onShowReplies={onShowReplies}
					showingReplies={showingReplies}
					onReply={onReply}
					toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}/>
				<PostHeaderRight
					post={post}
					locale={locale}
					messages={messages}
					badges={badges}
					vote={vote}
					onVote={onVote}
					moreActions={moreActions}/>
			</div>
			{Header &&
				<Header post={post} locale={locale}/>
			}
			<PostTitle post={post}/>
		</header>
	)
}

PostHeader.propTypes = {
	post: post.isRequired,
	items: PropTypes.arrayOf(PropTypes.node),
	badges: PropTypes.arrayOf(postBadge),
	url: PropTypes.string,
	urlBasePath: PropTypes.string,
	onPostUrlClick: PropTypes.func,
	locale: PropTypes.string,
	header: PropTypes.func,
	moreActions: moreActionsType,
	messages: PropTypes.object,
	onReply: PropTypes.func,
	showingReplies: PropTypes.bool,
	onShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	vote: PropTypes.bool,
	onVote: PropTypes.func
}

function PostHeaderLeft({
	post,
	url,
	urlBasePath,
	onPostUrlClick,
	locale,
	messages,
	items,
	onReply,
	onShowReplies,
	toggleShowRepliesButtonRef,
	showingReplies
}) {
	const onPostUrlClick_ = useCallback((event) => {
		if (onPostUrlClick) {
			onPostUrlClick(event, post)
		}
	}, [onPostUrlClick, post])
	return (
		<div className="PostHeader-left">
			{/*moreActions &&
				<PostMoreActions
					title={messages && messages.moreActions && messages.moreActions.title}>
					{moreActions}
				</PostMoreActions>
			*/}
			{post.author &&
				<div className="PostAuthor">
					<Link to={accountLink(post.author)}>
						<AccountPicture
							account={post.author}
							className="PostAuthor-picture"/>
					</Link>
					<div className="PostAuthor-nameAndDate">
						<Link
							to={accountLink(post.author)}
							rel="author"
							className="PostAuthor-name">
							{post.author.name}
						</Link>
						{post.createdAt &&
							<PostDate
								date={post.createdAt}
								url={url}
								urlBasePath={urlBasePath}
								onClick={onPostUrlClick_}
								locale={locale}/>
						}
					</div>
				</div>
			}
			{items && items.map((item, i) => (
				<React.Fragment key={`headerItem:${i}`}>
					<div className="PostHeader-item">
						{item}
					</div>
					<div className="PostHeader-itemSeparator">
						·
					</div>
				</React.Fragment>
			))}
			{(!post.author && post.createdAt) &&
				<div className="PostHeader-item">
					<PostDate
						date={post.createdAt}
						url={url}
						urlBasePath={urlBasePath}
						onClick={onPostUrlClick_}
						locale={locale}/>
				</div>
			}
			{onReply && (!post.author && post.createdAt)  &&
				<div className="PostHeader-itemSeparator">
					·
				</div>
			}
			{onReply &&
				<div className="PostHeader-item">
					<HoverButton
						onClick={onReply}
						className="Padding">
						{/*<ReplyIcon className="PostHeader-itemIcon PostHeader-itemIcon--reply"/>*/}
						{messages && messages.reply}
					</HoverButton>
				</div>
			}
			{onShowReplies && onReply &&
				<div className="PostHeader-itemSeparator">
					·
				</div>
			}
			{onShowReplies &&
				<div className="PostHeader-item">
					<HoverButton
						ref={toggleShowRepliesButtonRef}
						onClick={onShowReplies}
						title={messages && messages.repliesCount}
						pushed={showingReplies}
						className="Padding">
						<MessageIcon className="PostHeader-itemIcon PostHeader-itemIcon--replies"/>
						{post.replies.length}
					</HoverButton>
				</div>
			}
		</div>
	)
}

PostHeaderLeft.propTypes = {
	post: post.isRequired,
	url: PropTypes.string,
	urlBasePath: PropTypes.string,
	onPostUrlClick: PropTypes.func,
	locale: PropTypes.string,
	messages: PropTypes.object,
	items: PropTypes.arrayOf(PropTypes.node),
	onReply: PropTypes.func,
	onShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	showingReplies: PropTypes.bool
}

function PostHeaderRight({
	post,
	locale,
	messages,
	badges,
	vote,
	onVote,
	moreActions
}) {
	if (badges) {
		badges = badges.filter(({ condition }) => condition(post))
	}
	const hasBadges = badges && badges.length > 0
	const hasVotes = onVote !== undefined
	return (
		<div className="PostHeader-right">
			{(hasBadges || hasVotes) &&
				<div className="PostHeader-rightExceptMoreActionsMenuButton">
					{hasBadges &&
						<div className="PostHeader-badges">
							{badges.map((badge) => {
								return (
									<PostBadge
										key={badge.name}
										post={post}
										locale={locale}
										messages={messages}
										badge={badge}
										className="PostHeader-badgeContainer"
										iconClassName={`PostHeader-badge PostHeader-badge--${badge.name}`}/>
								)
							})}
						</div>
					}
					{hasVotes &&
						<PostVotes
							post={post}
							vote={vote}
							onVote={onVote}
							messages={messages}/>
					}
				</div>
			}
			{moreActions &&
				<PostMoreActions
					alignment="right"
					title={messages && messages.moreActions && messages.moreActions.title}>
					{moreActions}
				</PostMoreActions>
			}
		</div>
	)
}

PostHeaderRight.propTypes = {
	post: post.isRequired,
	locale: PropTypes.string,
	messages: PropTypes.object,
	badges: PropTypes.arrayOf(postBadge),
	onVote: PropTypes.func,
	vote: PropTypes.bool,
	moreActions: moreActionsType
}