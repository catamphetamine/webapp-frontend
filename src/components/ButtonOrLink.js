import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { Link } from 'react-website'

import openLinkInNewTab from '../utility/openLinkInNewTab'

export default class ButtonOrLink extends React.Component {
	node = React.createRef()

	focus = () => this.node.current.focus()

	onDragStart = (event) => {
		// Prevent dragging.
		event.preventDefault()
		this.onPointerOut()
	}

	onClick = (event) => {
		// `onClick` is only for the left mouse button click.
		if (event.ctrlKey || event.cmdKey) {
			return this.openLinkInNewTab()
		}
		const { onClick } = this.props
		onClick(event)
	}

	onPointerDown = (event) => {
		switch (event.button) {
			// Middle mouse button.
			case 1:
				// `.preventDefault()` to prevent the web browser
				// from showing the "all-scroll" cursor.
				event.preventDefault()
				this.onPanStart(
					event.clientX,
					event.clientY
				)
				break
		}
	}

	onPointerUp = (event) => {
		switch (event.button) {
			// Middle mouse button.
			case 1:
				if (this.isClickInProgress) {
					this.onPanEnd(
						event.clientX,
						event.clientY
					)
				}
				break
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
	}

	onClickStop() {
		this.isClickInProgress = false
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
		const { onClick, link } = this.props
		if (this.isClickInProgress) {
			this.openLinkInNewTab()
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

	// Click the link on Spacebar.
	// onKeyDown = (event) => {
	// 	switch (event.keyCode) {
	// 		// Click the link on Spacebar.
	// 		case 32:
	// 			event.preventDefault()
	// 			return this.onClick({
	// 				// Simulate `event` argument.
	// 				preventDefault() {
	// 					this.defaultPrevented = true
	// 				},
	// 				stopPropagation() {}
	// 			})
	// 	}
	// }

	openLinkInNewTab() {
		const { url } = this.props
		openLinkInNewTab(url)
	}

	render() {
		const {
			url,
			children,
			// Rest.
			onClick,
			panOffsetThreshold,
			...rest
		} = this.props
		if (onClick) {
			// Safari doesn't support pointer events.
			// https://caniuse.com/#feat=pointer
			// https://webkit.org/status/#?search=pointer%20events
			// onPointerDown={this.onPointerDown}
			// onPointerUp={this.onPointerUp}
			// onPointerMove={this.onPointerMove}
			// onPointerOut={this.onPointerOut}
			return (
				<button
					{...rest}
					ref={this.node}
					type="button"
					onDragStart={this.onDragStart}
					onClick={this.onClick}
					onMouseDown={this.onPointerDown}
					onMouseUp={this.onPointerUp}
					onMouseMove={this.onPointerMove}
					onMouseLeave={this.onPointerOut}
					className={classNames(rest.className, 'rrui__button-reset')}>
					{children}
				</button>
			)
		}
		if (url[0] === '/') {
			return (
				<Link
					{...rest}
					ref={this.node}
					to={url}>
					{children}
				</Link>
			)
		}
		return (
			<a
				{...rest}
				ref={this.node}
				target={url[0] === '#' ? undefined : '_blank'}
				href={url}>
				{/* attachment && attachment.type === 'video' &&  attachment.video.provider === 'YouTube' && */}
				{children}
			</a>
		)
	}
}

ButtonOrLink.propTypes = {
	onClick: PropTypes.func.isRequired,
	url: PropTypes.string.isRequired,
	panOffsetThreshold: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
}

ButtonOrLink.defaultProps = {
	panOffsetThreshold: 5
}