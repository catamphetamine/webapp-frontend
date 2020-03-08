import SlideshowSize from './Slideshow.Size'
import SlideshowResize from './Slideshow.Resize'
import SlideshowFullscreen from './Slideshow.Fullscreen'
import SlideshowScale from './Slideshow.Scale'
import SlideshowPan from './Slideshow.Pan'
import SlideshowPointer from './Slideshow.Pointer'
import SlideshowTouch from './Slideshow.Touch'
import SlideshowKeyboard from './Slideshow.Keyboard'
import SlideshowOpenClose from './Slideshow.OpenClose'
import SlideshowScaleOpenCloseTransition from './Slideshow.ScaleOpenCloseTransition'
import SlideshowOpenCloseTransition from './Slideshow.OpenCloseTransition'
import SlideshowHoverPicture from './Slideshow.HoverPicture'

import PicturePlugin from './Slideshow.Picture'
import VideoPlugin from './Slideshow.Video'

export default class Slideshow {
	inits = []
	cleanUps = []
	onRerenders = []
	onSlideChangeListeners = []

	constructor(props) {
		props = SlideshowHoverPicture.getInitialProps(props)
		props = SlideshowOpenClose.getInitialProps(props)
		this.shouldOffsetSlide = props.shouldOffsetSlide
		new SlideshowResize(this)
		this.size = new SlideshowSize(this, {
			inline: props.inline,
			isRendered: props.isRendered,
			getWidth: props.getWidth,
			getHeight: props.getHeight,
			headerHeight: props.headerHeight,
			footerHeight: props.footerHeight,
			margin: props.margin,
			minMargin: props.minMargin,
			fullScreenFitPrecisionFactor: props.fullScreenFitPrecisionFactor
		})
		this.fullscreen = new SlideshowFullscreen(this)
		this.hoverPicture = new SlideshowHoverPicture(this)
		this.openClose = new SlideshowOpenClose(this)
		this.openCloseTransition = new SlideshowOpenCloseTransition(this)
		this.scaleOpenCloseTransition = new SlideshowScaleOpenCloseTransition(this)
		this.scale = new SlideshowScale(
			this,
			// {
			// 	getPluginForSlide: this.getPluginForSlide,
			// 	getSlideshowWidth: this.getSlideshowWidth,
			// 	getSlideshowHeight: this.getSlideshowHeight,
			// 	getMaxSlideWidth: this.getMaxSlideWidth,
			// 	getMaxSlideHeight: this.getMaxSlideHeight,
			// 	getCurrentSlideMaxWidth: this.getCurrentSlideMaxWidth,
			// 	getCurrentSlideMaxHeight: this.getCurrentSlideMaxHeight
			// },
			{
				minScaledSlideRatio: props.minScaledSlideRatio
			}
		)
		this.pan = new SlideshowPan(
			this,
			// {
			// 	getSlideshowWidth: this.getSlideshowWidth,
			// 	getSlideshowHeight: this.getSlideshowHeight,
			// 	showPrevious: this.showPrevious,
			// 	showNext: this.showNext,
			// 	close: this.close,
			// 	onPeek: this.onPeek,
			// 	getOverlayBackgroundColor: this.getOverlayBackgroundColor,
			// 	isFirst: this.isFirst,
			// 	isLast: this.isLast
			// },
			{
				emulatePanResistanceOnClose: props.emulatePanResistanceOnClose,
				panOffsetThreshold: props.panOffsetThreshold,
				onPanStart: props.onPanStart,
				onPanEnd: props.onPanEnd,
				inline: props.inline,
				slideInDuration: props.slideInDuration,
				minSlideInDuration: props.minSlideInDuration,
				updateSlideRollOffset: () => props.setSlideRollTransform(this.getSlideRollTransform()),
				setSlideRollTransitionDuration: props.setSlideRollTransitionDuration,
				// updateSlideRollTransitionDuration: () => props.setSlideRollTransitionDuration(this.getSlideRollTransitionDuration()),
				// updateOverlayTransitionDuration: () => props.setOverlayTransitionDuration(this.getOverlayTransitionDuration()),
				setOverlayBackgroundColor: props.setOverlayBackgroundColor,
				isRendered: props.isRendered
			}
		)
		this.pointer = new SlideshowPointer(
			this,
			// {
			// 	close: this.close,
			// 	scaleUp: this.scaleUp,
			// 	scaleDown: this.scaleDown
			// },
			{
				closeOnOverlayClick: props.closeOnOverlayClick,
				isOverlay: props.isOverlay,
				inline: props.inline,
				mouseWheelScaleFactor: props.mouseWheelScaleFactor
			}
		)
		this.touch = new SlideshowTouch(this)
		this.keyboard = new SlideshowKeyboard(this)
		// this.keyboard = new SlideshowKeyboard({
		// 	resetAnimations: this.resetAnimations,
		// 	close: this.close,
		// 	scaleUp: this.scaleUp,
		// 	scaleDown: this.scaleDown,
		// 	showPrevious: this.showPrevious,
		// 	showNext: this.showNext,
		// 	getPluginForSlide: this.getPluginForSlide,
		// 	getCurrentSlide: this.getCurrentSlide
		// })

		this.props = props
		this.state = this.getInitialState()
		this.setState = (newState) => {
			this.state = {
				...this.state,
				...newState
			}
			this._onStateChange(this.state)
		}
		this.markPicturesShown(props.i)
		this.lock()
	}

	getState() {
		return this.state
	}

	onStateChange(onStateChange) {
		this._onStateChange = onStateChange
	}

	/**
	 * Returns an initial state of the slideshow.
	 * @return {object}
	 */
	getInitialState() {
		const { i, inline, children: slides } = this.props
		return {
			i,
			slidesShown: new Array(slides.length),
			scale: this.getScaleForSlide(i),
			slideIndexAtWhichTheSlideshowIsBeingOpened: inline ? undefined : i,
			...this.hoverPicture.getInitialState()
		}
	}

	init(parameters) {
		for (const init of this.inits) {
			init(parameters)
		}
	}

	onInit(init) {
		this.inits.push(init)
	}

	cleanUp() {
		for (const cleanUp of this.cleanUps) {
			cleanUp()
		}
		clearTimeout(this.slideChangedTimeout)
		clearTimeout(this.closeTimeout)
	}

	onCleanUp(cleanUp) {
		this.cleanUps.push(cleanUp)
	}

	onSlideChange(listener) {
		this.onSlideChangeListeners.push(listener)
	}

	onAfterRerender() {
		for (const onRerender of this.onRerenders) {
			onRerender()
		}
	}

	onRerender(rerender) {
		this.onRerenders.push(rerender)
	}

	onCloseAnimation(getOnCloseAnimation) {
		this.getOnCloseAnimation = getOnCloseAnimation
	}

	// Only execute `fn` if the component is still mounted.
	// Can be used for `setTimeout()` and `Promise`s.
	ifStillMounted = (fn) => (...args) => {
		const { isRendered } = this.props
		if (isRendered()) {
			fn.apply(this, args)
		}
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

	showPreviousNextSlides() {
		const { children: slides } = this.props
		const { i } = this.state
		let { slidesShown } = this.state
		// Show previous slide.
		if (i > 0) {
			if (!slidesShown[i - 1]) {
				slidesShown = slidesShown.slice()
				slidesShown[i - 1] = true
			}
		}
		// Show next slide.
		if (i < slides.length - 1) {
			if (!slidesShown[i + 1]) {
				slidesShown = slidesShown.slice()
				slidesShown[i + 1] = true
			}
		}
		this.setState({
			slidesShown
		})
	}

	showSlide = (i, options = {}) => {
		const { i: iPrevious } = this.state
		if (i === iPrevious) {
			return
		}
		if (options.animationDuration) {
			this.slideChangedTimeout = setTimeout(this.triggerSlideChanged, options.animationDuration)
		} else {
			this.triggerSlideChanged()
		}
		this.markPicturesShown(i)
		// this.onHideSlide()
		this.setState({
			i,
			// Reset slide display mode.
			scale: this.getScaleForSlide(i),
			slideIndexAtWhichTheSlideshowIsBeingOpened: undefined
		})
	}

	triggerSlideChanged = () => {
		for (const onSlideChange of this.onSlideChangeListeners) {
			onSlideChange()
		}
	}

	// onHideSlide() {
	// 	const plugin = this.getPluginForSlide(this.getCurrentSlide())
	// 	if (plugin.onHideSlide) {
	// 		plugin.onHideSlide(
	// 			this.getCurrentSlide(),
	// 			this.currentSlideRef.current,
	// 			this.props
	// 		)
	// 	}
	// }

	// onShowSlide() {
	// 	const plugin = this.getPluginForSlide(this.getCurrentSlide())
	// 	if (plugin.onShowSlide) {
	// 		plugin.onShowSlide(
	// 			this.getCurrentSlide(),
	// 			this.currentSlideRef.current,
	// 			this.props
	// 		)
	// 	}
	// }

	onScaleUp = (event) => {
		if (this.locked) {
			return
		}
		// this.onActionClick()
		this.scaleUp()
	}

	onScaleDown = (event) => {
		if (this.locked) {
			return
		}
		// this.onActionClick()
		this.scaleDown()
	}

	onScaleToggle = (event) => {
		if (this.locked) {
			return
		}
		// this.onActionClick()
		this.scaleToggle()
	}

	/**
	 * Returns a preferred initial scale for a slide depending on the slideshow element size.
	 * Doesn't use `this.state`.
	 * @param  {number} i
	 * @return {number}
	 */
	getScaleForSlide(i) {
		const { children: slides } = this.props
		const slide = slides[i]
		// This error handling case is specifically for `new Slideshow()`
		// case when `this.state` is `undefined`.
		if (!slide) {
			throw new Error(`Slide #${i} not found`)
		}
		return this.scale.getScaleForSlide(slide)
	}

	scaleUp = (scaleFactor) => {
		const { scaleStep } = this.props
		const { scale } = this.state
		this.setState({
			scale: this.scale.scaleUp(
				scale,
				scaleStep,
				scaleFactor
			)
		})
	}

	scaleDown = (scaleFactor) => {
		const { scaleStep } = this.props
		const { scale } = this.state
		this.setState({
			scale: this.scale.scaleDown(
				scale,
				scaleStep,
				scaleFactor
			)
		})
	}

	scaleToggle = () => {
		const { scale } = this.state
		this.setState({
			scale: this.scale.scaleToggle(scale)
		})
	}

	onOpenExternalLink = (event) => {
		// this.onActionClick()
		const downloadInfo = this.getPluginForSlide().download(this.getCurrentSlide())
		if (downloadInfo) {
			// downloadFile(downloadInfo.url, downloadInfo.title)
		}
	}

	getCurrentSlide = () => {
		const { i } = this.state
		const { children: slides } = this.props
		return slides[i]
	}

	getSlideshowWidth = () => this.size.getSlideshowWidth()
	getSlideshowHeight = () => this.size.getSlideshowHeight()

	getMaxSlideWidth = () => this.size.getMaxSlideWidth()
	getMaxSlideHeight = () => this.size.getMaxSlideHeight()

	getCurrentSlideMaxWidth = () => this.size.getCurrentSlideMaxWidth()
	getCurrentSlideMaxHeight = () => this.size.getCurrentSlideMaxHeight()
	// getSlideAspectRatio = () => this.size.getSlideAspectRatio()

	getCurrentSlideWidth = () => this.size.getCurrentSlideWidth()
	getCurrentSlideHeight = () => this.size.getCurrentSlideHeight()

	getMargin = (edge) => this.size.getMargin(edge)

	getSlideTransform(j) {
		const {
			i,
			slideOffsetIndex,
			slideOffsetX,
			slideOffsetY
		} = this.state
		let transform = ''
		if (slideOffsetIndex === j) {
			if (j === i) {
				const [offsetX, offsetY] = this.size.getSlideOffset(
					this.getSlideScale(j),
					slideOffsetX,
					slideOffsetY
				)
				transform += `translateX(${offsetX}px) translateY(${offsetY}px)`
			} else {
				transform += `translateX(${slideOffsetX}px) translateY(${slideOffsetY}px)`
			}
		}
		return transform
	}

	getCurrentSlideMaxScale = () => this.scale.getCurrentSlideMaxScale()

	onBackgroundClick = (event) => {
		if (this.locked) {
			return
		}
		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.pan.wasPanning) {
			return
		}
		this.pointer.onBackgroundClick(event)
	}

	// wasInsideSlide(event) {
	// 	const { x, y } = this.getClickXYInSlideCoordinates(event)
	// 	return x >= 0 && x <= 1 && y >= 0 && y <= 1
	// }

	// getClickXYInSlideCoordinates(event) {
	// 	const { scale } = this.state
	//
	// 	const deltaWidth = this.getSlideshowWidth() - this.getCurrentSlideMaxWidth() * scale
	// 	const deltaHeight = this.getSlideshowHeight() - this.getCurrentSlideMaxHeight() * scale
	//
	// 	// Calculate normalized (from 0 to 1) click position relative to the slide.
	// 	const x = (event.clientX - deltaWidth / 2) / (this.getCurrentSlideMaxWidth() * scale)
	// 	const y = (event.clientY - deltaHeight / 2) / (this.getCurrentSlideMaxHeight() * scale)
	//
	// 	return { x, y }
	// }

	onSlideClick = (event) => {
		// This block of code is intentionally placed above `this.locked` check
		// because otherwise clicks while panning wouldn't be cancelled.
		// A "click" event is emitted on mouse up
		// when a user finishes panning to next/previous slide.
		if (this.pan.wasPanning) {
			// Prevent default so that the video slide doesn't play.
			event.preventDefault()
			// Stop propagation so that `onBackgroundClick` is not called.
			event.stopPropagation()
			return
		}
		if (this.locked) {
			return
		}
		this.resetAnimations()
		// Don't close the slideshow as a result of this click.
		// (because clicked inside the slide bounds, not outside it)
		event.stopPropagation()
		// Change the current slide to next or previous one.
		if (this.shouldShowNextSlideOnClick()) {
			const { closeOnSlideClick } = this.props
			if (closeOnSlideClick) {
				this.close()
			} else {
				this.showNext()
			}
			// if (x < previousNextClickRatio) {
			// 	this.showPrevious()
			// } else {
			// 	this.showNext()
			// }
		}
	}

	shouldShowNextSlideOnClick() {
		if (!this.getPluginForSlide().allowChangeSlideOnClick) {
			return false
		}
		return true
	}

	shouldShowShowMoreControlsButton() {
		const { showControls } = this.props
		if (!showControls) {
			return false
		}
		return true
	}

	shouldShowPreviousNextButtons() {
		const { isTouchDevice, showControls } = this.props
		if (!showControls) {
			return false
		}
		// // Don't show "Previous"/"Next" buttons.
		// // Because on touch devices the user is supposed to be able to swipe through slides
		// // and on desktop advanced users perhaps will guess to swipe slides too using a mouse.
		// // Picture slides transition to the next slide upon click.
		// // Also slide dots are clickable buttons
		// // (as a backup for those who won't guess to swipe with a mouse).
		// // It's a known bug that in iOS Safari it doesn't respond to swiping YouTube video.
		// // For such cases small screens show the single "Show controls" button.
		// return false
		// On touch devices users can just swipe, except when they can't.
		if (isTouchDevice()) {
			// It's a known bug that in iOS Safari it doesn't respond to swiping YouTube video.
			if (this.getPluginForSlide().canSwipe &&
				!this.getPluginForSlide().canSwipe(this.getCurrentSlide())) {
				// Show "Previous"/"Next" buttons because the user may not be
				// able to swipe to the next/previous slide.
			} else {
				// Normally a touch device user should swipe left/right to view previous/next slide.
				return false
			}
		}
		// // For pictures the user can just click through them.
		// if (this.shouldShowNextSlideOnClick()) {
		// 	return false
		// }
		// Commented the following code block because it's `return true` after it anyway.
		// // Users may not always have a keyboard (for example, TV users).
		// // But those users who only have a keyboard ("accessibility")
		// // should be able to switch slides using just the keyboard
		// // and they'll be able to by focusing on the previous/next buttons via the "Tab" key.
		// // Though keyboard-only users can also use "Page Up"/"Page Down" keys.
		// // (but that's not an intuitively obvious feature).
		// if (this.getPluginForSlide().capturesArrowKeys) {
		// 	if (this.getPluginForSlide().capturesArrowKeys(this.getCurrentSlide())) {
		// 		return true
		// 	}
		// }
		// Show the "Previous"/"Next" buttons.
		return true
	}

	hasHidableControls() {
		return this.shouldShowScaleButtons() ||
			this.shouldShowOpenExternalLinkButton() ||
			this.getOtherActions().length > 0
	}

	onShowMoreControls = () => {
		if (this.locked) {
			return
		}
		const { showMoreControls } = this.state
		this.setState({
			showMoreControls: !showMoreControls
		})
	}

	onClose = (event) => {
		if (this.locked) {
			return
		}
		this.close()
	}

	close = (options = {}) => {
		if (this.getOnCloseAnimation) {
			const { interaction } = options
			const result = this.getOnCloseAnimation({ interaction })
			if (result) {
				const { animationDuration } = result
				return this.closeAfter(animationDuration)
			}
		}
		this._close()
	}

	_close = () => {
		const { onClose } = this.props
		onClose()
	}

	closeAfter(duration) {
		this.lock()
		this.closeTimeout = setTimeout(this._close, duration)
	}

	lock = () => {
		this.locked = true
	}

	unlock = () => {
		this.locked = false
	}

	isLocked = () => {
		return this.locked
	}

	showPrevious = (options) => {
		const { i } = this.state
		if (this.isFirst()) {
			this.close(options)
		} else {
			this.didScrollThroughSlides = true
			this.showSlide(i - 1, options)
		}
	}

	showNext = (options) => {
		const { i } = this.state
		if (this.isLast()) {
			this.close(options)
		} else {
			this.didScrollThroughSlides = true
			this.showSlide(i + 1, options)
		}
	}

	onPeek = () => {
		if (!this.didScrollThroughSlides) {
			this.showPreviousNextSlides()
			this.didScrollThroughSlides = true
		}
	}

	resetAnimations = () => {
		this.pan.finishTransition()
	}

	isFirst = () => {
		const { i } = this.state
		return i === 0
	}

	isLast = () => {
		const { children: slides } = this.props
		const { i } = this.state
		return i === slides.length - 1
	}

	onShowPrevious = (event) => {
		if (this.locked) {
			return
		}
		// this.onActionClick()
		this.showPrevious()
	}

	onShowNext = (event) => {
		if (this.locked) {
			return
		}
		// this.onActionClick()
		this.showNext()
	}

	onDragStart = (event) => {
		event.preventDefault()
	}

	onTouchStart = (event) => {
		if (this.locked) {
			return
		}
		const { isButton } = this.props
		this.touch.onTouchStart(event)
		if (this.touch.getTouchCount() === 1) {
			// Ignore button/link clicks.
			if (isButton(event.target)) {
				return
			}
			const { x, y } = this.touch.getTouch()
			this.pan.onPanStart(x, y)
		} else if (this.touch.getTouchCount() === 2) {
			// Ignore multitouch when panning.
			if (this.pan.isPanning) {
				this.pan.onPanEnd(true)
			}
			this.onZoomStart()
		} else {
			// Ignore multitouch.
			// Reset.
			this.onTouchCancel()
		}
	}

	onTouchEnd = (event) => {
		this.touch.onTouchEnd(event)
		this.onTouchCancel(event)
	}

	onTouchCancel = (event) => {
		this.touch.onTouchCancel(event)
		if (this.pan.isPanning) {
			this.pan.onPanEnd()
		} else if (this.isZooming) {
			this.onZoomEnd()
		}
		// // Proceed on handling panning after zoomed with a pinch gesture
		// // and then lifted up one of the two fingers.
		// if (this.touch.getTouchCount() === 1) {
		// 	this.pan.onPanStart(
		// 		this.touches[0].x,
		// 		this.touches[0].y
		// 	)
		// }
	}

	onTouchMove = (event) => {
		if (this.locked) {
			return
		}
		// When a user scrolls to the next slide via touch
		// and then taps on the screen while the transition is still ongoing
		// such "touchstart" event will be ignored
		// but the subsequent "touchmove" events will still get here
		// while `this.touch.getTouch()` being `undefined`.
		if (!this.touch.getTouch()) {
			return
		}
		this.touch.onTouchMove(event)
		const { x, y } = this.touch.getTouch()
		if (this.pan.isPanning) {
			if (event.cancelable) {
				event.preventDefault()
			}
			this.pan.onPan(x, y)
		} else if (this.isZooming) {
			if (event.cancelable) {
				event.preventDefault()
			}
			this.onZoom()
		}
	}

	onPointerDown = (event) => {
		if (this.locked) {
			return
		}
		if (!this.pointer.isClickDown(event)) {
			return this.onPointerUp()
		}
		const { isButton } = this.props
		if (isButton(event.target)) {
			return
		}
		this.pan.onPanStart(
			event.clientX,
			event.clientY
		)
	}

	onPointerUp = () => {
		if (this.pan.isPanning) {
			this.pan.onPanEnd()
		}
	}

	onPointerMove = (event) => {
		if (this.pan.isPanning) {
			this.pan.onPan(
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
		if (!this.touch.isTouchDevice) {
			if (this.pan.isPanning) {
				this.pan.onPanEnd()
			}
		}
	}

	onZoomStart() {
		const { scale } = this.state
		this.isZooming = true
		this.scaleBeforeZoom = scale
		this.zoomStartDistanceBetweenTouches = this.touch.getDistanceBetweenTouches()
	}

	onZoom() {
		const zoomFactor = this.touch.getDistanceBetweenTouches() / this.zoomStartDistanceBetweenTouches
		this.setState({
			scale: this.scale.zoom(this.scaleBeforeZoom, zoomFactor)
		})
	}

	onZoomEnd() {
		this.isZooming = false
		this.scaleBeforeZoom = undefined
		this.zoomStartDistanceBetweenTouches = undefined
	}

	getOverlayBackgroundColor = (opacity) => {
		return `rgba(0,0,0,${opacity})`
	}

	/**
	 * This is public API.
	 * Returns scale for a slide being rendered.
	 * @param  {number} slideIndex
	 * @return {number}
	 */
	getSlideScale(j) {
		const { i, scale } = this.state
		return i === j ? scale : this.getScaleForSlide(j)
	}

	getPluginForSlide = (slide = this.getCurrentSlide()) => {
		const { plugins } = this.props
		const plugin = getPluginForSlide(slide, plugins)
		if (plugin) {
			return plugin
		}
		console.error('No plugin found for slide')
		console.error(slide)
	}

	shouldShowScaleButtons() {
		// Until scaling is implemented, don't show the buttons.
		// And maybe even don't show them after scaling is implemented too.
		return false
		// const { inline } = this.props
		// return !inline && this.size.isMaxSizeSlide(false) === false
	}

	shouldShowOpenExternalLinkButton() {
		if (this.getPluginForSlide().canOpenExternalLink) {
			return this.getPluginForSlide().canOpenExternalLink(this.getCurrentSlide())
		}
	}

	shouldShowCloseButton() {
		const {
			showControls,
			inline,
			children: slides
		} = this.props
		if (!showControls) {
			return false
		}
		// const {
		// 	showMoreControls
		// } = this.state
		if (inline) {
			return false
		}
		// If it's a single slide that closes on click then don't show the close button.
		if (slides.length === 1 && this.shouldShowNextSlideOnClick()) {
			return false
		}
		// // Don't show the "Close" button on small screens on touch devices.
		// // Because on touch devices the user is supposed to be able to
		// // swipe a slide vertically to close it.
		// if (this.isSmallScreen() && isTouchDevice()) {
		// 	// It's a known bug that in iOS Safari it doesn't respond to swiping YouTube video.
		// 	// For such cases the slideshow should show the "Close" button.
		// 	if (this.getPluginForSlide().canSwipe &&
		// 		!this.getPluginForSlide().canSwipe(this.getCurrentSlide())) {
		// 		// Show the "Close" button because the user may not be able to swipe-close the slide.
		// 	} else {
		// 		return false
		// 	}
		// }
		// // On desktops don't show the "Close" button
		// // because the user can swipe vertically to close,
		// // or they can click the overlay,
		// // or they can click through the rest of the slides.
		// if (this.isSmallScreen() && !isTouchDevice()) {
		// 	return false
		// }
		// Show the "Close" button.
		return true
	}

	getOtherActions() {
		const plugin = this.getPluginForSlide()
		if (plugin.getOtherActions) {
			return plugin.getOtherActions(this.getCurrentSlide())
		}
		return []
	}

	isSmallScreen() {
		const { isSmallScreen } = this.props
		return isSmallScreen()
	}

	shouldShowPagination() {
		const { showPagination, showControls } = this.props
		if (showPagination) {
			return true
		}
		if (!showControls) {
			return false
		}
		return true
	}

	shouldShowMoreControls() {
		const { showControls } = this.props
		const { showMoreControls } = this.state
		if (this._shouldHideMoreControls() && !showMoreControls) {
			return false
		}
		if (!showControls) {
			return false
		}
		return true
	}

	_shouldHideMoreControls() {
		// // On "large" screens (FullHD and larger) control buttons are large too.
		// // On "medium" screens control buttons are small.
		// // Therefore, control buttons fit for both "medium" and "large" screens.
		// return this.isSmallScreen()
		// Actually, always hide more controls because it looks cleaner, even on desktops.
		return true
	}

	getSlideRollTransform() {
		const { i } = this.state
		return `translate(${-1 * this.getSlideshowWidth() * i + this.pan.getPanOffsetX()}px, ${this.pan.getPanOffsetY()}px)`
	}

	// getSlideRollTransitionDuration() {
	// 	return `${this.pan.getSlideRollTransitionDuration()}ms`
	// }
}

function getPluginForSlide(slide, plugins) {
	for (const plugin of plugins) {
		if (plugin.canRender(slide)) {
			return plugin
		}
	}
}

export function isSlideSupported(slide) {
	if (getPluginForSlide(slide, PLUGINS)) {
		return true
	}
}

export const PLUGINS = [
	VideoPlugin,
	PicturePlugin
]