import React, { useRef, useMemo, useState, useCallback, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import useMount from '../hooks/useMount'

import removeLeadingPostLink from 'social-components/commonjs/utility/post/removeLeadingPostLink'

import { Button } from './Button'

import { post } from '../PropTypes'
import scrollIntoView from '../utility/scrollIntoView'

import './CommentTree.css'

/**
 * Renders a tree of comments.
 * Each comment can have a `.replies[]` list consisting of other comments.
 * When replies of a comment are expanded/un-expanded, the tree's `state` changes.
 * On more details on how `state` is structured, see the comments on `propTypes` below.
 * Basically, `state` simply stores "are children expanded" state of each branch of the tree.
 * By default, the `state` is stored in an "instance variable", and "is expanded" state
 * of each branch is additionally stored as a `boolean` flag in a `useState()` variable,
 * so that the branch is re-rendered on expand/un-expand.
 * The default `state` storage is implemented an instance variable
 * rather than a `useState()` variable, because if `useState()` was used
 * instead of an instance variable, the whole tree would re-render when
 * some (arbitrarily deep) branch was expanded/un-expanded.
 */
export default function CommentTree({
	flat,
	comment,
	parentComment,
	isFirstLevelTree,
	component: Component,
	getComponentProps,
	isStateManagedExternally,
	initialState,
	onStateChange,
	onShowReply,
	onDidToggleShowReplies,
	dialogueChainStyle,
	getState,
	setState,
	className,
	...rest
}) {
	// Set the root-level `isStateManagedExternally` property value.
	// `isStateManagedExternally` is just a leftover of some earlier concept of
	// "managing state outside of this component", but that turned out to have
	// a consequence of re-rendering the whole tree when expanding/un-expanding
	// any arbitrarily-deep reply branch, which is not optimal compared to the
	// "internal" managing of the state, which only re-renders a specific
	// reply branch. So currently, `isStateManagedExternally` is always `false`.
	if (!parentComment) {
		isStateManagedExternally = false
	}

	// `elementRef` is only used to scroll to the parent post
	// when the user hides its replies tree.
	const elementRef = useRef()

	// `toggleShowRepliesButtonRef` is only used to focus the
	// "toggle show/hide replies tree" button when the user
	// clicks the tree branches instead of the toggle button.
	// (the tree branches act as the toggle button on click).
	const toggleShowRepliesButtonRef = useRef()

	// `setState()` is always present on a subtree of a tree.
	// The only case when `setState()` is not present is when
	// it's the root of the tree (not a subtree).

	// If state is not managed externally, then the "expanded"
	// state is stored in this `useState()` variable.
	const [_shouldShowReplies, _setShowReplies] = useState(
		isStateManagedExternally
			? undefined
			: (
				getState
					? (getState().replies ? true : false)
					: (initialState.replies ? true : false)
			)
	)

	const shouldShowReplies = isStateManagedExternally
		? (getState() && getState().replies ? true : false)
		: _shouldShowReplies

	// If state is not managed externally, then it's
	// stored in this "instance variable".
	const _state = useRef(initialState)
	const _getTreeState = useCallback(() => _state.current, [])

	// Gets the state of the current branch of the tree.
	const getSubtreeState = setState ? getState : _getTreeState

	// Sets the state of the current branch of the tree.
	const setSubtreeState = useCallback((newState) => {
		if (setState) {
			setState(newState)
		} else {
			_state.current = newState
			if (onStateChange) {
				onStateChange(newState)
			}
		}
	}, [
		setState,
		onStateChange
	])

	const getChildSubtreeState = useCallback((i) => {
		return getSubtreeState().replies[i]
	}, [getSubtreeState])

	// Sets the state of a child branch of the current branch of the tree.
	const setChildSubtreeState = useCallback((i, childState) => {
		const replies = getSubtreeState().replies.slice()
		replies[i] = childState
		setSubtreeState({
			...getSubtreeState(),
			replies
		})
	}, [
		getSubtreeState,
		setSubtreeState
	])

	// This thing caches `getSubtreeState()` functions
	// for each branch of the current branch of the tree.
	// `ref`s are used to always have the reference to the
	// latest `getState()` property.
	const getSubtreeStateFunctions = useRef([])
	const getChildSubtreeStateRef = useRef()
	getChildSubtreeStateRef.current = getChildSubtreeState
	const getGetSubtreeStateFunction = useCallback((i) => {
		if (!getSubtreeStateFunctions.current[i]) {
			// `getSubtreeStateFunctions.current[i]` is created only once, so
			// `getChildSubtreeState()` shouldn't change in order for this to work,
			// that's why `getChildSubtreeStateRef.current` is used here instead of
			// `getChildSubtreeState()`.
			getSubtreeStateFunctions.current[i] = () => {
				return getChildSubtreeStateRef.current(i)
			}
		}
		return getSubtreeStateFunctions.current[i]
	}, [])

	// This thing caches `setSubtreeState()` functions
	// for each branch of the current branch of the tree.
	// `ref`s are used to always have the reference to the
	// latest `getState()` property.
	const setSubtreeStateFunctions = useRef([])
	const setChildSubtreeStateRef = useRef()
	setChildSubtreeStateRef.current = setChildSubtreeState
	const getSetSubtreeStateFunction = useCallback((i) => {
		if (!setSubtreeStateFunctions.current[i]) {
			// `setSubtreeStateFunctions.current[i]` is created only once, so
			// `setChildSubtreeState()` shouldn't change in order for this to work,
			// that's why `setChildSubtreeStateRef.current` is used here instead of
			// `setChildSubtreeState()`.
			setSubtreeStateFunctions.current[i] = (state) => {
				setChildSubtreeStateRef.current(i, state)
			}
		}
		return setSubtreeStateFunctions.current[i]
	}, [])

	const onShowRepliesChange = useCallback((showReplies) => {
		// The "expanded" state of replies is derived from the `state` as:
		// "if state is `{}`, then replies are not expanded;
		//  otherwise, replies are expanded".
		const state = {}
		if (showReplies) {
			// Not using `.fill({})` here, because it would
			// place the same object reference in all items,
			// which would later lead to item states messing up each other.
			// https://stackoverflow.com/a/28507704/970769
			const replies = new Array(comment.replies.length)
			let i = 0
			while (i < replies.length) {
				replies[i] = {}
				i++
			}
			state.replies = replies
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
		}
		// The "expanded replies" state is merged with the current comment state
		// rather than replacing it, so that it doesn't discard other possible
		// "custom" state like "show full comment" or "show inline reply form".
		const newState = { ...getSubtreeState() }
		if (state.replies) {
			newState.replies = state.replies
		} else {
			delete newState.replies
		}
		setSubtreeState(newState)
		if (!isStateManagedExternally) {
			_setShowReplies(state.replies ? true : false)
		}
	}, [
		comment,
		onShowReply,
		getSubtreeState,
		setSubtreeState,
		setState,
		_setShowReplies
	])

	const onToggleShowReplies = useCallback(() => {
		const showReplies = !shouldShowReplies
		let promise = Promise.resolve()
		// On expand replies — no scroll.
		// On un-expand replies — scroll to the original comment if it's not visible.
		if (!showReplies) {
			if (elementRef.current) {
				// const postRect = elementRef.current.getBoundingClientRect()
				const toggleShowRepliesButtonRect = toggleShowRepliesButtonRef.current.getBoundingClientRect()
				// if (postRect.top < 0) {
				if (toggleShowRepliesButtonRect.top < 0) {
					// const scrolledDistance = Math.abs(postRect.top)
					const scrolledDistance = Math.abs(toggleShowRepliesButtonRect.top)
					promise = scrollIntoView(elementRef.current, {
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
				if (toggleShowRepliesButtonRef.current) {
					toggleShowRepliesButtonRef.current.focus()
				}
			})
		}
		promise.then(() => {
			onShowRepliesChange(showReplies)
		})
	}, [
		shouldShowReplies,
		onShowRepliesChange
	])

	const [isMounted, onMount] = useMount()

	// `onDidToggleShowReplies()` calls `onRenderedContentDidChange()`
	// that instructs `virtual-scroller` to re-measure the item's height.
	// Therefore, it should happen immedately after a re-render,
	// hence the use of `useLayoutEffect()` instead of `useEffect()`.
	useLayoutEffect(() => {
		// Skip the initial render.
		if (isMounted()) {
			if (onDidToggleShowReplies) {
				onDidToggleShowReplies()
			}
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
	const componentProps = getComponentProps ? getComponentProps({
		initialState: getSubtreeState(),
		setState: (getNewState) => setSubtreeState(getNewState(getSubtreeState()))
	}) : undefined
	const repliesWithRemovedLeadingPostLink = useMemo(() => {
		return comment.replies && comment.replies.map((reply) => {
			return removeLeadingPostLink(reply, comment.id)
		})
	}, [
		comment.id,
		comment.replies
	])
	function getChildCommentTreeProps(i) {
		return {
			...rest,
			isStateManagedExternally,
			getState: getGetSubtreeStateFunction(i),
			setState: getSetSubtreeStateFunction(i),
			comment: repliesWithRemovedLeadingPostLink[i],
			parentComment: comment,
			component: Component,
			dialogueChainStyle,
			getComponentProps,
			onShowReply,
			onDidToggleShowReplies
		}
	}
	onMount()
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
				elementRef={elementRef}
				showingReplies={showReplies}
				onToggleShowReplies={comment.replies ? onToggleShowReplies : undefined}
				toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}/>
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
					{...getChildCommentTreeProps(0)}
					flat
					isFirstLevelTree={isFirstLevelTree}/>
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
							{...getChildCommentTreeProps(i)}
							key={reply.id}
							isFirstLevelTree={!parentComment}/>
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
	// For a comment, `state` is an object.
	// If a comment's replies are expanded, it's `state.replies[]` property
	// is an array having the same count of elements as the replies count for the comment.
	// `state.replies === undefined` means "the comment's replies are not expanded".
	//  (or it could mean that there're no replies to this comment).
	//
	// Example:
	//
	// State:
	// {
	// 	replies: [
	// 		{},
	// 		{},
	// 		{
	// 			replies: [
	// 				{},
	// 				{
	// 					replies: [
	// 						{}
	// 					]
	// 				}
	// 			]
	// 		},
	// 		{}
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
	initialState: PropTypes.object.isRequired,
	onStateChange: PropTypes.func,
	onShowReply: PropTypes.func,
	// `isStateManagedExternally` is just a leftover of some earlier concept of
	// "managing state outside of this component", but that turned out to have
	// a consequence of re-rendering the whole tree when expanding/un-expanding
	// any arbitrarily-deep reply branch, which is not optimal compared to the
	// "internal" managing of the state, which only re-renders a specific
	// reply branch. So currently, `isStateManagedExternally` is always `false`.
	isStateManagedExternally: PropTypes.bool,
	// `getState()`/`setState()` properties are only passed to child comment trees.
	setState: PropTypes.func,
	getState: PropTypes.func,
	dialogueChainStyle: PropTypes.oneOf(['side', 'through']).isRequired
}

CommentTree.defaultProps = {
	initialState: {},
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
			replies: [{}]
		}
		parentCommentState.replies[0] = subtreeState
		parentCommentState = subtreeState
		parentComment = reply
		if (onShowReply) {
			onShowReply(reply.replies[0])
		}
	}
}