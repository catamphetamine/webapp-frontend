import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import throttle from 'lodash/throttle'
import FocusLock from 'react-focus-lock'

// `body-scroll-lock` has been modified a bit, see the info in the header of the file.
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from '../utility/body-scroll-lock'
import { isClickable, requestFullScreen, exitFullScreen, onFullScreenChange } from '../utility/dom'

import PicturePlugin from './Slideshow.Picture'
import VideoPlugin from './Slideshow.Video'

import Download from '../../assets/images/icons/download-cloud.svg'
import Close from '../../assets/images/icons/close.svg'
import LeftArrow from '../../assets/images/icons/left-arrow-minimal.svg'
import RightArrow from '../../assets/images/icons/right-arrow-minimal.svg'
import ScaleFrame from '../../assets/images/icons/scale-frame.svg'
import Plus from '../../assets/images/icons/plus.svg'
import Minus from '../../assets/images/icons/minus.svg'

import './Slideshow.css'

export default function SlideshowWrapper(props) {
	if (props.isOpen) {
		return <Slideshow {...props}/>
	}
	return null
}

const PLUGINS = [
	VideoPlugin,
	PicturePlugin
]

class Slideshow extends React.PureComponent {
	static propTypes = {
		messages: PropTypes.object.isRequired,
		onClose: PropTypes.func.isRequired,
		i: PropTypes.number.isRequired,
		// Set to `true` to open slideshow in inline mode (rather than in a modal).
		inline: PropTypes.bool.isRequired,
		// Set to `true` to open slideshow in "native" browser fullscreen mode.
		fullScreen: PropTypes.bool.isRequired,
		overlayOpacity: PropTypes.number.isRequired,
		// previousNextClickRatio: PropTypes.number.isRequired,
		closeOnOverlayClick: PropTypes.bool.isRequired,
		panOffsetThreshold: PropTypes.number.isRequired,
		emulatePanResistanceOnClose: PropTypes.bool.isRequired,
		slideInDuration: PropTypes.number.isRequired,
		minSlideInDuration: PropTypes.number.isRequired,
		showScaleButtons: PropTypes.bool.isRequired,
		scaleStep: PropTypes.number.isRequired,
		minScaledSlideRatio: PropTypes.number.isRequired,
		mouseWheelScaleFactor: PropTypes.number.isRequired,
		// minInitialScale: PropTypes.number.isRequired,
		fullScreenFitPrecisionFactor: PropTypes.number.isRequired,
		plugins: PropTypes.arrayOf(PropTypes.shape({
			getMaxSize: PropTypes.func.isRequired,
			getAspectRatio: PropTypes.func.isRequired,
			isScaleDownAllowed: PropTypes.func.isRequired,
			canDownload: PropTypes.func,
			getDownloadLink: PropTypes.func,
			canRender: PropTypes.func.isRequired,
			render: PropTypes.func.isRequired,
			// showCloseButtonForSingleSlide: PropTypes.bool
		})).isRequired,
		children: PropTypes.arrayOf(PropTypes.any).isRequired
	}

	static defaultProps = {
		i: 0,
		inline: false,
		fullScreen: false,
		overlayOpacity: 0.85,
		// // previousNextClickRatio: 0.33,
		// previousNextClickRatio: 0,
		closeOnOverlayClick: true,
		panOffsetThreshold: 5,
		emulatePanResistanceOnClose: false,
		slideInDuration: 500,
		minSlideInDuration: 150,
		showScaleButtons: true,
		scaleStep: 0.5,
		minScaledSlideRatio: 0.1,
		mouseWheelScaleFactor: 0.33,
		// minInitialScale: 0.5,
		fullScreenFitPrecisionFactor: 0.85,
		plugins: PLUGINS
	}

	// `state` is initialized at the bottom because it uses some instance methods.

	container = React.createRef()
	slides = React.createRef()
	currentSlide = React.createRef()
	previousButton = React.createRef()
	nextButton = React.createRef()
	closeButton = React.createRef()

	panOffsetX = 0
	panOffsetY = 0

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
		const { fullScreen, inline } = this.props
		// Focus is now handled by `react-focus-lock`.
		// if (document.activeElement) {
		// 	this.returnFocusTo = document.activeElement
		// }
		this.focus()
		if (fullScreen) {
			if (requestFullScreen(this.container.current)) {
				this.unlistenFullScreen = onFullScreenChange(this.onFullScreenChange)
			}
		}
		window.addEventListener('resize', this.onWindowResize)
		if (!inline) {
			// Without this in iOS Safari body content would scroll.
			// https://medium.com/jsdownunder/locking-body-scroll-for-all-devices-22def9615177
			const scrollBarWidth = getScrollBarWidth()
			disableBodyScroll(this.container.current, {
				// Apply the scrollbar-compensating padding immediately when setting
				// body's `overflow: hidden` to prevent "jitter" ("jank") (visual lag).
				// (for the `<body/>`)
				reserveScrollBarGap: true,
				onBodyOverflowHide: () => {
					// Apply the scrollbar-compensating padding immediately when setting
					// body's `overflow: hidden` to prevent "jitter" ("jank") (visual lag).
					// (for the slideshow `position: fixed` layer)
					if (this.container.current) {
						this.container.current.style.paddingRight = scrollBarWidth + 'px'
						// Render the slideshow with scrollbar-compensating padding in future re-renders.
						this.containerPaddingRight = scrollBarWidth + 'px'
					}
				}
			})
		}
		// `this.slides.current` is now available for `this.getSlideshowWidth()`.
		// Also updates container padding-right for scrollbar width compensation.
		this.forceUpdate()
		this._isMounted = true
	}

	componentWillUnmount() {
		const { fullScreen, inline } = this.props
		if (fullScreen) {
			exitFullScreen()
		}
		if (this.unlistenFullScreen) {
			this.unlistenFullScreen()
		}
		// Focus is now handled by `react-focus-lock`.
		// if (this.returnFocusTo) {
		// 	this.returnFocusTo.focus()
		// }
		clearTimeout(this.transitionEndTimer)
		window.removeEventListener('resize', this.onWindowResize)
		this._isMounted = false
		if (!inline) {
			// Disable `body-scroll-lock` (as per their README).
			enableBodyScroll(this.container.current)
			clearAllBodyScrollLocks()
		}
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
		if (i === this.state.i) {
			return
		}
		const direction = i > this.state.i ? 'next' : 'previous'
		this.markPicturesShown(i)
		this.setState({
			i,
			// Reset slide display mode.
			scale: this.getScaleForSlide(i),
			expandedSlideIndex: undefined
		}, () => this.focus(direction))
	}

	getScaleForSlide(i) {
		const { children: slides } = this.props
		const slide = slides[i]
		const plugin = this.getPluginForSlide(slide)
		const minInitialScale = plugin.minInitialScale
		if (!minInitialScale) {
			return 1
		}
		const maxWidth = this.getSlideshowWidth()
		const maxHeight = this.getSlideshowHeight()
		const maxSize = plugin.getMaxSize(slide)
		const widthRatio = maxSize.width / maxWidth
		const heightRatio = maxSize.height / maxHeight
		const ratio = Math.max(widthRatio, heightRatio)
		if (ratio < minInitialScale) {
			// return Math.min(1 / ratio, initialUpscaleFactor)
			return minInitialScale / ratio
		}
		return 1
	}

	focus = (direction = 'next') => {
		if (this.currentSlide.current.focus) {
			if (this.currentSlide.current.focus() !== false) {
				return
			}
		}
		if (direction === 'next' && this.nextButton.current) {
			this.nextButton.current.focus()
		} else if (direction === 'previous' && this.previousButton.current) {
			this.previousButton.current.focus()
		} else if (direction === 'previous' && this.nextButton.current) {
			this.nextButton.current.focus()
		} else if (this.closeButton.current) {
			// Close button is not rendered in inline mode, for example.
			this.closeButton.current.focus()
		} else {
			this.container.current.focus()
		}
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
		// Performing scale calculations in `setState()` callback
		// because a user can be scrolling fast and in that case
		// the scale calculated before `setState()` may become
		// outdated by the time the state is updated.
		this.setState(({ scale }, { scaleStep }) => {
			scale = scale / (1 + scaleStep * factor)
			return {
				scale: Math.max(
					scale,
					// Won't scale down past the original 1:1 size.
					// (for non-vector images)
					this.getMinScaleForCurrentSlide(scale)
				)
			}
		})
	}

	scaleToggle = () => {
		this.setState(({ scale }) => ({
			// Compensates math precision (is supposed to).
			scale: scale > 0.99 && scale < 1.01 ? this.getFullScreenScale() : 1
		}))
	}

	onScaleUp = (event) => {
		// this.onActionClick()
		this.scaleUp()
	}

	onScaleDown = (event) => {
		// this.onActionClick()
		this.scaleDown()
	}

	onScaleToggle = (event) => {
		// this.onActionClick()
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

	onDownload = (event) => {
		// this.onActionClick()
		const downloadInfo = this.getPluginForSlide().download(this.getCurrentSlide())
		if (downloadInfo) {
			downloadFile(downloadInfo.url, downloadInfo.title)
		}
	}

	// Won't scale down past the original 1:1 size.
	// (for non-vector images)
	getMinScaleForCurrentSlide(scale) {
		const { minScaledSlideRatio } = this.props
		if (this.getPluginForSlide().isScaleDownAllowed) {
			if (!this.getPluginForSlide().isScaleDownAllowed(this.getCurrentSlide())) {
				return 1
			}
		}
		const slideWidthRatio = this.getSlideWidth() / this.getSlideshowWidth()
		const slideHeightRatio = this.getSlideHeight() / this.getSlideshowHeight()
		// Averaged ratio turned out to work better than "min" ratio.
		// const slideRatio = Math.min(slideWidthRatio, slideHeightRatio)
		const slideRatio = (slideWidthRatio + slideHeightRatio) / 2
		return minScaledSlideRatio / slideRatio
	}

	getCurrentSlide() {
		const { i } = this.state
		const { children: slides } = this.props
		return slides[i]
	}

	getSlideMaxSize() {
		return this.getPluginForSlide().getMaxSize(this.getCurrentSlide())
	}

	getSlideshowWidth = () => {
		const { inline } = this.props
		if (this.slides.current) {
			return this.slides.current.clientWidth
		}
		if (!inline) {
			return getViewportWidth()
		}
	}

	getSlideshowHeight = () => {
		const { inline } = this.props
		if (this.slides.current) {
			return this.slides.current.clientHeight
		}
		if (!inline) {
			return getViewportHeight()
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
		return this.getPluginForSlide().getAspectRatio(this.getCurrentSlide())
	}

	onBackgroundClick = (event) => {
		const { closeOnOverlayClick } = this.props
		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.wasPanning) {
			return
		}
		// Only handle clicks on slideshow overlay.
		if (!event.target.classList.contains('rrui__slideshow__slide')) {
			return
		}
		if (closeOnOverlayClick) {
			this.close()
		}
	}

	// wasInsideSlide(event) {
	// 	const { x, y } = this.getClickXYInSlideCoordinates(event)
	// 	return x >= 0 && x <= 1 && y >= 0 && y <= 1
	// }

	// getClickXYInSlideCoordinates(event) {
	// 	const { scale } = this.state
	//
	// 	const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth() * scale
	// 	const deltaHeight = this.getSlideshowHeight() - this.getSlideHeight() * scale
	//
	// 	// Calculate normalized (from 0 to 1) click position relative to the slide.
	// 	const x = (event.clientX - deltaWidth / 2) / (this.getSlideWidth() * scale)
	// 	const y = (event.clientY - deltaHeight / 2) / (this.getSlideHeight() * scale)
	//
	// 	return { x, y }
	// }

	onSlideClick = (event) => {
		// const {
		// 	previousNextClickRatio
		// } = this.props

		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.wasPanning) {
			// Prevent default so that the video slide doesn't play.
			event.preventDefault()
			// Stop propagation so that `onBackgroundClick` is not called.
			event.stopPropagation()
			return
		}

		this.finishTransition()

		// if (precise && !this.wasInsideSlide(event)) {
		// 	return
		// }

		// Don't close the slideshow as a result of this click.
		// (because clicked inside the slide bounds, not outside it)
		event.stopPropagation()

		// Change the current slide to next or previous one.
		if (this.getPluginForSlide().changeSlideOnClick !== false) {
			this.showNext()
			// if (x < previousNextClickRatio) {
			// 	this.showPrevious()
			// } else {
			// 	this.showNext()
			// }
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
		// this.onActionClick()
		this.showPrevious()
	}

	onShowNext = (event) => {
		// this.onActionClick()
		this.showNext()
	}

	// onActionClick() {
	// 	this.focus()
	// }

	onKeyDown = (event) => {
		if (this.getPluginForSlide().onKeyDown) {
			this.getPluginForSlide().onKeyDown(event, this.getCurrentSlide(), this.currentSlide)
		}
		if (event.defaultPrevented) {
			return
		}
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Show previous slide.
			// "Left Arrow".
			case 37:
			// "Page Up".
			case 33:
				event.preventDefault()
				this.finishTransition()
				this.showPrevious()
				return

			// Show next slide.
			// "Right Arrow".
			case 39:
			// "Page Down".
			case 34:
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
		this.isTouchDevice = true
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return this.onTouchCancel()
		}
		if (isButton(event.target)) {
			return
		}
		this.onPanStart(
			event.changedTouches[0].clientX,
			event.changedTouches[0].clientY
		)
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
			this.onPan(
				event.changedTouches[0].clientX,
				event.changedTouches[0].clientY
			)
		}
	}

	onPointerDown = (event) => {
		switch (event.button) {
			// Left
			case 0:
				break
			// Middle
			case 1:
			// Right
			case 2:
			default:
				return this.onPointerUp()
		}
		if (isButton(event.target)) {
			return
		}
		this.onPanStart(
			event.clientX,
			event.clientY
		)
	}

	onPointerUp = () => {
		if (this.isPanning) {
			this.onPanEnd()
		}
	}

	onPointerMove = (event) => {
		if (this.isPanning) {
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
		// `onPointerOut` is called immediately
		// when starting to pan on touch devices.
		if (!this.isTouchDevice) {
			if (this.isPanning) {
				this.onPanEnd()
			}
		}
	}

	onPanStart(x, y) {
		this.finishTransition()
		this.isPanning = true
		this.panOriginX = x
		this.panOriginY = y
		this.slideshowWidth = this.getSlideshowWidth()
	}

	onActualPanStart(x, y) {
		this.panOriginX = x
		this.panOriginY = y
		this.panSpeed = 0
		this.panSpeedSampleOffset = undefined
		this.panSpeedSampleTimestamp = undefined
		this.isActuallyPanning = true
		this.container.current.classList.add('rrui__slideshow--panning')
	}

	onPanEnd() {
		const {
			inline,
			overlayOpacity,
			slideInDuration,
			minSlideInDuration
		} = this.props

		if (this.panOffsetX || this.panOffsetY) {
			this.calculatePanSpeedThrottled()
			if (this.panOffsetX !== 0) {
				const speedFactor = Math.exp(this.panSpeed * 4)
				const pannedWidthRatio = this.panOffsetX / this.getSlideshowWidth()
				if (pannedWidthRatio < -1 * 0.5 / speedFactor) {
					this.showNext()
				} else if (pannedWidthRatio > 0.5 / speedFactor) {
					this.showPrevious()
				}
				this.panOffsetX = 0
				this.transitionDuration = minSlideInDuration + Math.abs(pannedWidthRatio) * (slideInDuration - minSlideInDuration)
			} else if (this.panOffsetY !== 0) {
				const pannedHeightRatio = Math.abs(this.panOffsetY) / this.getSlideshowHeight()
				const speedFactor = 1 + Math.pow(this.panSpeed * 4, 2)
				if (pannedHeightRatio > 0.5 / speedFactor) {
					this.close()
				}
				this.panOffsetY = 0
				this.transitionDuration = minSlideInDuration + Math.abs(pannedHeightRatio) * (slideInDuration - minSlideInDuration)
			}
			this.updateSlideTransitionDuration()
			this.updateSlidePosition()
			if (!inline) {
				this.updateOverlayTransitionDuration()
				this.updateOverlayOpacity(overlayOpacity)
			}
			// Transition the slide back to it's original position.
			this.transitionOngoing = true
			this.transitionEndTimer = setTimeout(this.ifStillMounted(this.onTransitionEnd), this.transitionDuration)
		}
		// Rest.
		this.container.current.classList.remove('rrui__slideshow--panning')
		this.wasPanning = this.isActuallyPanning
		setTimeout(this.ifStillMounted(() => this.wasPanning = false), 0)
		this.isActuallyPanning = false
		this.isPanning = false
		this.panDirection = undefined
	}

	onPan(positionX, positionY) {
		const {
			inline,
			overlayOpacity,
			emulatePanResistanceOnClose,
			panOffsetThreshold
		} = this.props

		if (!this.isActuallyPanning) {
			const panOffsetX = positionX - this.panOriginX
			const panOffsetY = positionY - this.panOriginY
			// Don't treat accidental `touchmove`
			// (or `mousemove`) events as panning.
			const isPanningX = Math.abs(panOffsetX) > panOffsetThreshold
			const isPanningY = Math.abs(panOffsetY) > panOffsetThreshold
			if (!isPanningX && !isPanningY) {
				return
			}
			this.onActualPanStart(
				this.panOriginX + Math.sign(panOffsetX) * panOffsetThreshold,
				this.panOriginY + Math.sign(panOffsetY) * panOffsetThreshold,
			)
			// Can only pan in one direction: either horizontally or vertically.
			this.panDirection = isPanningX ? 'horizontal' : 'vertical'
		}

		if (this.panDirection === 'horizontal') {
			this.panOffsetX = positionX - this.panOriginX
		} else {
			this.panOffsetY = positionY - this.panOriginY
		}

		// Calculate speed.
		this.calculatePanSpeedThrottled()

		// Emulate pan resistance when there are
		// no more slides to navigate to.
		if (emulatePanResistanceOnClose) {
			if (this.panDirection === 'horizontal') {
				if ((this.isFirst() && this.panOffsetX > 0) ||
					(this.isLast() && this.panOffsetX < 0)) {
					this.panOffsetX = this.emulatePanResistance(this.panOffsetX)
				}
			} else {
				this.panOffsetY = this.emulatePanResistance(this.panOffsetY)
			}
		}
		// Update overlay opacity.
		if (!inline) {
			if (this.panDirection === 'horizontal') {
				if ((this.isFirst() && this.panOffsetX > 0) ||
					(this.isLast() && this.panOffsetX < 0)) {
					this.updateOverlayOpacity(
						overlayOpacity * (1 - (Math.abs(this.panOffsetX) / (this.getSlideshowWidth() / 2)))
					)
				}
			} else {
				this.updateOverlayOpacity(
					overlayOpacity * (1 - (Math.abs(this.panOffsetY) / this.getSlideshowHeight()))
				)
			}
		}
		// this.panToCloseOffsetNormalized = undefined
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

	calculatePanSpeed() {
		const now = Date.now()
		const offset = this.panDirection === 'horizontal' ? this.panOffsetX : this.panOffsetY
		if (this.panSpeedSampleTimestamp && this.panSpeedSampleOffset) {
			const dt = now - this.panSpeedSampleTimestamp
			if (dt > 0) {
				const dxy = offset - this.panSpeedSampleOffset
				this.panSpeed = Math.abs(dxy) / dt
			}
		}
		this.panSpeedSampleTimestamp = now
		this.panSpeedSampleOffset = offset
	}

	calculatePanSpeedThrottled = throttle(this.calculatePanSpeed, 10, {
		trailing: false
	})

	finishTransition() {
		if (this.transitionOngoing) {
			this.onTransitionEnd()
			clearTimeout(this.transitionEndTimer)
		}
	}

	onTransitionEnd = () => {
		this.transitionDuration = 0
		this.updateSlideTransitionDuration()
		this.updateOverlayTransitionDuration()
		this.transitionOngoing = false
	}

	updateSlideTransitionDuration() {
		this.slides.current.style.transitionDuration = `${this.transitionDuration}ms`
	}

	updateSlidePosition() {
		this.slides.current.style.transform = this.getTransform()
	}

	updateOverlayTransitionDuration() {
		this.container.current.style.transitionDuration = `${this.transitionDuration}ms`
	}

	updateOverlayOpacity(opacity = this.props.overlayOpacity) {
		this.container.current.style.backgroundColor = this.getOverlayBackgroundColor(opacity)
	}

	getOverlayBackgroundColor(opacity) {
		return `rgba(0,0,0,${opacity})`
	}

	getTransform() {
		const { i } = this.state
		return `translate(${-1 * (this.getSlideshowWidth() * i - this.panOffsetX)}px, ${this.panOffsetY}px)`
	}

	getScaleStyle() {
		const { scale } = this.state
		const style = {
			/* Can be scaled via `style="transform: scale(...)". */
			transition: 'transform 120ms ease-out'
		}
		if (scale !== 1) {
			style.transform = `scale(${scale})`
		}
		return style
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

	shouldShowScaleButton() {
		const { inline } = this.props
		return !inline && this.isFullScreenSlide(true) === false
	}

	shouldShowDownloadButton() {
		if (this.getPluginForSlide().canDownload) {
			return this.getPluginForSlide().canDownload(this.getCurrentSlide())
		}
	}

	shouldShowCloseButton() {
		const { inline, children: slides } = this.props
		if (inline) {
			return false
		}
		// if (slides.length === 1 && !this.getPluginForSlide().showCloseButtonForSingleSlide) {
		// 	return false
		// }
		return true
	}

	getOtherActions() {
		const plugin = this.getPluginForSlide()
		if (plugin.getOtherActions) {
			return plugin.getOtherActions(this.getCurrentSlide())
		}
		return []
	}

	render() {
		const {
			inline,
			showScaleButtons,
			overlayOpacity,
			messages,
			children: slides
		} = this.props

		const {
			i,
			slidesShown,
			expandedSlideIndex
		} = this.state

		// `react-focus-lock` doesn't focus `<video/>` when cycling the Tab key.
		// https://github.com/theKashey/react-focus-lock/issues/61

		// Safari doesn't support pointer events.
		// https://caniuse.com/#feat=pointer
		// https://webkit.org/status/#?search=pointer%20events
		// onPointerDown={this.onPointerDown}
		// onPointerUp={this.onPointerUp}
		// onPointerMove={this.onPointerMove}
		// onPointerOut={this.onPointerOut}

		// `tabIndex={ -1 }` makes the `<div/>` focusable.
		return (
			<FocusLock
				returnFocus
				autoFocus={false}>
			<div
				ref={this.container}
				tabIndex={-1}
				style={inline ? undefined : {
					paddingRight: this.containerPaddingRight,
					backgroundColor: this.getOverlayBackgroundColor(overlayOpacity)
				}}
				className={classNames('rrui__slideshow', {
					'rrui__slideshow--fullscreen': !inline,
					'rrui__slideshow--panning': this.isActuallyPanning
				})}
				onKeyDown={this.onKeyDown}
				onDragStart={this.onDragStart}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				onTouchCancel={this.onTouchCancel}
				onTouchMove={this.onTouchMove}
				onMouseDown={this.onPointerDown}
				onMouseUp={this.onPointerUp}
				onMouseMove={this.onPointerMove}
				onMouseLeave={this.onPointerOut}
				onClick={this.onBackgroundClick}
				onWheel={this.onWheel}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<ul
						ref={this.slides}
						style={{
							// `will-change` performs the costly "Composite Layers"
							// operation at mount instead of when navigating through slides.
							// Otherwise that "Composite Layers" operation would take about
							// 30ms a couple of times sequentially causing a visual lag.
							willChange: 'transform',
							transitionDuration: this.transitionDuration,
							transform: this.slides.current ? this.getTransform() : undefined,
							opacity: this.slides.current ? 1 : 0
						}}
						className="rrui__slideshow__slides">
						{slides.map((slide, j) => (
							<li
								key={j}
								className="rrui__slideshow__slide">
								{slidesShown[j] && this.renderSlide(slide, j, expandedSlideIndex === j)}
							</li>
						))}
					</ul>

					<ul className="rrui__slideshow__actions-top-right">
						{this.shouldShowScaleButton() &&
							<li className={classNames('rrui__slideshow__action-item', {
								'rrui__slideshow__action-group': showScaleButtons
							})}>
								{showScaleButtons &&
									<button
										type="button"
										title={messages.actions.scaleDown}
										onClick={this.onScaleDown}
										className="rrui__button-reset rrui__slideshow__action">
										<Minus className="rrui__slideshow__action-icon"/>
									</button>
								}
								<button
									type="button"
									title={messages.actions.scaleReset}
									onClick={this.onScaleToggle}
									className="rrui__button-reset rrui__slideshow__action">
									<ScaleFrame className="rrui__slideshow__action-icon"/>
								</button>
								{showScaleButtons &&
									<button
										type="button"
										title={messages.actions.scaleUp}
										onClick={this.onScaleUp}
										className="rrui__button-reset rrui__slideshow__action">
										<Plus className="rrui__slideshow__action-icon"/>
									</button>
								}
							</li>
						}

						{this.shouldShowDownloadButton() &&
							<li className="rrui__slideshow__action-item">
								<a
									download
									target="_blank"
									title={messages.actions.download}
									onKeyDown={clickTheLinkOnSpacebar}
									href={this.getPluginForSlide().getDownloadLink(this.getCurrentSlide())}
									className="rrui__slideshow__action rrui__slideshow__action--link">
									<Download className="rrui__slideshow__action-icon rrui__slideshow__action-icon--download"/>
								</a>
							</li>
						}

						{this.getOtherActions().map(({ name, icon: Icon, link, action }) => {
							const icon = <Icon className={`rrui__slideshow__action-icon rrui__slideshow__action-icon--${name}`}/>
							return (
								<li key={name} className="rrui__slideshow__action-item">
									{link &&
										<a
											target="_blank"
											href={link}
											title={messages.actions[name]}
											className="rrui__slideshow__action rrui__slideshow__action--link">
											{icon}
										</a>
									}
									{!link &&
										<button
											type="button"
											onClick={action}
											title={messages.actions[name]}
											className="rrui__button-reset rrui__slideshow__action">
											{icon}
										</button>
									}
								</li>
							)
						})}

						{this.shouldShowCloseButton() &&
							<li className="rrui__slideshow__action-item">
								<button
									ref={this.closeButton}
									type="button"
									title={messages.actions.close}
									onClick={this.close}
									className="rrui__button-reset rrui__slideshow__action">
									<Close className="rrui__slideshow__action-icon"/>
								</button>
							</li>
						}
					</ul>

					{slides.length > 1 && i > 0 &&
						<button
							ref={this.previousButton}
							type="button"
							title={messages.actions.previous}
							onClick={this.onShowPrevious}
							className="rrui__button-reset rrui__slideshow__action rrui__slideshow__previous">
							<LeftArrow className="rrui__slideshow__action-icon"/>
						</button>
					}

					{slides.length > 1 && i < slides.length - 1 &&
						<button
							ref={this.nextButton}
							type="button"
							title={messages.actions.next}
							onClick={this.onShowNext}
							className="rrui__button-reset rrui__slideshow__action rrui__slideshow__next">
							<RightArrow className="rrui__slideshow__action-icon"/>
						</button>
					}

					{slides.length > 1 &&
						<div className="rrui__slideshow__progress rrui__slideshow__controls-center rrui__slideshow__controls-bottom">
							<SlideshowProgress i={i} count={slides.length}/>
						</div>
					}
				</div>
			</div>
			</FocusLock>
		)
	}

	renderSlide(slide, j, wasExpanded) {
		const { i, scale } = this.state
		const isShown = j === i

		return this.getPluginForSlide(slide).render({
			ref: isShown ? this.currentSlide : undefined,
			tabIndex: isShown ? undefined : -1,
			slide,
			isShown,
			wasExpanded,
			onClick: this.onSlideClick,
			maxWidth: this.getSlideshowWidth(),
			maxHeight: this.getSlideshowHeight(),
			style: isShown ? this.getScaleStyle() : undefined
			// shouldUpscaleSmallSlides: this.shouldUpscaleSmallSlides()
		})
	}

	state = {
		scale: this.getScaleForSlide(this.props.i),
		expandedSlideIndex: !this.props.inline && this.props.i
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

function getTranslateX(element) {
	return getComputedStyle(element).transform.match(/\d+/g)[4]
}

function isButton(element) {
	if (element.classList && element.classList.contains('rrui__slideshow__action')) {
		return true
	}
	// `<button/>` tag name didn't work on "Download" link
	// and also did reset dragging on Video slides (which are buttons).
	// if (element.tagName === 'BUTTON') {
	// 	return true
	// }
	if (element.parentNode) {
		return isButton(element.parentNode)
	}
	return false
}

function createRange(N) {
	const range = new Array(N)
	for (let i = 1; i <= N; i++) {
		range[i - 1] = i
	}
	return range
}

function getScrollBarWidth() {
	return window.innerWidth - document.documentElement.clientWidth
}

export function getViewportWidth() {
	return document.documentElement.clientWidth
}

function getViewportHeight() {
	return document.documentElement.clientHeight
}

function clickTheLinkOnSpacebar(event) {
	switch (event.keyCode) {
		// "Spacebar".
		// Play video
		case 32:
			event.preventDefault()
			event.target.click()
	}
}