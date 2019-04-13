import React from 'react'
import PropTypes from 'prop-types'

import Post from './Post'
import { RepliesCountBadge } from './Post.badges'

import { post } from '../PropTypes'
import removeLeadingPostLink from '../utility/post/removeLeadingPostLink'
import scrollIntoView from '../utility/scrollIntoView'

import './CommentTree.css'

export default class CommentTree extends React.PureComponent {
	static propTypes = {
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
			comment,
			parentComment,
			component: Component
		} = this.props
		let {
			showReplies
		} = this.state
		// Expand replies without left padding if this is the only reply
		// for the comment and the comment is not a root-level one
		// and it's the only reply for the comment's parent comment.
		const expandRepliesWithoutPadding = isDialogueChain(comment, parentComment)
		// Automatically expand dialogue comment chains.
		if (expandRepliesWithoutPadding) {
			showReplies = true
		}
		return (
			<React.Fragment>
				<Component
					{...this.props}
					postRef={this.post}
					showingReplies={showReplies}
					onToggleShowReplies={comment.replies ? this.onToggleShowReplies : undefined}
					toggleShowRepliesButtonRef={this.toggleShowRepliesButton}/>
				{showReplies && expandRepliesWithoutPadding &&
					<div className="comment-tree__dialogue-chain-marker"/>
				}
				{showReplies && expandRepliesWithoutPadding &&
					<CommentTree
						{...this.props}
						comment={removeLeadingPostLink(comment.replies[0], comment)}
						parentComment={comment}/>
				}
				{showReplies && !expandRepliesWithoutPadding &&
					<div className="comment-tree">
						<button
							type="button"
							tabIndex={-1}
							onClick={this.onBranchToggleClick}
							className="rrui__button-reset comment-tree__branch"/>
						{comment.replies.map((reply) => (
							<CommentTree
								{...this.props}
								key={reply.id}
								comment={removeLeadingPostLink(reply, comment)}
								parentComment={comment}/>
						))}
					</div>
				}
			</React.Fragment>
		)
	}
}

export function isDialogueChain(comment, parentComment) {
	return comment.replies && comment.replies.length === 1 &&
			parentComment && parentComment.replies.length === 1
}