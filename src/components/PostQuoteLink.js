import React, { useCallback, useState, useLayoutEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import { postPostLinkShape } from '../PropTypes'

import PostQuoteBlock from './PostQuoteBlock'
import PostQuoteLinkMinimized from './PostQuoteLinkMinimized'

import useMount from '../hooks/useMount'

import './PostQuoteLink.css'

export default function PostQuoteLink({
	url,
	postLink,
	onClick,
	disabled,
	block,
	first,
	minimized,
	minimizedComponent,
	expandTimeout,
	isExpanded,
	onExpand,
	onDidExpand,
	className,
	children
}) {
	const [isMounted, onMount] = useMount()
	const [expanded, setExpanded] = useState(
		getInitiallyExpanded(postLink, minimized, isExpanded)
	)
	// `onDidExpand()` calls `onRenderedContentDidChange()`
	// that instructs `virtual-scroller` to re-measure the item's height.
	// Therefore, it should happen immedately after a re-render,
	// hence the use of `useLayoutEffect()` instead of `useEffect()`.
	useLayoutEffect(() => {
		// Ignore the initial render.
		if (isMounted()) {
			if (expanded) {
				if (onDidExpand) {
					onDidExpand()
				}
			}
		}
	}, [expanded])
	const _onExpand = useCallback(() => {
		if (onExpand) {
			onExpand(postLink)
		}
		setExpanded(true)
	}, [
		postLink,
		onExpand,
		setExpanded
	])
	const _onClick = useCallback((event) => {
		onClick(event, postLink)
	}, [
		onClick,
		postLink
	])
	className = classNames(className, 'PostQuoteLink', {
		'PostQuoteLink--disabled': disabled,
		'PostQuoteLink--block': block,
		'PostQuoteLink--minimized': !expanded,
		'PostQuoteLink--first': first,
		// 'PostQuoteLink--inline': !block
	})
	onMount()
	if (!expanded) {
		return (
			<PostQuoteLinkMinimized
				postLink={postLink}
				onExpand={_onExpand}
				expandTimeout={expandTimeout}
				minimizedComponent={minimizedComponent}
				className={className}/>
		)
	}
	if (disabled) {
		return (
			<span className={className}>
				{children}
			</span>
		)
	}
	if (url[0] === '/') {
		return (
			<Link
				to={url}
				onClick={onClick && _onClick}
				className={className}>
				{children}
			</Link>
		)
	}
	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
			href={url}
			onClick={onClick && _onClick}
			className={className}>
			{children}
		</a>
	)
}

PostQuoteLink.propTypes = {
	url: PropTypes.string,
	onClick: PropTypes.func,
	disabled: PropTypes.bool,
	postLink: postPostLinkShape.isRequired,
	// `block: true` emulates block appearance while staying inline.
	block: PropTypes.bool,
	first: PropTypes.bool,
	minimized: PropTypes.bool,
	minimizedComponent: PropTypes.elementType,
	isExpanded: PropTypes.func,
	onExpand: PropTypes.func,
	onDidExpand: PropTypes.func,
	expandTimeout: PropTypes.number,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

function getInitiallyExpanded(postLink, minimized, isExpanded) {
	if (!minimized) {
		return true
	}
	if (isExpanded) {
		// `postLink._id`s are set in `enumeratePostLinks()`
		// in `captchan/src/api/utility/addCommentProps.js`.
		// They're used instead of simply `postLink.postId`
		// because, for example, a comment could have several
		// `post-link`s to the same post, consequtive or
		// in different parts of its content.
		if (isExpanded(postLink._id)) {
			return true
		}
	}
	return false
}