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
		link: PropTypes.string,
		filter: PropTypes.func,
		onClickClassName: PropTypes.string,
		className: PropTypes.string
	}

	static defaultProps = {
		panOffsetThreshold: 5
	}

	state = {}

	shouldOpenLink = false

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

	onDragStart = (event) => {
		event.preventDefault()
	}

	onTouchStart = (event) => {
		const { filter } = this.props
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
		if (this.isPanning) {
			this.onPan(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}

	onMouseDown = (event) => {
		const { filter, link } = this.props
		switch (event.button) {
			// Left
			case 0:
				if (link && event.ctrlKey || event.cmdKey) {
					this.shouldOpenLink = true
				}
				break
			// Middle
			case 1:
				if (link) {
					this.shouldOpenLink = true
					break
				}
				return this.onPanCancel()
			// Right
			case 2:
			default:
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

	onMouseUp = () => {
		if (this.isPanning) {
			this.onPanEnd(
				event.clientX,
				event.clientY
			)
		}
	}

	onMouseMove = (event) => {
		if (this.isPanning) {
			this.onPan(
				event.clientX,
				event.clientY
			)
		}
	}

	onMouseLeave = () => {
		this.onPanCancel()
	}

	onClickStart() {
		this.isClickInProgress = true
		this.setState({ isClickInProgress: true })
	}

	onClickStop() {
		this.isClickInProgress = false
		this.setState({ isClickInProgress: false })
	}

	onPanStart(x, y) {
		this.onClickStart()
		this.isPanning = true
		this.panOriginX = x
		this.panOriginY = y
	}

	onPanCancel() {
		if (this.isPanning) {
			this.isPanning = false
		}
		this.shouldOpenLink = false
		this.onClickStop()
	}

	onPan(x, y) {
		if (this.isClickInProgress) {
			if (this.isOverTheThreshold(x, y)) {
				this.onClickStop()
			}
		}
	}

	onPanEnd(x, y) {
		const { onClick, link } = this.props
		this.isPanning = false
		if (this.isClickInProgress) {
			this.onClickStop()
			if (onClick && !this.shouldOpenLink) {
				let defaultPrevented = false
				onClick({
					preventDefault: () => defaultPrevented = true
				})
				if (defaultPrevented) {
					return
				}
			}
			if (link) {
				openLinkInNewTab(link)
			}
		}
		this.shouldOpenLink = false
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
			link,
			filter,
			...rest
		} = this.props

		const {
			isClickInProgress
		} = this.state

		return (
			<div
				{...rest}
				ref={this.container}
				onDragStart={this.onDragStart}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				onTouchCancel={this.onTouchCancel}
				onTouchMove={this.onTouchMove}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onMouseMove={this.onMouseMove}
				onMouseLeave={this.onMouseLeave}
				onClick={this.onClick}
				className={classNames('on-click', className, isClickInProgress && onClickClassName)}>
				{children}
			</div>
		)
	}
}