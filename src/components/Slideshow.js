import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'

import Picture from './Picture'
import { pictureShape } from '../PropTypes'

import Close from '../../assets/images/icons/close.svg'
import LeftArrow from '../../assets/images/icons/left-arrow-minimal.svg'
import RightArrow from '../../assets/images/icons/right-arrow-minimal.svg'
import Search from '../../assets/images/icons/search.svg'
import Plus from '../../assets/images/icons/plus.svg'
import Minus from '../../assets/images/icons/minus.svg'

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
		panOffsetThreshold: PropTypes.number.isRequired,
		panOffsetPrevNextWidthRatioThreshold: PropTypes.number.isRequired,
		slideInDuration: PropTypes.number.isRequired,
		minSlideInDuration: PropTypes.number.isRequired,
		scaleStep: PropTypes.number.isRequired,
		mouseWheelScaleFactor: PropTypes.number.isRequired,
		children: PropTypes.arrayOf(PropTypes.oneOfType([
			pictureShape,
			PropTypes.shape({
				picture: pictureShape.isRequired
			})
		])).isRequired
	}

	static defaultProps = {
		i: 0,
		inline: false,
		fullScreen: false,
		// previousNextClickRatio: 0.33,
		previousNextClickRatio: 0,
		closeOnOverlayClick: true,
		panOffsetThreshold: 5,
		panOffsetPrevNextWidthRatioThreshold: 0.05,
		slideInDurationBaseWidth: 1980,
		slideInDuration: 500,
		minSlideInDuration: 150,
		scaleStep: 0.5,
		mouseWheelScaleFactor: 0.33
	}

	state = {
		scale: 1
	}

	container = React.createRef()
	slides = React.createRef()
	slide = React.createRef()

	panOffset = 0
	transitionDuration = 0

	constructor(props)
	{
		super(props)

		const { i, children: slides } = this.props

		this.state.i = i
		this.state.slidesShown = new Array(slides.length)

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
		this._isMounted = true
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
		this._isMounted = false
	}

	// Only execute `fn` if the component is still mounted.
	// Can be used for `setTimeout()` and `Promise`s.
	ifStillMounted = (fn) => (...args) => this._isMounted && fn.apply(this, args)

	onWindowResize = throttle((event) => this.onResize(), 100)

	onResize = () => {
		this.forceUpdate()
	}

	onFullScreenChange = () => {
		const { i } = this.state
		this.showPicture(i)
	}

	markPicturesShown(i) {
		const { children: slides } = this.props
		const { slidesShown } = this.state

		let j = 0
		while (j < slides.length) {
			// Also prefetch previous and next images for mobile scrolling.
			slidesShown[j] = j === i - 1 || j === i || j === i + 1
			// slidesShown[j] = j === i
			j++
		}
	}

	showPicture(i) {
		this.markPicturesShown(i)
		this.setState({ i, scale: 1 })
	}

	scaleUp = (event, factor = 1) => {
		this.setState(({ scale }, { scaleStep }) => ({
			scale: Math.min(
				scale * (1 + scaleStep * factor),
				this.getFullScreenScale()
			)
		}))
	}

	scaleDown = (event, factor = 1) => {
		this.setState(({ scale }, { scaleStep }) => ({
			scale: Math.max(
				scale / (1 + scaleStep * factor),
				// Won't scale down past the original 1:1 size.
				// (for non-vector images)
				this.slide.current.isVector() ? 0 : 1
			)
		}))
	}

	scaleToggle = () => {
		this.setState(({ scale }) => ({
			// Compensates math precision (is supposed to).
			scale: scale > 0.99 && scale < 1.01 ? this.getFullScreenScale() : 1
		}))
	}

	onScaleUp = (event) => {
		event.stopPropagation()
		this.scaleUp()
	}

	onScaleDown = (event) => {
		event.stopPropagation()
		this.scaleDown()
	}

	onScaleToggle = (event) => {
		event.stopPropagation()
		this.scaleToggle()
	}

	getFullScreenScale = () => {
		const fullScreenWidthScale = this.getSlideshowWidth() / this.getSlideWidth()
		const fullScreenHeightScale = this.getSlideshowHeight() / this.getSlideHeight()
		return Math.min(fullScreenWidthScale, fullScreenHeightScale)
	}

	isFullScreenSlide = () => {
		const { i } = this.state
		const { children: slides } = this.props

		// No definite answer (`true` or `false`) could be
		// given until slideshow dimensions are known.
		if (!this.slides.current) {
			return
		}

		const picture = slides[i]
		const maxSize = picture.sizes[picture.sizes.length - 1]
		return maxSize.width >= this.getSlideshowWidth() ||
			maxSize.height >= this.getSlideshowHeight()
	}

	getSlideshowWidth = () => this.slides.current.clientWidth
	getSlideshowHeight = () => this.slides.current.clientHeight

	// For `<img/>` centered horizontally inside an `<li/>`.
	// getSlideWidth = () => this.slide.current.getWidth()

	// For `<img/>` with `object-fit: contain` (or `object-fit: scale-down`).
	getSlideWidth = () => {
		return Math.min(
			this.getSlideshowHeight() * this.slide.current.getAspectRatio(),
			this.getSlideshowWidth(),
			this.shouldUpscaleSmallImages() ? Number.MAX_VALUE : this.slide.current.getPreferredWidth()
		)
	}

	getSlideHeight() {
		// return this.getSlideWidth() / this.slide.current.getAspectRatio()
		return this.slide.current.getHeight()
	}

	onBackgroundClick = (event) => {
		const { closeOnOverlayClick } = this.props
		if (closeOnOverlayClick) {
			this.close()
		}
	}

	onSlideClick = (event) => {
		const {
			previousNextClickRatio,
			closeOnOverlayClick
		} = this.props

		const { i } = this.state

		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.wasPanning) {
			event.stopPropagation()
			return
		}

		this.finishTransition()

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth()
		const deltaHeight = this.getSlideshowHeight() - this.getSlideHeight()

		// Calculate normalized (from 0 to 1) click position relative to the slide.
		const clickPositionX = (event.clientX - deltaWidth / 2) / this.getSlideWidth()
		const clickPositionY = (event.clientY - deltaHeight / 2) / this.getSlideHeight()

		// If clicked outside the image then
		// the click event should fall through.
		if (closeOnOverlayClick &&
			(
				(clickPositionX < 0 || clickPositionX > 1)
				||
				(clickPositionY < 0 || clickPositionY > 1)
			)
		) {
			return
		}

		event.stopPropagation()

		if (clickPositionX < previousNextClickRatio) {
			this.showPrevious()
		} else {
			this.showNext()
		}
	}

	close() {
		const { onClose } = this.props
		onClose()
	}

	onClose = (event) => {
		event.stopPropagation()
		this.close()
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
		const { children: slides } = this.props
		const { i } = this.state
		return i === slides.length - 1
	}

	onShowPrevious = (event) => {
		event.stopPropagation()
		this.container.current.focus()
		this.showPrevious()
	}

	onShowNext = (event) => {
		event.stopPropagation()
		this.container.current.focus()
		this.showNext()
	}

	onKeyDown = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// "Left Arrow".
			// Show previous slide.
			case 37:
				event.preventDefault()
				this.finishTransition()
				this.showPrevious()
				return

			// "Right Arrow".
			// Show next slide.
			case 39:
				event.preventDefault()
				this.finishTransition()
				this.showNext()
				return

			// "Up Arrow".
			// Scale up.
			case 38:
				event.preventDefault()
				this.scaleUp()
				return

			// "Down Arrow".
			// Scale down.
			case 40:
				event.preventDefault()
				this.scaleDown()
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
		if (isButton(event.target)) {
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
		if (isButton(event.target)) {
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
			panOffsetPrevNextWidthRatioThreshold,
			slideInDuration,
			minSlideInDuration,
			slideInDurationBaseWidth
		} = this.props

		const pannedWidthRatio = this.panOffset / this.getSlideshowWidth()
		if (pannedWidthRatio < -1 * panOffsetPrevNextWidthRatioThreshold) {
			this.showNext()
		} else if (pannedWidthRatio > panOffsetPrevNextWidthRatioThreshold) {
			this.showPrevious()
		}
		if (this.panOffset !== 0) {
			this.transitionDuration = minSlideInDuration + Math.abs(pannedWidthRatio) * (slideInDuration - minSlideInDuration) * (this.getSlideshowWidth() / slideInDurationBaseWidth)
			this.updateSlideTransitionDuration()
			this.panOffset = 0
			this.updateSlidePosition()
			this.transitionOngoing = true
			this.transitionEndTimer = setTimeout(this.ifStillMounted(this.onTransitionEnd), this.transitionDuration)
		}
		this.container.current.classList.remove('slideshow--panning')
		this.wasPanning = this.isActuallyPanning
		setTimeout(this.ifStillMounted(() => this.wasPanning = false), 0)
		this.isActuallyPanning = false
		this.isPanning = false
	}

	onPan(position) {
		const { panOffsetThreshold } = this.props

		if (!this.isActuallyPanning) {
			const panOffset = position - this.panOrigin
			// Don't treat accidental `touchmove`
			// (or `mousemove`) events as panning.
			if (Math.abs(panOffset) <= panOffsetThreshold) {
				return
			}
			this.panOrigin = this.panOrigin + Math.sign(panOffset) * panOffsetThreshold
			this.isActuallyPanning = true
		}

		this.panOffset = position - this.panOrigin

		// Emulate pan resistance when there are
		// no more slides to navigate to.
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

	shouldUpscaleSmallImages() {
		const { inline } = this.props
		return inline
	}

	onWheel = (event) => {
		const { inline, mouseWheelScaleFactor } = this.props
		const { deltaY } = event

		if (!inline) {
			event.preventDefault()
			if (deltaY < 0) {
				this.scaleUp(null, mouseWheelScaleFactor)
			} else {
				this.scaleDown(null, mouseWheelScaleFactor)
			}
		}
	}

	render() {
		const { isOpen, inline, children: slides } = this.props
		const { i, scale, slidesShown } = this.state

		if (!isOpen) {
			return null
		}

		// `tabIndex={ -1 }` makes the `<div/>` focusable.

		return (
			<div
				ref={this.container}
				tabIndex={-1}
				className={classNames('rrui__slideshow', {
					'rrui__slideshow--fullscreen': !inline
					// 'rrui__slideshow--panning': this.isPanning
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
				onMouseLeave={this.onMouseLeave}
				onClick={this.onBackgroundClick}
				onWheel={this.onWheel}>
				<ul
					ref={this.slides}
					style={{
						transitionDuration: this.transitionDuration,
						transform: this.slides.current ? this.getTransform() : undefined,
						opacity: this.slides.current ? 1 : 0
					}}
					className="rrui__slideshow__slides">
					{slides.map((picture, j) => (
						<li
							key={j}
							className="rrui__slideshow__slide">
							{slidesShown[j] &&
								<Picture
									ref={j === i ? this.slide : undefined}
									sizes={picture.sizes}
									type={picture.type}
									onClick={this.onSlideClick}
									fit={this.shouldUpscaleSmallImages() ? 'contain' : 'scale-down'}
									showLoadingPlaceholder
									className="rrui__slideshow__picture"
									style={j !== i || scale === 1 ? undefined : { transform: `scale(${scale})` }}/>
							}
						</li>
					))}
				</ul>

				<ul className="rrui__slideshow__actions-top-right">
					{!inline && slides.length > 1 &&
						<li>
							<button
								type="button"
								onClick={this.onClose}
								className="rrui__button-reset rrui__slideshow__action">
								<Close className="rrui__slideshow__action-icon"/>
							</button>
						</li>
					}
				</ul>

				{slides.length > 1 && i > 0 &&
					<button
						type="button"
						onClick={this.onShowPrevious}
						className="rrui__button-reset rrui__slideshow__action rrui__slideshow__previous">
						<LeftArrow className="rrui__slideshow__action-icon"/>
					</button>
				}

				{slides.length > 1 && i < slides.length - 1 &&
					<button
						type="button"
						onClick={this.onShowNext}
						className="rrui__button-reset rrui__slideshow__action rrui__slideshow__next">
						<RightArrow className="rrui__slideshow__action-icon"/>
					</button>
				}

				<ul className="rrui__slideshow__actions-bottom">
					{!inline && this.isFullScreenSlide() === false &&
						<li className="rrui__slideshow__action-group">
							<button
								type="button"
								onClick={this.onScaleDown}
								className="rrui__button-reset rrui__slideshow__action">
								<Minus className="rrui__slideshow__action-icon"/>
							</button>
							<button
								type="button"
								onClick={this.onScaleToggle}
								className="rrui__button-reset rrui__slideshow__action">
								<Search className="rrui__slideshow__action-icon"/>
							</button>
							<button
								type="button"
								onClick={this.onScaleUp}
								className="rrui__button-reset rrui__slideshow__action">
								<Plus className="rrui__slideshow__action-icon"/>
							</button>
						</li>
					}
				</ul>
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

function isButton(element) {
	if (element.tagName === 'BUTTON') {
		return true
	}
	if (element.parentNode) {
		return isButton(element.parentNode)
	}
	return false
}