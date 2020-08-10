import React, { useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'

import { postPostLinkShape } from '../PropTypes'

export default function PostQuoteLinkMinimized({
	postLink,
	onExpand,
	minimizedComponent: MinimizedComponent,
	expandTimeout,
	...rest
}) {
	const mouseEntered = useRef()
	const mouseMoved = useRef()
	const expandTimer = useRef()
	const onMinimizedQuoteMouseEnter = useCallback(() => {
		mouseEntered.current = true
		if (mouseMoved.current) {
			if (!expandTimer.current) {
				expandTimer.current = setTimeout(() => {
					expandTimer.current = undefined
					onExpand()
				}, expandTimeout)
			}
		}
	}, [mouseEntered, mouseMoved, expandTimer, onExpand, expandTimeout])
	const onMinimizedQuoteMouseLeave = useCallback(() => {
		mouseEntered.current = false
		if (expandTimer.current) {
			clearTimeout(expandTimer.current)
			expandTimer.current = undefined
		}
	}, [mouseEntered, expandTimer])
	const onScroll = useCallback(() => {
		mouseMoved.current = false
	}, [mouseMoved])
	const onMouseMove = useCallback(() => {
		if (!mouseMoved.current) {
			mouseMoved.current = true
			if (mouseEntered.current) {
				onMinimizedQuoteMouseEnter()
			}
		}
	}, [mouseMoved, mouseEntered, onMinimizedQuoteMouseEnter])
	useEffect(() => {
		document.addEventListener('mousemove', onMouseMove)
		document.addEventListener('scroll', onScroll)
		return () => {
			document.removeEventListener('mousemove', onMouseMove)
			document.removeEventListener('scroll', onScroll)
		}
	}, [])
	return (
		<span
			{...rest}
			onClick={onExpand}
			onMouseEnter={onMinimizedQuoteMouseEnter}
			onMouseLeave={onMinimizedQuoteMouseLeave}>
			<MinimizedComponent postLink={postLink}/>
		</span>
	)
}

PostQuoteLinkMinimized.propTypes = {
	postLink: postPostLinkShape.isRequired,
	onExpand: PropTypes.func.isRequired,
	minimizedComponent: PropTypes.elementType.isRequired,
	expandTimeout: PropTypes.number.isRequired
}

PostQuoteLinkMinimized.defaultProps = {
	minimizedComponent: MinimizedQuoteComponent,
	expandTimeout: 400
}

function MinimizedQuoteComponent({ postLink }) {
	return '··············'
	// return `>>${postLink.postId}${postLink.threadId === postLink.postId ? ' (OP)' : ''}`
}

MinimizedQuoteComponent.propTypes = {
	postLink: postPostLinkShape.isRequired
}