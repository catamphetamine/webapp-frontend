import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'

import Picture from './Picture'
import { pictureShape } from '../PropTypes'

import Close from '../../assets/images/icons/close.svg'
import LeftArrow from '../../assets/images/icons/left-arrow-minimal.svg'
import RightArrow from '../../assets/images/icons/right-arrow-minimal.svg'

import './Slideshow.css'

export default function SlideshowWrapper(props) {
	if (props.isOpen) {
		return <Slideshow {...props}/>
	}
	return null
}

class Slideshow extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
		i: PropTypes.number.isRequired,
		inline: PropTypes.bool.isRequired,
		fullScreen: PropTypes.bool.isRequired,
		previousNextClickRatio: PropTypes.number.isRequired,
		closeOnOverlayClick: PropTypes.bool.isRequired,
		panOffsetThresholdWidthRatio: PropTypes.number.isRequired,
		slideInDuration: PropTypes.number.isRequired,
		minSlideInDuration: PropTypes.number.isRequired,
		children: PropTypes.arrayOf(pictureShape) // .isRequired
	}

	static defaultProps = {
		i: 0,
		inline: false,
		fullScreen: true,
		previousNextClickRatio: 0.33,
		closeOnOverlayClick: true,
		panOffsetThresholdWidthRatio: 0.05,
		slideInDurationBaseWidth: 1980,
		slideInDuration: 500,
		minSlideInDuration: 150
	}

	state = {}

	container = React.createRef()
	slides = React.createRef()
	slide = React.createRef()

	panOffset = 0
	transitionDuration = 0

	constructor(props)
	{
		super(props)

		const { i, children: pictures } = this.props

		this.state.i = i
		this.state.picturesShown = new Array(pictures.length)

		this.markPicturesShown(i)
	}

	componentDidMount() {
		const { fullScreen } = this.props
		if (document.activeElement) {
			this.returnFocusTo = document.activeElement
		}
		this.container.current.focus()
		if (fullScreen) {
			requestFullScreen(this.container.current)
			this.unlistenFullScreen = onFullScreenChange(this.onFullScreenChange)
		}
		window.addEventListener('resize', this.onWindowResize)
		// `this.slides.current` is now available for `this.getSlideshowWidth()`.
		this.forceUpdate()
	}

	componentWillUnmount() {
		const { fullScreen } = this.props
		if (fullScreen) {
			exitFullScreen()
			this.unlistenFullScreen()
		}
		if (this.returnFocusTo) {
			this.returnFocusTo.focus()
		}
		clearTimeout(this.transitionEndTimer)
		window.removeEventListener('resize', this.onWindowResize)
	}

	onWindowResize = throttle((event) => this.onResize(), 100)

	onResize = () => {
		this.forceUpdate()
	}

	onFullScreenChange = () => {
		const { i } = this.state
		this.showPicture(i)
	}

	markPicturesShown(i) {
		const { children: pictures } = this.props
		const { picturesShown } = this.state

		let j = 0
		while (j < pictures.length) {
			// Also prefetch previous and next images for mobile scrolling.
			picturesShown[j] = j === i - 1 || j === i || j === i + 1
			// picturesShown[j] = j === i
			j++
		}
	}

	showPicture(i) {
		this.markPicturesShown(i)
		this.setState({ i })
	}

	getSlideshowWidth = () => this.slides.current.clientWidth
	getSlideshowHeight = () => this.slides.current.clientHeight

	// For `<img/>` centered horizontally inside an `<li/>`.
	// getSlideWidth = () => this.slide.current.getWidth()

	// // For `<img/>` with `object-fit: contain`.
	// getSlideWidth = () => {
	// 	return Math.min(
	// 		this.getSlideshowHeight() * this.slide.current.getAspectRatio(),
	// 		this.getSlideshowWidth()
	// 	)
	// }

	// For `<img/>` with `object-fit: scale-down`.
	getSlideWidth = () => {
		return Math.min(
			this.getSlideshowHeight() * this.slide.current.getAspectRatio(),
			this.getSlideshowWidth(),
			this.slide.current.getPreferredWidth()
		)
	}

	getSlideHeight() {
		return this.getSlideWidth() / this.slide.current.getAspectRatio()
	}

	onBackgroundClick = (event) => {
		const { closeOnOverlayClick } = this.props
		if (!event.defaultPrevented && closeOnOverlayClick) {
			this.close()
		}
	}

	onSlideClick = (event) => {
		const {
			previousNextClickRatio,
			closeOnOverlayClick,
			children: pictures
		} = this.props

		const { i } = this.state

		// Make background clicks fall through.
		if (event.target !== this.slide.current.picture.current) {
			return
		}

		this.finishTransition()

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth()
		const deltaHeight = this.getSlideshowHeight() - this.getSlideHeight()

		const clickPositionX = (event.clientX - deltaWidth / 2) / this.getSlideWidth()
		const clickPositionY = (event.clientY - deltaHeight / 2) / this.getSlideHeight()

		// If clicked outside the image then fall through.
		if (closeOnOverlayClick &&
			(
				(clickPositionX < 0 || clickPositionX > 1)
				||
				(clickPositionY < 0 || clickPositionY > 1)
			)
		) {
			return
		}

		event.preventDefault()

		if (clickPositionX < previousNextClickRatio) {
			this.showPrevious()
		} else {
			this.showNext()
		}
	}

	close = () => {
		const { onClose } = this.props
		onClose()
	}

	showPrevious() {
		const { i } = this.state
		if (this.isFirst()) {
			this.close()
		} else {
			this.showPicture(i - 1)
		}
	}

	showNext() {
		const { i } = this.state
		if (this.isLast()) {
			this.close()
		} else {
			this.showPicture(i + 1)
		}
	}

	isFirst() {
		const { i } = this.state
		return i === 0
	}

	isLast() {
		const { children: pictures } = this.props
		const { i } = this.state
		return i === pictures.length - 1
	}

	onShowPrevious = (event) => {
		this.container.current.focus()
		this.showPrevious()
	}

	onShowNext = (event) => {
		this.container.current.focus()
		this.showNext()
	}

	onKeyDown = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// "Left Arrow".
			// Show previous picture.
			case 37:
				event.preventDefault()
				this.finishTransition()
				this.showPrevious()
				return

			// "Right Arrow".
			// Show next picture.
			case 39:
				event.preventDefault()
				this.finishTransition()
				this.showNext()
				return

			// "Escape".
			// Close.
			case 27:
				event.preventDefault()
				this.close()
				return
		}
	}

	onDragStart = (event) => {
		event.preventDefault()
	}

	onTouchStart = (event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return this.onTouchCancel()
		}
		if (isAButton(event.target)) {
			return
		}
		this.onPanStart(event.changedTouches[0].clientX)
	}

	onTouchEnd = (event) => {
		this.onTouchCancel()
	}

	onTouchCancel = () => {
		if (this.isPanning) {
			this.onPanEnd()
		}
	}

	onTouchMove = (event) => {
		if (this.isPanning) {
			this.onPan(event.changedTouches[0].clientX)
		}
	}

	onMouseDown = (event) => {
		if (isAButton(event.target)) {
			return
		}
		this.onPanStart(event.clientX)
	}

	onMouseUp = () => {
		if (this.isPanning) {
			this.onPanEnd()
		}
	}

	onMouseMove = (event) => {
		if (this.isPanning) {
			this.onPan(event.clientX)
		}
	}

	onMouseLeave = () => {
		if (this.isPanning) {
			this.onPanEnd()
		}
	}

	onPanStart(startingPosition) {
		this.finishTransition()
		this.isPanning = true
		this.panOrigin = startingPosition
		// `this.panOffset = 0` will do. No need for complicating things.
		// this.panOffset = getTranslateX(this.slides.current) - this.state.i * this.getSlideshowWidth()
		this.container.current.classList.add('slideshow--panning')
		// This is for `this.emulatePanResistance()`
		// so that it doesn't call DOM on each mousemove/touchmove.
		this.slideshowWidth = this.getSlideshowWidth()
	}

	onPanEnd() {
		const {
			panOffsetThresholdWidthRatio,
			slideInDuration,
			minSlideInDuration,
			slideInDurationBaseWidth
		} = this.props

		const pannedWidthRatio = this.panOffset / this.getSlideshowWidth()
		if (pannedWidthRatio < -1 * panOffsetThresholdWidthRatio) {
			this.showNext()
		} else if (pannedWidthRatio > panOffsetThresholdWidthRatio) {
			this.showPrevious()
		}
		if (this.panOffset !== 0) {
			this.transitionDuration = minSlideInDuration + Math.abs(pannedWidthRatio) * (slideInDuration - minSlideInDuration) * (this.getSlideshowWidth() / slideInDurationBaseWidth)
			this.updateSlideTransitionDuration()
			this.panOffset = 0
			this.updateSlidePosition()
			this.transitionOngoing = true
			this.transitionEndTimer = setTimeout(this.onTransitionEnd, this.transitionDuration)
		}
		this.container.current.classList.remove('slideshow--panning')
		this.isPanning = false
	}

	onPan(position) {
		this.panOffset = position - this.panOrigin
		// Emulate pan resistance when there are
		// no more pictures to navigate to.
		if ((this.isFirst() && this.panOffset > 0) ||
			(this.isLast() && this.panOffset < 0)) {
			this.panOffset = this.emulatePanResistance(this.panOffset)
		}
		this.updateSlidePosition()
	}

	finishTransition() {
		if (this.transitionOngoing) {
			// this.panOffset = current transitionX
			this.onTransitionEnd()
			clearTimeout(this.transitionEndTimer)
		}
	}

	onTransitionEnd = () => {
		this.transitionDuration = 0
		this.updateSlideTransitionDuration()
		this.transitionOngoing = false
	}

	updateSlideTransitionDuration() {
		this.slides.current.style.transitionDuration = `${this.transitionDuration}ms`
	}

	updateSlidePosition() {
		this.slides.current.style.transform = this.getTransform()
	}

	getTransform() {
		const { i } = this.state
		return `translateX(${-1 * (this.getSlideshowWidth() * i - this.panOffset)}px)`
	}

	emulatePanResistance(panOffset) {
		return panOffset * Math.exp(-1 - (panOffset / this.slideshowWidth) / 2)
	}

	render() {
		const { isOpen, inline, children: pictures } = this.props
		const { i, picturesShown } = this.state

		if (!isOpen) {
			return null
		}

		// `tabIndex={ -1 }` makes the `<div/>` focusable.

		return (
			<div
				ref={this.container}
				tabIndex={-1}
				className={classNames('slideshow', {
					'slideshow--fullscreen': !inline
					// 'slideshow--panning': this.isPanning
				})}
				onKeyDown={this.onKeyDown}
				onDragStart={this.onDragStart}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				onTouchCancel={this.onTouchCancel}
				onTouchMove={this.onTouchMove}
				onMouseDown={this.onMouseDown}
				onMouseUp={this.onMouseUp}
				onMouseMove={this.onMouseMove}
				onMouseLeave={this.onMouseLeave}>
				<ul
					ref={this.slides}
					style={{
						transitionDuration: this.transitionDuration,
						transform: this.slides.current ? this.getTransform() : undefined,
						opacity: this.slides.current ? 1 : 0
					}}
					className="slideshow__slides">
					{pictures.map((picture, j) => (
						<li
							key={j}
							className="slideshow__slide"
							onClick={this.onBackgroundClick}>
							{picturesShown[j] &&
								<Picture
									ref={j === i ? this.slide : undefined}
									sizes={picture.sizes}
									type={picture.type}
									onClick={this.onSlideClick}
									fit="scale-down"
									showLoadingPlaceholder
									className="slideshow__picture"/>
							}
						</li>
					))}
				</ul>

				<ul className="slideshow__actions">
					{!inline &&
						<li>
							<button
								type="button"
								onClick={this.close}
								className="rrui__button-reset slideshow__action">
								<Close className="slideshow__action-icon"/>
							</button>
						</li>
					}
				</ul>

				{pictures.length > 1 && i > 0 &&
					<button
						type="button"
						onClick={this.onShowPrevious}
						className="rrui__button-reset slideshow__action slideshow__previous">
						<LeftArrow className="slideshow__action-icon"/>
					</button>
				}

				{pictures.length > 1 && i < pictures.length - 1 &&
					<button
						type="button"
						onClick={this.onShowNext}
						className="rrui__button-reset slideshow__action slideshow__next">
						<RightArrow className="slideshow__action-icon"/>
					</button>
				}
			</div>
		);
	}
}

SlideshowWrapper.propTypes = Slideshow.propTypes
SlideshowWrapper.defaultProps = Slideshow.defaultProps

function requestFullScreen(element) {
	if (document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement) {
		return
	}
	if (element.requestFullscreen) {
		element.requestFullscreen()
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen()
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen()
	}
}

function exitFullScreen(element) {
	if (document.cancelFullScreen) {
		document.cancelFullScreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen()
	}
}

function onFullScreenChange(handler) {
	document.addEventListener('webkitfullscreenchange', handler)
	document.addEventListener('mozfullscreenchange', handler)
	document.addEventListener('fullscreenchange', handler)
	return () => {
		document.removeEventListener('webkitfullscreenchange', handler)
		document.removeEventListener('mozfullscreenchange', handler)
		document.removeEventListener('fullscreenchange', handler)
	}
}

function getTranslateX(element) {
	return getComputedStyle(element).transform.match(/\d+/g)[4]
}

function isAButton(element) {
	if (element.tagName === 'BUTTON') {
		return true
	}
	if (element.parentNode) {
		return isAButton(element.parentNode)
	}
	return false
}