import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import openLinkInNewTab from '../utility/openLinkInNewTab'
import { isClickable } from '../utility/dom'

import './OnClick.css'

export default class OnClick extends React.Component {
	static propTypes = {
		panOffsetThreshold: PropTypes.number.isRequired,
		onClick: PropTypes.func.isRequired,
		url: PropTypes.string,
		filter: PropTypes.func,
		onClickClassName: PropTypes.string,
		className: PropTypes.string
	}

	static defaultProps = {
		panOffsetThreshold: 5
	}

	state = {}

	container = React.createRef()

	filter(element) {
		const { filter } = this.props
		if (isClickable(element, this.container.current)) {
			return false
		}
		if (filter && !filter(element)) {
			return false
		}
		return true
	}

	onTouchStart = (event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return this.onTouchCancel()
		}
		if (!this.filter(event.target)) {
			return
		}
		this.onPanStart(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}

	onTouchEnd = (event) => {
		this.onPanEnd(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
	}

	onTouchCancel = () => {
		this.onPanCancel()
	}

	onTouchMove = (event) => {
		if (this.isClickInProgress) {
			this.onPan(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}

	onPointerDown = (event) => {
		const { url } = this.props
		switch (event.button) {
			// Left mouse button.
			case 0:
				if (url && (event.ctrlKey || event.cmdKey)) {
					this.emulateLinkClick = true
				}
				break
			// Middle mouse button.
			case 1:
				if (url) {
					// `.preventDefault()` to prevent the web browser
					// from showing the "all-scroll" cursor.
					event.preventDefault()
					this.emulateLinkClick = true
					break
				}
				return this.onPanCancel()
			// Right mouse button.
			case 2:
			default:
				// Cancel panning when two mouse buttons are clicked simultaneously.
				return this.onPanCancel()
		}
		if (!this.filter(event.target)) {
			return
		}
		this.onPanStart(
			event.clientX,
			event.clientY
		)
	}

	onPointerUp = (event) => {
		if (this.isClickInProgress) {
			this.onPanEnd(
				event.clientX,
				event.clientY
			)
		}
	}

	onPointerMove = (event) => {
		if (this.isClickInProgress) {
			this.onPan(
				event.clientX,
				event.clientY
			)
		}
	}

	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/pointerout_event
	// The pointerout event is fired for several reasons including:
	// * pointing device is moved out of the hit test boundaries of an element (`pointerleave`);
	// * firing the pointerup event for a device that does not support hover (see `pointerup`);
	// * after firing the pointercancel event (see `pointercancel`);
	// * when a pen stylus leaves the hover range detectable by the digitizer.
	onPointerOut = () => {
		this.onPanCancel()
	}

	onClickStart() {
		this.isClickInProgress = true
		this.setState({ isClickInProgress: true })
	}

	onClickStop() {
		this.isClickInProgress = false
		this.setState({ isClickInProgress: false })
		this.emulateLinkClick = undefined
	}

	onPanStart(x, y) {
		this.onClickStart()
		this.panOriginX = x
		this.panOriginY = y
	}

	onPanStop() {
		this.onClickStop()
		this.panOriginX = undefined
		this.panOriginY = undefined
	}

	onPanCancel() {
		this.onPanStop()
	}

	onPan(x, y) {
		if (this.isClickInProgress) {
			if (this.isOverTheThreshold(x, y)) {
				this.onPanStop()
			}
		}
	}

	onPanEnd(x, y) {
		const { onClick, url } = this.props
		if (this.isClickInProgress) {
			// Simulate `event` argument.
			const event = {
				preventDefault() {
					this.defaultPrevented = true
				},
				stopPropagation() {}
			}
			if (onClick && !this.emulateLinkClick) {
				onClick(event)
			}
			if (url) {
				if (!event.defaultPrevented) {
					openLinkInNewTab(url)
				}
			}
		}
		this.onPanStop()
	}

	isOverTheThreshold(x, y) {
		const { panOffsetThreshold } = this.props
		return (
			(Math.abs(x - this.panOriginX) > panOffsetThreshold) ||
			(Math.abs(y - this.panOriginY) > panOffsetThreshold)
		)
	}

	onClick = (event) => {
		const { filter } = this.props
		if (this.filter(event.target)) {
			event.preventDefault()
		}
	}

	render() {
		const {
			onClickClassName,
			className,
			children,
			// rest
			panOffsetThreshold,
			onClick,
			url,
			filter,
			...rest
		} = this.props

		const {
			isClickInProgress
		} = this.state

		// Safari doesn't support pointer events.
		// https://caniuse.com/#feat=pointer
		// https://webkit.org/status/#?search=pointer%20events
		// onPointerDown={this.onPointerDown}
		// onPointerUp={this.onPointerUp}
		// onPointerMove={this.onPointerMove}
		// onPointerOut={this.onPointerOut}

		return (
			<div
				{...rest}
				ref={this.container}
				onDragStart={this.onPointerOut}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				onTouchCancel={this.onTouchCancel}
				onTouchMove={this.onTouchMove}
				onMouseDown={this.onPointerDown}
				onMouseUp={this.onPointerUp}
				onMouseMove={this.onPointerMove}
				onMouseLeave={this.onPointerOut}
				onClick={this.onClick}
				className={classNames('on-click', className, isClickInProgress && onClickClassName)}>
				{children}
			</div>
		)
	}
}