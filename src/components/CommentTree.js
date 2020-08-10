import React, { useRef, useState, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import removeLeadingPostLink from 'social-components/commonjs/utility/post/removeLeadingPostLink'

import Post from './Post'
import { RepliesCountBadge } from './Post.badges'
import { Button } from './Button'

import { post } from '../PropTypes'
import scrollIntoView from '../utility/scrollIntoView'

import './CommentTree.css'

export default function CommentTree({
	flat,
	comment,
	parentComment,
	isFirstLevelTree,
	component: Component,
	getComponentProps,
	initialState,
	onStateChange,
	onShowReply,
	onDidToggleShowReplies,
	dialogueChainStyle,
	setState,
	getState,
	className,
	...rest
}) {
	const post = useRef()
	const toggleShowRepliesButton = useRef()

	const [shouldShowReplies, setShowReplies] = useState(
		initialState && initialState.replies
		||
		(getState && getState() && getState().replies)
		? true : false
	)

	const subtreeState = useRef(initialState || {})

	const shouldTrackState = useCallback(() => {
		return onStateChange || setState ? true : false
	}, [
		onStateChange,
		setState
	])

	const getSubtreeState = useCallback(() => {
		if (getState) {
			return getState()
		} else {
			return subtreeState.current
		}
	}, [getState])

	const setSubtreeState = useCallback((state) => {
		if (setState) {
			setState(state)
		} else {
			subtreeState.current = state
			if (onStateChange) {
				onStateChange(state)
			}
		}
	}, [
		setState,
		onStateChange
	])

	const updateSubtreeState = useCallback((state) => {
		if (state) {
			setSubtreeState({
				...getSubtreeState(),
				...state
			})
		} else {
			setSubtreeState()
		}
	}, [
		getSubtreeState,
		setSubtreeState
	])

	const setChildSubtreeState = useCallback((i, childState) => {
		const state = getSubtreeState()
		state.replies[i] = childState
		setSubtreeState(state)
	}, [
		getSubtreeState,
		setSubtreeState
	])

	const updateStateOnToggleShowReplies = useCallback((showReplies) => {
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
		if (shouldTrackState()) {
			updateSubtreeState(state)
		}
	}, [
		comment,
		onShowReply,
		shouldTrackState,
		updateSubtreeState
	])

	const onToggleShowReplies = useCallback(() => {
		const showReplies = !shouldShowReplies
		let promise = Promise.resolve()
		// On expand replies — no scroll.
		// On un-expand replies — scroll to the original comment if it's not visible.
		if (!showReplies) {
			if (post.current) {
				// const postRect = post.current.getBoundingClientRect()
				const toggleShowRepliesButtonRect = toggleShowRepliesButton.current.getBoundingClientRect()
				// if (postRect.top < 0) {
				if (toggleShowRepliesButtonRect.top < 0) {
					// const scrolledDistance = Math.abs(postRect.top)
					const scrolledDistance = Math.abs(toggleShowRepliesButtonRect.top)
					promise = scrollIntoView(post.current, {
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
				if (toggleShowRepliesButton.current) {
					toggleShowRepliesButton.current.focus()
				}
			})
		}
		promise.then(() => {
			updateStateOnToggleShowReplies(showReplies)
			setShowReplies(showReplies)
		})
	}, [
		shouldShowReplies,
		setShowReplies,
		updateStateOnToggleShowReplies
	])

	useEffect(() => {
		if (onDidToggleShowReplies) {
			onDidToggleShowReplies()
		}
	}, [shouldShowReplies])

	let showReplies = shouldShowReplies
	// Expand replies without left padding if this is the only reply
	// for the comment and the comment is not a root-level one
	// and it's the only reply for the comment's parent comment.
	const _isMiddleDialogueChainLink = isMiddleDialogueChainLink(comment, parentComment)
	// Automatically expand dialogue comment chains.
	if (_isMiddleDialogueChainLink) {
		showReplies = true
	}
	const _subtreeState = shouldTrackState() ? getSubtreeState() : undefined
	const componentProps = getComponentProps ? getComponentProps({
		getState: getSubtreeState,
		updateState: updateSubtreeState
	}) : undefined
	return (
		<div className={classNames('CommentTree', {
			'CommentTree--nested': parentComment && !flat,
			// If comments don't have any side padding
			// then the root replies branch line would be ineligible
			// because it would be drawn at the very screen edge (mobile devices).
			// This CSS class can be used for styling such special case.
			'CommentTree--first-level': isFirstLevelTree
		})}>
			{parentComment && !flat &&
				<div className="CommentTree-branch"/>
			}
			{parentComment && !flat &&
				<div className="CommentTree-trunk"/>
			}
			{/* The comment. */}
			<Component
				{...rest}
				{...componentProps}
				className={classNames(className, {
					'CommentTree-comment--expanded': showReplies,
					'CommentTree-comment--nested': parentComment
				})}
				comment={comment}
				parentComment={parentComment}
				postRef={post}
				showingReplies={showReplies}
				onToggleShowReplies={comment.replies ? onToggleShowReplies : undefined}
				toggleShowRepliesButtonRef={toggleShowRepliesButton}/>
			{/* Reply link marker for a single reply. */}
			{showReplies && _isMiddleDialogueChainLink &&
				<div className={classNames('CommentTreeDialogueTrace', {
					'CommentTreeDialogueTrace--side': dialogueChainStyle === 'side',
					'CommentTreeDialogueTrace--through': dialogueChainStyle === 'through'
				})}/>
			}
			{/* If there's only a single reply then there won't be (visually) the actual
		      reply "tree" rendered: a "dialogue chain" will be rendered instead. */}
			{showReplies && _isMiddleDialogueChainLink &&
				<CommentTree
					{...rest}
					flat
					onShowReply={onShowReply}
					getState={shouldTrackState() ? (() => _subtreeState.replies[0]) : undefined}
					setState={shouldTrackState() ? (state => setChildSubtreeState(0, state)) : undefined}
					comment={removeLeadingPostLink(comment.replies[0], comment)}
					parentComment={comment}
					component={Component}
					isFirstLevelTree={isFirstLevelTree}
					dialogueChainStyle={dialogueChainStyle}
					getComponentProps={getComponentProps}/>
			}
			{/* If there're more than a single reply then show the replies tree. */}
			{showReplies && !_isMiddleDialogueChainLink &&
				<div className="CommentTree-replies">
					{/* Comment tree branch which is also a "Show"/"Hide" replies tree toggler. */}
					<Button
						tabIndex={-1}
						onClick={onToggleShowReplies}
						className="CommentTree-toggler"/>
					{/* The replies. */}
					{comment.replies.map((reply, i) => (
						<CommentTree
							{...rest}
							key={reply.id}
							onShowReply={onShowReply}
							getState={shouldTrackState() ? (() => _subtreeState.replies[i]) : undefined}
							setState={shouldTrackState() ? (state => setChildSubtreeState(i, state)) : undefined}
							comment={removeLeadingPostLink(reply, comment)}
							parentComment={comment}
							component={Component}
							isFirstLevelTree={!parentComment}
							dialogueChainStyle={dialogueChainStyle}
							getComponentProps={getComponentProps}/>
					))}
				</div>
			}
		</div>
	)
}

CommentTree.propTypes = {
	flat: PropTypes.bool,
	comment: post.isRequired,
	parentComment: post,
	// This flag is only for correctly styling root-level dialogue chains:
	// they require some left padding for eligibility on mobile devices.
	isFirstLevelTree: PropTypes.bool,
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
	getState: PropTypes.func,
	dialogueChainStyle: PropTypes.oneOf(['side', 'through']).isRequired
}

CommentTree.defaultProps = {
	dialogueChainStyle: 'side'
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