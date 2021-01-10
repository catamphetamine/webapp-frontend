import React, { useState, useRef, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import openLinkInNewTab from '../utility/openLinkInNewTab'
import { isClickable } from '../utility/dom'

import './Clickable.css'

export default function Clickable({
	panOffsetThreshold,
	filter,
	url,
	onClick,
	onClickClassName,
	className,
	children,
	...rest
}) {
	const [isClickInProgress, setClickInProgress] = useState()
	const _isClickInProgress = useRef()
	const emulateLinkClick = useRef()
	const container = useRef()
	const panOrigin = useRef({})

	const filterElement = useCallback((element) => {
		if (isClickable(element, container.current)) {
			return false
		}
		if (filter && !filter(element)) {
			return false
		}
		return true
	}, [
		filter
	])

	const isOverTheThreshold = useCallback((x, y) => {
		return (
			(Math.abs(x - panOrigin.current.x) > panOffsetThreshold) ||
			(Math.abs(y - panOrigin.current.y) > panOffsetThreshold)
		)
	}, [
		panOffsetThreshold
	])

	const onClickStart = useCallback(() => {
		_isClickInProgress.current = true
		setClickInProgress(true)
	}, [
		setClickInProgress
	])

	const onClickStop = useCallback(() => {
		_isClickInProgress.current = false
		setClickInProgress(false)
		emulateLinkClick.current = undefined
	}, [
		setClickInProgress
	])

	const _onClick = useCallback((event) => {
		if (filterElement(event.target)) {
			event.preventDefault()
		}
	}, [
		filterElement
	])

	const onPanStart = useCallback((x, y) => {
		onClickStart()
		panOrigin.current = { x, y }
	}, [
		onClickStart
	])

	const onPanStop = useCallback(() => {
		onClickStop()
		panOrigin.current = {}
	}, [
		onClickStop
	])

	const onPanCancel = useCallback(() => {
		onPanStop()
	}, [
		onPanStop
	])

	const onPan = useCallback((x, y) => {
		if (_isClickInProgress.current) {
			if (isOverTheThreshold(x, y)) {
				onPanStop()
			}
		}
	}, [
		isOverTheThreshold,
		onPanStop
	])

	const onPanEnd = useCallback((x, y) => {
		if (_isClickInProgress.current) {
			// Simulate `event` argument.
			const event = {
				preventDefault() {
					this.defaultPrevented = true
				},
				stopPropagation() {}
			}
			if (onClick && !emulateLinkClick.current) {
				onClick(event)
			}
			if (url) {
				if (!event.defaultPrevented) {
					openLinkInNewTab(url)
				}
			}
		}
		onPanStop()
	}, [
		url,
		onClick,
		onPanStop
	])

	const onTouchCancel = useCallback(() => {
		onPanCancel()
	}, [
		onPanCancel
	])

	const onTouchStart = useCallback((event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return onTouchCancel()
		}
		if (!filterElement(event.target)) {
			return
		}
		onPanStart(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}, [
		filterElement,
		onTouchCancel,
		onPanStart
	])

	const onTouchEnd = useCallback((event) => {
		onPanEnd(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}, [
		onPanEnd
	])

	const onTouchMove = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPan(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}, [
		onPan
	])

	const onPointerDown = useCallback((event) => {
		switch (event.button) {
			// Left mouse button.
			case 0:
				if (url && (event.ctrlKey || event.cmdKey)) {
					emulateLinkClick.current = true
				}
				break
			// Middle mouse button.
			case 1:
				if (url) {
					// `.preventDefault()` to prevent the web browser
					// from showing the "all-scroll" cursor.
					event.preventDefault()
					emulateLinkClick.current = true
					break
				}
				return onPanCancel()
			// Right mouse button.
			case 2:
			default:
				// Cancel panning when two mouse buttons are clicked simultaneously.
				return onPanCancel()
		}
		if (!filterElement(event.target)) {
			return
		}
		onPanStart(
			event.clientX,
			event.clientY
		)
	}, [
		url,
		onPanStart,
		onPanCancel,
		filterElement
	])

	const onPointerUp = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPanEnd(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onPanEnd
	])

	const onPointerMove = useCallback((event) => {
		if (_isClickInProgress.current) {
			onPan(
				event.clientX,
				event.clientY
			)
		}
	}, [
		onPan
	])

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	const onPointerOut = useCallback(() => {
		onPanCancel()
	}, [
		onPanCancel
	])

	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={onPointerDown}
	// onPointerUp={onPointerUp}
	// onPointerMove={onPointerMove}
	// `PointerOut` event is fired for several reasons including:
	// * Pointer is moved out of the hit test boundaries of an element.
	// * Firing the pointerup event for a device that does not support hover.
	// * After firing the `pointercancel` event.
	// * When a pen stylus leaves the hover range detectable by the digitizer.
	// onPointerOut={onPointerOut}

	return (
		<div
			{...rest}
			ref={container}
			onDragStart={onPointerOut}
			onTouchStart={onTouchStart}
			onTouchEnd={onTouchEnd}
			onTouchCancel={onTouchCancel}
			onTouchMove={onTouchMove}
			onMouseDown={onPointerDown}
			onMouseUp={onPointerUp}
			onMouseMove={onPointerMove}
			onMouseLeave={onPointerOut}
			onClick={_onClick}
			className={classNames(
				'Clickable',
				className,
				isClickInProgress && 'Clickable--active',
				isClickInProgress && onClickClassName
			)}>
			{children}
		</div>
	)
}

Clickable.propTypes = {
	panOffsetThreshold: PropTypes.number.isRequired,
	onClick: PropTypes.func.isRequired,
	url: PropTypes.string,
	filter: PropTypes.func,
	onClickClassName: PropTypes.string,
	className: PropTypes.string
}

Clickable.defaultProps = {
	panOffsetThreshold: 5
}