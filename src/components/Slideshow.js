import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'

import Picture, { getAspectRatio, getMaxSize as getMaxPictureSize, isVector } from './Picture'
import Video, { getMaxSize as getMaxVideoSize } from './Video'
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

const VideoPlugin = {
	canRender(slide) {
		return isVideo(slide)
	},
	render({
		slide,
		isShown,
		wasExpanded,
		onClick,
		maxWidth,
		maxHeight
	}) {
		return (
			<Video
				video={slide}
				fit="scale-down"
				autoPlay={wasExpanded ? true : false}
				showPreview={wasExpanded ? false : true}
				canPlay={isShown}
				onClick={onClick}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				className="rrui__slideshow__video"/>
		)
	},
	changeSlideOnClick: false
}

const PicturePlugin = {
	canRender(slide) {
		return slide.sizes !== undefined
	},
	render({
		slide,
		onClickPrecise,
		shouldUpscaleSmallSlides
	}) {
		return (
			<Picture
				picture={slide}
				fit={shouldUpscaleSmallSlides ? 'contain' : 'scale-down'}
				onClick={onClickPrecise}
				showLoadingPlaceholder
				className="rrui__slideshow__picture"/>
		)
	}
}

const PLUGINS = [
	VideoPlugin,
	PicturePlugin
]

class Slideshow extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
		i: PropTypes.number.isRequired,
		inline: PropTypes.bool.isRequired,
		fullScreen: PropTypes.bool.isRequired,
		// previousNextClickRatio: PropTypes.number.isRequired,
		closeOnOverlayClick: PropTypes.bool.isRequired,
		panOffsetThreshold: PropTypes.number.isRequired,
		panOffsetPrevNextWidthRatioThreshold: PropTypes.number.isRequired,
		slideInDuration: PropTypes.number.isRequired,
		minSlideInDuration: PropTypes.number.isRequired,
		scaleStep: PropTypes.number.isRequired,
		mouseWheelScaleFactor: PropTypes.number.isRequired,
		fullScreenFitPrecisionFactor: PropTypes.number.isRequired,
		plugins: PropTypes.arrayOf(PropTypes.object).isRequired,
		children: PropTypes.arrayOf(PropTypes.any).isRequired
	}

	static defaultProps = {
		i: 0,
		inline: false,
		fullScreen: false,
		// // previousNextClickRatio: 0.33,
		// previousNextClickRatio: 0,
		closeOnOverlayClick: true,
		panOffsetThreshold: 5,
		panOffsetPrevNextWidthRatioThreshold: 0.05,
		slideInDurationBaseWidth: 1980,
		slideInDuration: 500,
		minSlideInDuration: 150,
		scaleStep: 0.5,
		mouseWheelScaleFactor: 0.33,
		fullScreenFitPrecisionFactor: 0.85,
		plugins: PLUGINS
	}

	state = {
		scale: 1,
		expandedSlideIndex: !this.props.inline && this.props.i
	}

	container = React.createRef()
	slides = React.createRef()

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

	onResize = () => this.forceUpdate()

	onFullScreenChange = () => {
		const { i } = this.state
		this.showSlide(i)
	}

	markPicturesShown(i) {
		const { children: slides } = this.props
		const { slidesShown } = this.state

		let j = 0
		while (j < slides.length) {
			// Also prefetch previous and next images for left/right scrolling.
			slidesShown[j] =
				(this.shouldPreloadPrevousSlide() && j === i - 1) ||
				j === i ||
				(this.shouldPreloadNextSlide() && j === i + 1)
			j++
		}
	}

	// Only preload previous slide if the user already scrolled through slides.
	// Which means preload previous slides if the user has already navigated to a previous slide.
	shouldPreloadPrevousSlide() {
		return this.didScrollThroughSlides
	}

	// Only preload next slide if the user already scrolled through slides
	// (which means preload previous slides if the user has already navigated to a previous slide),
	// or when viewing slideshow starting from the first slide
	// (which implies navigating through all slides in perspective).
	shouldPreloadNextSlide() {
		const { i } = this.props
		return this.didScrollThroughSlides || i === 0
	}

	showSlide(i) {
		this.markPicturesShown(i)
		this.setState({
			i,
			// Reset slide display mode.
			scale: 1,
			expandedSlideIndex: undefined
		})
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
				this.allowsScalingDownCurrentSlide() ? 0 : 1
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

	isFullScreenSlide = (precise) => {
		const { fullScreenFitPrecisionFactor } = this.props
		// No definite answer (`true` or `false`) could be
		// given until slideshow dimensions are known.
		if (!this.slides.current) {
			return
		}
		const fitFactor = precise ? 1 : fullScreenFitPrecisionFactor
		const maxSize = this.getSlideMaxSize()
		return maxSize.width >= this.getSlideshowWidth() * fitFactor ||
			maxSize.height >= this.getSlideshowHeight() * fitFactor
	}

	// Won't scale down past the original 1:1 size.
	// (for non-vector images)
	allowsScalingDownCurrentSlide() {
		const slide = this.getCurrentSlide()
		return !isVideo(slide) && isVector(slide)
	}

	getCurrentSlide() {
		const { i } = this.state
		const { children: slides } = this.props
		return slides[i]
	}

	getSlideMaxSize() {
		const slide = this.getCurrentSlide()
		if (isVideo(slide)) {
			return getMaxVideoSize(slide)
		}
		return getMaxPictureSize(slide)
	}

	getSlideshowWidth = () => {
		const { inline } = this.props
		if (this.slides.current) {
			return this.slides.current.clientWidth
		}
		if (!inline) {
			return window.clientWidth
		}
	}

	getSlideshowHeight = () => {
		const { inline } = this.props
		if (this.slides.current) {
			return this.slides.current.clientHeight
		}
		if (!inline) {
			return window.clientHeight
		}
	}

	// For `<img/>` with `object-fit: contain` (or `object-fit: scale-down`).
	getSlideWidth = () => {
		return Math.min(
			this.getSlideshowHeight() * this.getSlideAspectRatio(),
			this.getSlideshowWidth(),
			this.shouldUpscaleSmallSlides() ? Number.MAX_VALUE : this.getSlideMaxSize().width
		)
	}

	getSlideHeight() {
		return this.getSlideWidth() / this.getSlideAspectRatio()
	}

	getSlideAspectRatio() {
		const slide = this.getCurrentSlide()
		if (isVideo(slide)) {
			if (slide.aspectRatio) {
				return slide.aspectRatio
			}
			return getAspectRatio(slide.picture)
		}
		return getAspectRatio(slide)
	}

	onBackgroundClick = (event) => {
		const { closeOnOverlayClick } = this.props
		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.wasPanning) {
			return
		}
		if (closeOnOverlayClick) {
			this.close()
		}
	}

	wasInsideSlide(event) {
		const { x, y } = this.getClickXYInSlideCoordinates(event)
		return x >= 0 && x <= 1 && y >= 0 && y <= 1
	}

	getClickXYInSlideCoordinates(event) {
		const { scale } = this.state

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth() * scale
		const deltaHeight = this.getSlideshowHeight() - this.getSlideHeight() * scale

		// Calculate normalized (from 0 to 1) click position relative to the slide.
		const x = (event.clientX - deltaWidth / 2) / (this.getSlideWidth() * scale)
		const y = (event.clientY - deltaHeight / 2) / (this.getSlideHeight() * scale)

		return { x, y }
	}

	createOnSlideClick(precise) {
		return (event) => {
			// const {
			// 	previousNextClickRatio
			// } = this.props

			// A "click" event is emitted on mouse up
			// when a user finishes panning to next/previous slide.
			if (this.wasPanning) {
				event.stopPropagation()
				return
			}

			this.finishTransition()

			if (precise && !this.wasInsideSlide(event)) {
				return
			}

			// Don't close the slideshow as a result of this click.
			// (because clicked inside the slide bounds, not outside it)
			event.stopPropagation()

			// Change the current slide to next or previos one.
			if (this.getPluginForSlide().changeSlideOnClick !== false) {
				this.showNext()
				// if (x < previousNextClickRatio) {
				// 	this.showPrevious()
				// } else {
				// 	this.showNext()
				// }
			}
		}
	}

	onSlideClick = this.createOnSlideClick()
	onSlideClickPrecise = this.createOnSlideClick(true)

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
			this.didScrollThroughSlides = true
			this.showSlide(i - 1)
		}
	}

	showNext() {
		const { i } = this.state
		if (this.isLast()) {
			this.close()
		} else {
			this.didScrollThroughSlides = true
			this.showSlide(i + 1)
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

	onActionsClick = (event) => {
		// Don't close the slideshow when clicked somewhere on actions.
		event.stopPropagation()
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
		// This is for `this.emulatePanResistance()`
		// so that it doesn't call DOM on each mousemove/touchmove.
		this.slideshowWidth = this.getSlideshowWidth()
	}

	onActualPanStart(actualPanOrigin) {
		this.panOrigin = actualPanOrigin
		this.isActuallyPanning = true
		this.container.current.classList.add('rrui__slideshow--panning')
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
		this.container.current.classList.remove('rrui__slideshow--panning')
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
			this.onActualPanStart(this.panOrigin + Math.sign(panOffset) * panOffsetThreshold)
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

	getScaleStyle() {
		const { scale } = this.state
		if (scale === 1) {
			return
		}
		return {
			transform: `scale(${scale})`
		}
	}

	getPluginForSlide(slide = this.getCurrentSlide()) {
		const { plugins } = this.props
		for (const plugin of plugins) {
			if (plugin.canRender(slide)) {
				return plugin
			}
		}
		console.error('No plugin found for slide')
		console.error(slide)
	}

	emulatePanResistance(panOffset) {
		return panOffset * Math.exp(-1 - (panOffset / this.slideshowWidth) / 2)
	}

	shouldUpscaleSmallSlides() {
		const { inline } = this.props
		return inline
	}

	shouldShowCloseButton() {
		const { inline, children: slides } = this.props
		if (inline) {
			return false
		}
		if (slides.length === 1 && !isVideo(slides[0])) {
			return false
		}
		return true
	}

	render() {
		const { isOpen, inline, children: slides } = this.props
		const { i, slidesShown, expandedSlideIndex } = this.state

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
					{slides.map((slide, j) => (
						<li
							key={j}
							style={j === i ? this.getScaleStyle() : undefined}
							className="rrui__slideshow__slide">
							{slidesShown[j] && this.renderSlide(slide, j, expandedSlideIndex === j)}
						</li>
					))}
				</ul>

				<ul
					className="rrui__slideshow__actions-top-right"
					onClick={this.onActionsClick}>
					{this.shouldShowCloseButton() &&
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

				<ul
					className="rrui__slideshow__controls-top rrui__slideshow__controls-center"
					onClick={this.onActionsClick}>
					{!inline && this.isFullScreenSlide(false) === false &&
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

				{slides.length > 1 &&
					<div className="rrui__slideshow__progress rrui__slideshow__controls-center rrui__slideshow__controls-bottom">
						<SlideshowProgress i={i} count={slides.length}/>
					</div>
				}
			</div>
		)
	}

	renderSlide(slide, j, wasExpanded) {
		const { i, scale } = this.state
		const isShown = j === i

		return this.getPluginForSlide(slide).render({
			slide,
			isShown,
			wasExpanded,
			onClick: this.onSlideClick,
			onClickPrecise: this.onSlideClickPrecise,
			maxWidth: this.getSlideshowWidth(),
			maxHeight: this.getSlideshowHeight(),
			shouldUpscaleSmallSlides: this.shouldUpscaleSmallSlides()
		})
	}
}

SlideshowWrapper.propTypes = Slideshow.propTypes
SlideshowWrapper.defaultProps = Slideshow.defaultProps

function SlideshowProgress({ i, count, maxCountForDots }) {
	if (count > maxCountForDots) {
		return (
			<div className="rrui__slideshow__progress-counter">
				<div className="rrui__slideshow__progress-counter-current">
					{i + 1}
				</div>
				<div className="rrui__slideshow__progress-counter-divider">
					/
				</div>
				<div className="rrui__slideshow__progress-counter-total">
					{count}
				</div>
			</div>
		)
	}
	return (
		<ul className="rrui__slideshow__progress-dots">
			{createRange(count).map((_, j) => (
				<li key={j} className={classNames('rrui__slideshow__progress-dot', {
					'rrui__slideshow__progress-dot--selected': j === i
				})}/>
			))}
		</ul>
	)
}

SlideshowProgress.propTypes = {
	i: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	maxCountForDots: PropTypes.number.isRequired
}

SlideshowProgress.defaultProps = {
	maxCountForDots: 10
}

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

function isVideo(slide) {
	return slide.picture !== undefined
}

function createRange(N) {
	const range = new Array(N)
	for (let i = 1; i <= N; i++) {
		range[i - 1] = i
	}
	return range
}