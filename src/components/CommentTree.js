import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from './Post'
import { RepliesCountBadge } from './Post.badges'

import { post } from '../PropTypes'
import removeLeadingPostLink from '../utility/post/removeLeadingPostLink'
import scrollIntoView from '../utility/scrollIntoView'

import './CommentTree.css'

export default class CommentTree extends React.PureComponent {
	static propTypes = {
		flat: PropTypes.bool,
		comment: post.isRequired,
		component: PropTypes.func.isRequired
	}

	post = React.createRef()
	toggleShowRepliesButton = React.createRef()

	state = {
		showReplies: false
	}

	onToggleShowReplies = () => {
		const { showReplies } = this.state
		let promise
		if (showReplies) {
			if (this.post.current) {
				const postRect = this.post.current.getNode().getBoundingClientRect()
				if (postRect.top >= 0) {
					promise = Promise.resolve()
				} else {
					const scrolledDistance = Math.abs(postRect.top)
					promise = scrollIntoView(this.post.current.getNode(), {
						ease: 'easeInOutSine',
						duration: Math.min(140 + scrolledDistance / 2, 320),
						scrollMode: 'if-needed',
						block: 'nearest'
					})
				}
			} else {
				promise = Promise.resolve()
			}
			if (this.toggleShowRepliesButton.current) {
				promise.then(() => {
					this.toggleShowRepliesButton.current.focus()
				})
			}
		} else {
			promise = Promise.resolve()
		}
		promise.then(() => {
			this.setState({
				showReplies: !showReplies
			})
		})
	}

	onBranchToggleClick = (event) => {
		this.onToggleShowReplies()
	}

	render() {
		const {
			flat,
			comment,
			parentComment,
			component: Component,
			...rest
		} = this.props
		let {
			showReplies
		} = this.state
		// Expand replies without left padding if this is the only reply
		// for the comment and the comment is not a root-level one
		// and it's the only reply for the comment's parent comment.
		const _isMiddleDialogueChainLink = isMiddleDialogueChainLink(comment, parentComment)
		// Automatically expand dialogue comment chains.
		if (_isMiddleDialogueChainLink) {
			showReplies = true
		}
		return (
			<div className={classNames('comment-tree', {
				'comment-tree--nested': parentComment && !flat
			})}>
				{parentComment && !flat &&
					<div className="comment-tree__branch-marker"/>
				}
				{parentComment && !flat &&
					<div className="comment-tree__branch-line"/>
				}
				<Component
					{...rest}
					comment={comment}
					parentComment={parentComment}
					postRef={this.post}
					showingReplies={showReplies}
					onToggleShowReplies={comment.replies ? this.onToggleShowReplies : undefined}
					toggleShowRepliesButtonRef={this.toggleShowRepliesButton}/>
				{showReplies && _isMiddleDialogueChainLink && comment.replies &&
					<div className="comment-tree__dialogue-chain-marker"/>
				}
				{showReplies && comment.replies && _isMiddleDialogueChainLink &&
					<CommentTree
						{...rest}
						flat
						comment={removeLeadingPostLink(comment.replies[0], comment)}
						parentComment={comment}
						component={Component}/>
				}
				{showReplies && !_isMiddleDialogueChainLink &&
					<div className={classNames('comment-tree__replies', {
						// If comments don't have any side padding
						// then the root replies branch line would be ineligible
						// because it would be drawn at the very screen edge.
						// This CSS class can be used for styling such special case.
						'comment-tree__replies--root': !parentComment
					})}>
						<button
							type="button"
							tabIndex={-1}
							onClick={this.onBranchToggleClick}
							className="rrui__button-reset comment-tree__branch-toggler"/>
						{comment.replies.map((reply) => (
							<CommentTree
								{...rest}
								key={reply.id}
								comment={removeLeadingPostLink(reply, comment)}
								parentComment={comment}
								component={Component}/>
						))}
					</div>
				}
			</div>
		)
	}
}

export function isMiddleDialogueChainLink(comment, parentComment) {
	return comment.replies && comment.replies.length === 1 &&
			parentComment && parentComment.replies.length === 1
}