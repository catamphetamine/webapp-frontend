import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Post from './Post'
import { RepliesCountBadge } from './Post.badges'

import { post } from '../PropTypes'
import removeLeadingPostLink from '../utility/post/removeLeadingPostLink'
import scrollIntoView from '../utility/scrollIntoView'

import './CommentTree.css'

export default class CommentTree extends React.Component {
	static propTypes = {
		flat: PropTypes.bool,
		comment: post.isRequired,
		component: PropTypes.func.isRequired,
		getComponentProps: PropTypes.func,
		// `state` is a recursive structure.
		// For a comment, `state` is either `null`
		// or an array having the same count of elements as the replies count for the comment.
		// `null` means "the comment's replies are not expanded".
		//  (or there're no replies to this comment).
		// `[...]` means "the comment's replies are expanded".
		//
		// Example:
		//
		// State:
		// {
		// 	replies: [
		// 		null,
		// 		null,
		// 		{
		// 			replies: [
		// 				null,
		// 				{
		// 					replies: [
		// 						null
		// 					]
		// 				}
		// 			]
		// 		},
		// 		null
		// 	]
		// }
		//
		// Representation:
		// |---------|
		// | Comment |
		// |---------|
		// |  |---------|
		// |--| Comment |
		// |  |---------|
		// |  |---------|
		// |--| Comment |
		// |  |---------|
		// |  |---------|
		// |--| Comment |
		// |  |---------|
		// |  |  |---------|
		// |  |--| Comment |
		// |  |  |---------|
		// |  |  |---------|
		// |  |--| Comment |
		// |     |---------|
		// |     |  |---------|
		// |     |--| Comment |
		// |        |---------|
		// |  |---------|
		// |--| Comment |
		//    |---------|
		// "Dialogue" reply chains are always expanded
		// when the first reply in the chain is expanded.
		initialState: PropTypes.arrayOf(PropTypes.any),
		onStateChange: PropTypes.func,
		onShowReply: PropTypes.func,
		// These two properties are only passed to child comment trees.
		setState: PropTypes.func,
		getState: PropTypes.func
	}

	post = React.createRef()
	toggleShowRepliesButton = React.createRef()

	state = {
		showReplies: (
			this.props.initialState && this.props.initialState.replies
			||
			(this.props.getState && this.props.getState() && this.props.getState().replies)
		) ? true : false
	}

	subtreeState = this.props.initialState || {}

	shouldTrackState() {
		const {
			onStateChange,
			setState
		} = this.props
		return onStateChange || setState ? true : false
	}

	onToggleShowReplies = () => {
		const { onDidToggleShowReplies } = this.props
		let { showReplies } = this.state
		showReplies = !showReplies
		let promise = Promise.resolve()
		// On expand replies — no scroll.
		// On un-expand replies — scroll to the original comment if it's not visible.
		if (!showReplies) {
			if (this.post.current) {
				// const postRect = this.post.current.getNode().getBoundingClientRect()
				const toggleShowRepliesButtonRect = this.toggleShowRepliesButton.current.getBoundingClientRect()
				// if (postRect.top < 0) {
				if (toggleShowRepliesButtonRect.top < 0) {
					// const scrolledDistance = Math.abs(postRect.top)
					const scrolledDistance = Math.abs(toggleShowRepliesButtonRect.top)
					promise = scrollIntoView(this.post.current.getNode(), {
						ease: 'easeInOutSine',
						duration: Math.min(140 + scrolledDistance / 2, 320),
						scrollMode: 'if-needed',
						block: 'nearest'
					})
				}
			}
			promise.then(() => {
				// If the component is still mounted then
				// focus the "Toggle show replies" button.
				if (this.toggleShowRepliesButton.current) {
					this.toggleShowRepliesButton.current.focus()
				}
			})
		}
		promise.then(() => {
			if (this.shouldTrackState()) {
				this.updateStateOnToggleShowReplies(showReplies)
			}
			this.setState({
				showReplies
			}, () => {
				if (onDidToggleShowReplies) {
					onDidToggleShowReplies()
				}
			})
		})
	}

	updateStateOnToggleShowReplies(showReplies) {
		const {
			comment,
			onShowReply
		} = this.props
		let state
		if (showReplies) {
			state = {
				replies: new Array(comment.replies.length)
			}
			if (onShowReply) {
				for (const reply of comment.replies) {
					onShowReply(reply)
				}
			}
			// "Dialogue" reply chains are always expanded
			// when the first reply in the chain is expanded.
			// If this is such auto-expanded dialoglue chain
			// then update `state` in accordance.
			if (comment.replies.length === 1) {
				expandDialogueChainReplies(comment, state, onShowReply)
			}
		} else {
			state = null
		}
		// Using `.updateSubtreeState()` instead of `.setSubtreeState()` here
		// so that the "expanded replies" state doesn't erase other "custom" state
		// like "post is expanded" or "reply form is expanded".
		this.updateSubtreeState(state)
	}

	getSubtreeState = () => {
		const { getState } = this.props
		if (getState) {
			return getState()
		} else {
			return this.subtreeState
		}
	}

	updateSubtreeState = (state) => {
		if (state) {
			this.setSubtreeState({
				...this.getSubtreeState(),
				...state
			})
		} else {
			this.setSubtreeState()
		}
	}

	setSubtreeState(state) {
		const {
			setState,
			getState,
			onStateChange
		} = this.props
		if (setState) {
			setState(state)
		} else {
			this.subtreeState = state
			onStateChange(this.subtreeState)
		}
	}

	setChildSubtreeState(i, childState) {
		const state = this.getSubtreeState()
		state.replies[i] = childState
		this.setSubtreeState(state)
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
			getComponentProps,
			// Rest.
			initialState,
			onStateChange,
			onShowReply,
			setState,
			getState,
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
		const subtreeState = this.shouldTrackState() ? this.getSubtreeState() : undefined
		const componentProps = getComponentProps ? getComponentProps({
			getState: this.getSubtreeState,
			updateState: this.updateSubtreeState
		}) : undefined
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
				{/* The comment. */}
				<Component
					{...rest}
					{...componentProps}
					comment={comment}
					parentComment={parentComment}
					postRef={this.post}
					showingReplies={showReplies}
					onToggleShowReplies={comment.replies ? this.onToggleShowReplies : undefined}
					toggleShowRepliesButtonRef={this.toggleShowRepliesButton}/>
				{/* Reply link marker for a single reply. */}
				{showReplies && _isMiddleDialogueChainLink &&
					<div className="comment-tree__dialogue-chain-marker"/>
				}
				{/* If there's only a single reply then there won't be the actual reply "tree" rendered. */}
				{showReplies && _isMiddleDialogueChainLink &&
					<CommentTree
						{...rest}
						flat
						onShowReply={onShowReply}
						getState={this.shouldTrackState() ? (() => subtreeState.replies[0]) : undefined}
						setState={this.shouldTrackState() ? (state => this.setChildSubtreeState(0, state)) : undefined}
						comment={removeLeadingPostLink(comment.replies[0], comment)}
						parentComment={comment}
						component={Component}
						getComponentProps={getComponentProps}/>
				}
				{/* If there're more than a single reply then show the replies tree. */}
				{showReplies && !_isMiddleDialogueChainLink &&
					<div className={classNames('comment-tree__replies', {
						// If comments don't have any side padding
						// then the root replies branch line would be ineligible
						// because it would be drawn at the very screen edge.
						// This CSS class can be used for styling such special case.
						'comment-tree__replies--root': !parentComment
					})}>
						{/* Comment tree branch which is also a "Show"/"Hide" replies tree toggler. */}
						<button
							type="button"
							tabIndex={-1}
							onClick={this.onBranchToggleClick}
							className="rrui__button-reset comment-tree__branch-toggler"/>
						{/* The replies. */}
						{comment.replies.map((reply, i) => (
							<CommentTree
								{...rest}
								key={reply.id}
								onShowReply={onShowReply}
								getState={this.shouldTrackState() ? (() => subtreeState.replies[i]) : undefined}
								setState={this.shouldTrackState() ? (state => this.setChildSubtreeState(i, state)) : undefined}
								comment={removeLeadingPostLink(reply, comment)}
								parentComment={comment}
								component={Component}
								getComponentProps={getComponentProps}/>
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

function expandDialogueChainReplies(comment, subtreeState, onShowReply) {
	let parentComment = comment
	let parentCommentState = subtreeState
	let reply
	// Keep expanding the reply tree while the reply
	// to the `comment` has itself a single reply too.
	while ((reply = parentComment.replies[0]) &&
		reply.replies && reply.replies.length === 1) {
		const subtreeState = {
			replies: [null]
		}
		parentCommentState.replies[0] = subtreeState
		parentCommentState = subtreeState
		parentComment = reply
		if (onShowReply) {
			onShowReply(reply.replies[0])
		}
	}
}