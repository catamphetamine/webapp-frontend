export default class SlideshowScale {
	constructor(slideshow) {
		this.slideshow = slideshow
		this.slideshow.startInteractiveZoom = this.startInteractiveZoom
		this.slideshow.endInteractiveZoom = this.endInteractiveZoom
		this.slideshow.updateInteractiveZoom = this.updateInteractiveZoom
		this.slideshow.isInteractivelyZooming = () => this.isStillInteractivelyZooming
		this.slideshow.isAnimatingScale = () => this.isAnimatingScale
		this.slideshow.updateBoxShadow = this.updateBoxShadow
		this.slideshow.resetBoxShadow = this.resetBoxShadow
		this.slideshow.onSlideChange(this.reset)
		this.slideshow.onCleanUp(this.reset)
		this.slideshow.onStateChange((newState, prevState) => {
			const { scale } = newState
			const { scale: prevScale } = prevState
			// On change scale.
			if (scale !== prevScale) {
				this.onScaleChange()
			}
		}, {
			immediate: true
		})
	}

	/**
	 * Returns a preferred initial scale for a slide depending on the slideshow element size.
	 * @param  {object} slide
	 * @return {number}
	 */
	getInitialScaleForSlide(slide) {
		let scale = this._getInitialScaleForSlide(slide)
		// If slide size is same as thumbnail size, then artificially enlarge the slide,
		// so that the user isn't confused on whether they have clicked the thumbnail or not.
		if (this.isInitiallyOpenedSlide()) {
			const { thumbnailCoords } = this.slideshow.props
			if (thumbnailCoords) {
				// Get current slide index.
				// `state` is `undefined` when slideshow is being initialized.
				const { children: slides } = this.slideshow.props
				const i = slides.indexOf(slide)
				if (this.slideshow.getSlideWidth(i) === thumbnailCoords.width) {
					scale = Math.max(scale, 1 * MIN_THUMBNAIL_SCALE_FACTOR)
				}
			}
		}
		// Return the scale.
		return scale
	}

	isInitiallyOpenedSlide() {
		return !this.slideshow.getState() || (
			this.slideshow.getState().slideIndexAtWhichTheSlideshowIsBeingOpened === this.slideshow.getState().i
		)
	}

	_getInitialScaleForSlide(slide) {
		const plugin = this.slideshow.getPluginForSlide(slide)
		const minInitialScale = plugin.minInitialScale
		if (!minInitialScale) {
			return 1
		}
		const maxWidth = this.slideshow.getMaxSlideWidth()
		const maxHeight = this.slideshow.getMaxSlideHeight()
		const { width, height } = plugin.getMaxSize(slide)
		const widthRatio = width / maxWidth
		const heightRatio = height / maxHeight
		const ratio = Math.min(widthRatio, heightRatio)
		if (ratio < minInitialScale) {
			const largerScale = minInitialScale / ratio
			const maxScale = 1 / Math.max(widthRatio, heightRatio)
			return Math.min(largerScale, maxScale)
		}
		return 1
	}

	_scaleUp(scale, scaleStep, { restrict = true } = {}) {
		scale *= 1 + scaleStep
		if (restrict) {
			const { i } = this.slideshow.getState()
			return Math.min(scale, this.getSlideMaxScale(i))
		}
		return scale
	}

	_scaleDown(scale, scaleStep, { restrict = true } = {}) {
		scale /= 1 + scaleStep
		if (restrict) {
			return Math.max(
				scale,
				// Won't scale down past the original 1:1 size.
				// (for non-vector images)
				this.getMinScaleForCurrentSlide()
			)
		}
		return scale
	}

	_scaleToggle(scale) {
		const { i } = this.slideshow.getState()
		// Compensates math precision (is supposed to).
		return scale > 0.99 && scale < 1.01 ? this.getSlideMaxScale(i) : 1
	}

	zoom(scale) {
		if (this.slideshow.isDragAndScaleMode()) {
			return scale
		}
		const { i } = this.slideshow.getState()
		return Math.min(
			Math.max(scale, this.getMinScaleForCurrentSlide()),
			this.getSlideMaxScale(i)
		)
	}

	getSlideMaxScale(i) {
		const fullScreenWidthScale = this.slideshow.getMaxSlideWidth() / this.slideshow.getSlideWidth(i)
		const fullScreenHeightScale = this.slideshow.getMaxSlideHeight() / this.slideshow.getSlideHeight(i)
		return Math.min(fullScreenWidthScale, fullScreenHeightScale)
	}

	// Won't scale down past the original 1:1 size.
	// (for non-vector images)
	getMinScaleForCurrentSlide() {
		const {
			minScaledSlideRatio,
			i: initialSlideIndex,
			thumbnailCoords
		} = this.slideshow.props
		const { i } = this.slideshow.getState()
		if (i === initialSlideIndex) {
			if (thumbnailCoords) {
				const minScale = thumbnailCoords.width / this.slideshow.getSlideWidth(i)
				return Math.min(minScale * MIN_THUMBNAIL_SCALE_FACTOR, 1)
			}
		}
		// if (this.getPluginForSlide().isScaleDownAllowed) {
		// 	if (!this.getPluginForSlide().isScaleDownAllowed(this.getCurrentSlide())) {
		// 		return 1
		// 	}
		// }
		const slideWidthRatio = this.slideshow.getSlideWidth(i) / this.slideshow.getMaxSlideWidth()
		const slideHeightRatio = this.slideshow.getSlideHeight(i) / this.slideshow.getMaxSlideHeight()
		// Averaged ratio turned out to work better than "min" ratio.
		// const slideRatio = Math.min(slideWidthRatio, slideHeightRatio)
		const slideRatio = (slideWidthRatio + slideHeightRatio) / 2
		return minScaledSlideRatio / slideRatio
	}

	// getFullScreenScaleAdjustmentFactor(slide = this.getCurrentSlide()) {
	// 	if (this.shouldShowCloseButton()) {
	// 		if (this.getPluginForSlide(slide).hasCloseButtonClickingIssues &&
	// 			this.getPluginForSlide(slide).hasCloseButtonClickingIssues(slide)) {
	// 			// `this.closeButton.current` is not available while at slideshow initialization time.
	// 			// const closeButtonRect = this.closeButton.current.getBoundingClientRect()
	// 			// return 1 - 2 * (closeButtonRect.top + closeButtonRect.height) / this.getSlideshowHeight()
	// 			if (this.isSmallScreen()) {
	// 				return 0.9
	// 			} else {
	// 				return 0.95
	// 			}
	// 		}
	// 	}
	// 	return 1
	// }

	reset = () => {
		if (this.isAnimatingScale || this.isInteractivelyZooming) {
			if (this.isInteractivelyZooming) {
				this.resetInteractiveZoom()
			}
			if (this.isAnimatingScale) {
				this.slideshow.setSlideTransition()
				this.resetAnimateScale()
			}
			this.resetScale()
		}
	}

	/**
	 * Enters continuous zoom mode.
	 * @param {function} getZoomOrigin — A function returning "zoom origin". For example, "zoom origin" could be the middle point between two touches.
	 * @param {function} getZoomValue — A function returning "zoom value". For example, "zoom value" could be distance between two touches.
	 * @return {boolean} [result] Returns `false` if didn't enter zoom mode.
	 */
	startInteractiveZoom = (getZoomOrigin, getZoomValue) => {
		// Isn't supposed to happen.
		if (this.isInteractivelyZooming) {
			console.error('Continuous zoom mode initiated while already being active')
			return false
		}
		this.stopDragEndAnimation()
		const { scale } = this.slideshow.getState()
		this.scaleBeforeInteractiveZoom = scale
		this.scale = scale
		this.getInteractiveZoomValue = getZoomValue
		this.getInteractiveZoomOrigin = getZoomOrigin
		const origin = getZoomOrigin()
		const [originX, originY] = origin
		this.initialZoomValue = getZoomValue(originX, originY)
		this.slideshow.onInteractiveZoomStart(originX, originY)
		this.isInteractivelyZooming = true
		this.isStillInteractivelyZooming = true
		// Measure stuff used when exiting "Drag and Scale" mode on fast zoom out.
		// // Measure stuff used when closing the slideshow on fast zoom out.
		const { i } = this.slideshow.getState()
		const maxSlideWidth = this.slideshow.getMaxSlideWidth()
		const maxSlideHeight = this.slideshow.getMaxSlideHeight()
		const maxSlideSizeRatio = maxSlideWidth / maxSlideHeight
		const slideWidth = this.slideshow.getSlideWidth(i)
		const slideHeight = this.slideshow.getSlideHeight(i)
		const slideRatio = slideWidth / slideHeight
		if (slideRatio >= maxSlideSizeRatio) {
			this.interactiveZoomMaxWidth = maxSlideWidth
			this.interactiveZoomSlideWidth = slideWidth
		} else {
			this.interactiveZoomMaxHeight = maxSlideHeight
			this.interactiveZoomSlideHeight = slideHeight
		}
	}

	/**
	 * Performs continuous zoom step.
	 */
	updateInteractiveZoom = () => {
		if (!this.isInteractivelyZooming) {
			return
		}
		this.slideshow.onInteractiveZoomChange()
		const zoomValue = this.getInteractiveZoomValue()
		const zoomFactor = zoomValue / this.initialZoomValue
		const newScale = this.zoom(this.scaleBeforeInteractiveZoom * zoomFactor)
		if (this.slideshow.isDragAndScaleMode()) {
			// Follow zoom origin between the touches.
			const [originX, originY] = this.getInteractiveZoomOrigin()
			this.slideshow.updateInteractiveZoomOrigin(originX, originY)
			// const now = Date.now()
			if (this.interactiveZoomPrevValue === undefined) {
				this.interactiveZoomPrevValue = zoomValue
				// this.interactiveZoomPrevTimestamp = now
			} else {
				// If zooming out.
				if (zoomValue < this.interactiveZoomPrevValue) {
					let shouldExitDragAndScaleMode
					if (this.interactiveZoomMaxWidth !== undefined) {
						shouldExitDragAndScaleMode = this.interactiveZoomSlideWidth * newScale <= this.interactiveZoomMaxWidth
					} else {
						shouldExitDragAndScaleMode = this.interactiveZoomSlideHeight * newScale <= this.interactiveZoomMaxHeight
					}
					if (shouldExitDragAndScaleMode) {
						this.slideshow.exitDragAndScaleMode()
						this.slideshow.ignoreCurrentTouches = true
						return
					}
				}
			}
		}
		// Update the scale.
		this.setZoomScale(newScale)
		// // Close slideshow on fast zoom out when the slide is minimized.
		// const INTERACTIVE_ZOOM_CLOSE_SPEED_THRESHOLD = 0.5
		// const INTERACTIVE_ZOOM_CLOSE_MAX_SIZE_RATIO_THRESHOLD = 0.85
		// if (this.interactiveZoomSpeed > INTERACTIVE_ZOOM_CLOSE_SPEED_THRESHOLD) {
		// 	let shouldClose
		// 	if (this.interactiveZoomMaxWidth !== undefined) {
		// 		shouldClose = this.interactiveZoomSlideWidth * zoomFactor < INTERACTIVE_ZOOM_CLOSE_MAX_SIZE_RATIO_THRESHOLD * this.interactiveZoomMaxWidth
		// 	} else {
		// 		shouldClose = this.interactiveZoomSlideHeight * zoomFactor < INTERACTIVE_ZOOM_CLOSE_MAX_SIZE_RATIO_THRESHOLD * this.interactiveZoomMaxHeight
		// 	}
		// 	if (shouldClose) {
		// 		this.endInteractiveZoom()
		// 		const ANIMATION_DURATION = 120 * 100
		// 		function timeoutPromise(duration) {
		// 			return new Promise(resolve => setTimeout(resolve, duration))
		// 		}
		// 		this.slideshow.onClose(({ interaction }) => {
		// 			if (interaction === 'zoomOut') {
		// 				if (this.slideshow.resetEmulateInteractiveZoom) {
		// 					this.slideshow.resetEmulateInteractiveZoom()
		// 				}
		// 				return {
		// 					animationDuration: ANIMATION_DURATION,
		// 					promise: timeoutPromise(ANIMATION_DURATION)
		// 				}
		// 			}
		// 		})
		// 		this.slideshow.close({ interaction: 'zoomOut' })
		// 		console.log('@ Add fake touch move listeners here, and remove them on touch end/cancel.')
		// 		return
		// 	}
		// }
	}

	/**
	 * Exits continuous zoom mode.
	 */
	endInteractiveZoom = ({ applyScale = true } = {}) => {
		if (!this.isStillInteractivelyZooming) {
			return console.error('"endInteractiveZoom()" called while not interactively zooming')
		}
		this.isStillInteractivelyZooming = undefined
		if (applyScale) {
			this.applyScale()
		} else {
			this.onScaleChange()
		}
	}

	stopDragEndAnimation() {
		this.slideshow.pan.resetDragEndAnimation()
	}

	applyScale() {
		const { scale } = this.slideshow.getState()
		// Origin is fixed in "Drag and Scale" mode,
		// and also when "touch-zooming".
		if (this.slideshow.hasScaleOriginBeenSet()) {
			this.slideshow.updateScaleOriginOffsetForNewScale(this.scale)
		}
		if (scale === this.scale) {
			this.onScaleChange()
		} else {
			this.slideshow.setState({
				scale: this.scale
			})
		}
	}

	resetInteractiveZoom() {
		this.isInteractivelyZooming = undefined
		this.isStillInteractivelyZooming = undefined
		this.scaleBeforeInteractiveZoom = undefined
		this.getInteractiveZoomValue = undefined
		this.initialZoomValue = undefined
		this.getInteractiveZoomOrigin = undefined
		// Reset stuff used when exiting "Drag and Scale" mode on fast zoom out.
		// // Reset stuff used when closing the slideshow on fast zoom out.
		// this.interactiveZoomSpeed = undefined
		this.interactiveZoomPrevValue = undefined
		// this.interactiveZoomPrevTimestamp = undefined
		this.interactiveZoomSlideWidth = undefined
		this.interactiveZoomSlideHeight = undefined
		this.interactiveZoomMaxWidth = undefined
		this.interactiveZoomMaxHeight = undefined
	}

	animateScale(scale) {
		const { scale: currentScale } = this.slideshow.getState()
		if (scale === currentScale) {
			return
		}
		const { scaleAnimationDuration } = this.slideshow.props
		if (this.isAnimatingScale) {
			clearTimeout(this.finishAnimateScaleTimeout)
		} else {
			this.isAnimatingScale = true
			const { getSlideDOMNode } = this.slideshow.props
			getSlideDOMNode().style.transition = `transform ${scaleAnimationDuration}ms, box-shadow ${scaleAnimationDuration}ms`
		}
		this.animateScaleStartedAt = Date.now()
		this.finishAnimateScaleTimeout = setTimeout(this.finishAnimateScale, scaleAnimationDuration)
		this.setZoomScale(scale)
	}

	/**
	 * Stops zoom animation somewhere at arbitrary time.
	 */
	stopAnimateScale(options) {
		// `if (this.isInteractivelyZooming)` check didn't include
		// the case when `resetEmulateInteractiveZoom()` is called
		// before this code.
		// (`resetEmulateInteractiveZoom()` calls `endInteractiveZoom()` too).
		if (this.isStillInteractivelyZooming) {
			this.endInteractiveZoom(options)
		}
		if (this.finishAnimateScaleTimeout) {
			const { getSlideDOMNode } = this.slideshow.props
			const { i } = this.slideshow.getState()
			// Get current scale of the slide.
			// Getting `scale` from `transform` in real time would return a matrix.
			// https://stackoverflow.com/questions/5603615/get-the-scale-value-of-an-element
			// const scale = getSlideDOMNode().style.transform
			const scale = getSlideDOMNode().getBoundingClientRect().width / this.slideshow.getSlideWidth(i)
			const { onScaleChange } = this.slideshow.props
			// Apply the current scale in slideshow state.
			if (onScaleChange) {
				onScaleChange(scale)
			}
			this.scale = scale
			// Mark scale animation as finished.
			this.finishAnimateScale(options)
			return scale
		}
	}

	finishAnimateScale = ({ applyScale = true } = {}) => {
		clearTimeout(this.finishAnimateScaleTimeout)
		this.finishAnimateScaleTimeout = undefined
		if (applyScale) {
			// Reset `transition`, so that it doesn't animate scale from `scale` to `1`.
			this.slideshow.setSlideTransition()
			this.applyScale()
		} else {
			this.onScaleChange()
		}
	}

	// Should be called with `this.slideshow.setSlideTransition()`.
	resetAnimateScale() {
		this.isAnimatingScale = undefined
		this.animateScaleStartedAt = undefined
		if (this.finishAnimateScaleTimeout) {
			clearTimeout(this.finishAnimateScaleTimeout)
			this.finishAnimateScaleTimeout = undefined
		}
	}

	resetScale() {
		this.scale = undefined
	}

	onScaleChange = () => {
		if (this.isAnimatingScale || this.isInteractivelyZooming) {
			if (this.isAnimatingScale) {
				this.resetAnimateScale()
			}
			if (this.isInteractivelyZooming) {
				this.resetInteractiveZoom()
				this.slideshow.onInteractiveZoomEnd()
			}
			this.slideshow.onScaleEnd()
			// Reset slide CSS transform.
			// This is done before `resetScale()`,
			// because `resetScale()` resets `this.originalBoxShadow`
			// that is used in `updateSlideTransform()`.
			this.resetSlideTransform()
			this.resetBoxShadow()
			this.resetScale()
		}
	}

	resetSlideTransform() {
		this.slideshow.updateSlideTransform()
	}

	resetBoxShadow = () => {
		// Reset `box-shadow`.
		const { getSlideDOMNode } = this.slideshow.props
		getSlideDOMNode().style.boxShadow = this.originalBoxShadow
		this.originalBoxShadow = undefined
	}

	setZoomScale(scale) {
		const { onScaleChange } = this.slideshow.props
		if (onScaleChange) {
			onScaleChange(scale)
		}
		this.scale = scale
		this.slideshow.updateSlideTransform({
			scale: this.slideshow.getScaleFactor(scale)
		})
		this.updateBoxShadow(scale)
	}

	updateBoxShadow = (scale) => {
		const { getSlideDOMNode } = this.slideshow.props
		let boxShadow = this.originalBoxShadow
		if (!boxShadow) {
			boxShadow = this.originalBoxShadow = getBoxShadow(getSlideDOMNode())
		}
		if (boxShadow) {
			getSlideDOMNode().style.boxShadow = scaleBoxShadow(boxShadow, 1 / this.slideshow.getScaleFactor(scale))
		}
	}

	getZoomedInScale(scaleFactor, { restrict } = {}) {
		const { scaleStep } = this.slideshow.props
		const { scale } = this.slideshow.getState()
		return this._scaleUp(
			this.scale || scale,
			scaleStep * scaleFactor,
			{ restrict: restrict === false ? false : (this.slideshow.isDragAndScaleMode() ? false : true) }
		)
	}

	getZoomedOutScale(scaleFactor) {
		const { scaleStep } = this.slideshow.props
		const { scale } = this.slideshow.getState()
		return this._scaleDown(
			this.scale || scale,
			scaleStep * scaleFactor,
			{ restrict: this.slideshow.isDragAndScaleMode() ? false : true }
		)
	}

	willScalingUpExceedMaxSize(scaleFactor) {
		const { i } = this.slideshow.getState()
		// Adding `0.01`, because, for example, zoomed-in scale sometimes is
		// `1.0000000000000002` instead of `1` due to some precision factors.
		return this.getZoomedInScale(scaleFactor, { restrict: false }) > this.getSlideMaxScale(i) + 0.01
	}

	scaleUp = (scaleFactor) => {
		this.stopDragEndAnimation()
		this.animateScale(this.getZoomedInScale(scaleFactor))
	}

	scaleDown = (scaleFactor) => {
		this.stopDragEndAnimation()
		this.animateScale(this.getZoomedOutScale(scaleFactor))
	}

	scaleToggle = () => {
		const { scale } = this.slideshow.getState()
		this.stopDragEndAnimation()
		this.setState({
			scale: this._scaleToggle(scale)
		})
	}
}

const BOX_SHADOW_SPLIT_REGEXP = /,(?![^\(]*\))/

function scaleBoxShadow(boxShadow, scale) {
	return boxShadow.split(BOX_SHADOW_SPLIT_REGEXP).map((shadow) => {
		let colorEndsAt
		const closingBracketIndex = shadow.indexOf(')')
		if (closingBracketIndex >= 0) {
			colorEndsAt = closingBracketIndex
		} else {
			colorEndsAt = shadow.indexOf(' ') - 1
		}
		const color = shadow.slice(0, colorEndsAt + 1)
		const shadowValues = shadow.slice(colorEndsAt + 1 + ' '.length)
		const values = shadowValues.split(' ')
		let [xOffset, yOffset, blurRadius] = values.slice(0, 3).map(parseFloat).map(_ => _ * scale)
		return `${color} ${xOffset}px ${yOffset}px ${blurRadius}px ${values.slice(3).join(' ')}`
	}).join(', ')
}

function getBoxShadow(element) {
	const boxShadow = getComputedStyle(element).boxShadow
	if (boxShadow !== 'none') {
		return boxShadow
	}
}

const MIN_THUMBNAIL_SCALE_FACTOR = 1.25