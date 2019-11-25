import throttle from 'lodash/throttle'

const PAN_SPEED_CALC_THROTTLE = 200  // in milliseconds
const PAN_SPEED_CALC_WINDOW = PAN_SPEED_CALC_THROTTLE + 100 // in milliseconds

export default class SlideshowPan {
	panOffsetX = 0
	panOffsetY = 0
	panSpeed = 0
	transitionDuration = 0

	constructor(slideshow, props) {
		this.slideshow = slideshow
		this.props = props
		slideshow.onCleanUp(this.cleanUp)
	}

	cleanUp = () => {
		clearTimeout(this.transitionEndTimer)
	}

	onPanStart(x, y) {
		this.finishTransition()
		this.isPanning = true
		this.panOriginX = x
		this.panOriginY = y
		this.slideshowWidth = this.slideshow.getSlideshowWidth()
	}

	onActualPanStart(x, y) {
		this.panOriginX = x
		this.panOriginY = y
		this.isActuallyPanning = true
		const { onPanStart } = this.props
		onPanStart()
	}

	getAdjacentSlideTransitionDuration(pannedRatio) {
		const {
			slideInDuration,
			minSlideInDuration
		} = this.props
		return minSlideInDuration + Math.abs(pannedRatio) * (slideInDuration - minSlideInDuration)
	}

	onPanEnd(cancel) {
		const {
			inline
		} = this.props

		if (this.panOffsetX || this.panOffsetY) {
			this.calculatePanSpeed()
			let pannedRatio
			if (this.panOffsetX) {
				pannedRatio = Math.abs(this.panOffsetX) / this.slideshowWidth
				// Switch slide (if panning wasn't taken over by zooming).
				if (!cancel) {
					if (pannedRatio > 0.5 || this.panSpeed > 0.05) {
						const animationDuration = this.getAdjacentSlideTransitionDuration(pannedRatio)
						if (this.panOffsetX < 0) {
							this.slideshow.showNext({ animationDuration, interaction: 'pan' })
						} else {
							this.slideshow.showPrevious({ animationDuration, interaction: 'pan' })
						}
					}
				}
			} else {
				pannedRatio = Math.abs(this.panOffsetY) / this.slideshow.getSlideshowHeight()
				// Close the slideshow if panned vertically far enough or fast enough.
				if (!cancel) {
					if (pannedRatio > 0.5 || this.panSpeed > 0.05) {
						this.slideshow.close({ interaction: 'pan' })
					}
				}
			}
			this.panOffsetX = 0
			this.panOffsetY = 0
			this.onTransitionStart(this.getAdjacentSlideTransitionDuration(pannedRatio))
		}
		// Rest.
		const { onPanEnd } = this.props
		onPanEnd()
		this.wasPanning = this.isActuallyPanning
		setTimeout(() => {
			const { isRendered } = this.props
			if (isRendered()) {
				this.wasPanning = false
			}
		}, 0)
		this.isActuallyPanning = false
		this.isPanning = false
		this.panDirection = undefined
		this.panSpeed = 0
		this.panSpeedSampleOffset = undefined
		this.panSpeedSampleTimestamp = undefined
		this.slideshowWidth = undefined
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

		// The user intended to swipe left/right through slides
		// which means the slideshow should start preloading and showing
		// previous/next slides (if it's not showing them already).
		if (this.panDirection === 'horizontal') {
			this.slideshow.onPeek()
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
				if ((this.slideshow.isFirst() && this.panOffsetX > 0) ||
					(this.slideshow.isLast() && this.panOffsetX < 0)) {
					this.panOffsetX = this.emulatePanResistance(this.panOffsetX)
				}
			} else {
				this.panOffsetY = this.emulatePanResistance(this.panOffsetY)
			}
		}
		// Update overlay opacity.
		if (!inline) {
			if (this.panDirection === 'horizontal') {
				if ((this.slideshow.isFirst() && this.panOffsetX > 0) ||
					(this.slideshow.isLast() && this.panOffsetX < 0)) {
					this.updateOverlayOpacity(
						overlayOpacity * (1 - (Math.abs(this.panOffsetX) / this.slideshow.getSlideshowWidth()))
					)
				}
			} else {
				this.updateOverlayOpacity(
					overlayOpacity * (1 - (Math.abs(this.panOffsetY) / this.slideshow.getSlideshowHeight()))
				)
			}
		}
		// this.panToCloseOffsetNormalized = undefined
		this.updateSlideRollOffset()
	}

	calculatePanSpeed = () => {
		const now = Date.now()
		const offset = this.panOffsetX || this.panOffsetY
		if (this.panSpeedSampleTimestamp) {
			const dt = now - this.panSpeedSampleTimestamp
			if (dt > 0) {
				if (dt < PAN_SPEED_CALC_WINDOW) {
					const dr = Math.abs(offset - this.panSpeedSampleOffset)
					this.panSpeed = dr / dt
				} else {
					this.panSpeed = 0
				}
			}
		}
		this.panSpeedSampleTimestamp = now
		this.panSpeedSampleOffset = offset
	}

	calculatePanSpeedThrottled = throttle(this.calculatePanSpeed, PAN_SPEED_CALC_THROTTLE, {
		trailing: false
	})

	finishTransition() {
		if (this.transitionOngoing) {
			this.onTransitionEnd()
			clearTimeout(this.transitionEndTimer)
		}
	}

	onTransitionStart(duration) {
		const { inline, setSlideRollTransitionDuration } = this.props
		// this.transitionDuration = duration
		// this.updateSlideRollTransitionDuration()
		setSlideRollTransitionDuration(duration)
		this.updateSlideRollOffset()
		// if (!inline) {
		// 	// this.updateOverlayTransitionDuration()
		// 	this.updateOverlayOpacity(this.props.overlayOpacity)
		// }
		// Transition the slide back to it's original position.
		this.transitionOngoing = true
		this.slideshow.lock()
		this.transitionEndTimer = setTimeout(() => {
			const { isRendered } = this.props
			if (isRendered()) {
				this.onTransitionEnd()
			}
		}, duration)
	}

	onTransitionEnd = () => {
		const { setSlideRollTransitionDuration } = this.props
		// this.transitionDuration = 0
		setSlideRollTransitionDuration(0)
		// this.updateSlideRollTransitionDuration()
		// this.updateOverlayTransitionDuration()
		this.transitionOngoing = false
		this.slideshow.unlock()
	}

	emulatePanResistance(panOffset) {
		return panOffset * Math.exp(-1 - (panOffset / this.slideshowWidth) / 2)
	}

	// updateSlideRollTransitionDuration() {
	// 	const { updateSlideRollTransitionDuration } = this.props
	// 	updateSlideRollTransitionDuration()
	// }

	// getSlideRollTransitionDuration() {
	// 	return this.transitionDuration
	// }

	/**
	 * Moves the slide roll to the "current" slide position.
	 */
	updateSlideRollOffset() {
		const { updateSlideRollOffset } = this.props
		updateSlideRollOffset()
	}

	// updateOverlayTransitionDuration() {
	// 	const { updateOverlayTransitionDuration } = this.props
	// 	updateOverlayTransitionDuration()
	// }

	// getOverlayTransitionDuration() {
	// 	return this.transitionDuration
	// }

	updateOverlayOpacity(opacity) {
		const { setOverlayBackgroundColor } = this.props
		setOverlayBackgroundColor(this.slideshow.getOverlayBackgroundColor(opacity))
	}

	getPanOffsetX() {
		return this.panOffsetX
	}

	getPanOffsetY() {
		return this.panOffsetY
	}
}