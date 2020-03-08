import {
	getViewportWidth
} from '../utility/dom'

export default class OpenClose {
	constructor(slideshow) {
		this.slideshow = slideshow
		this.slideshow.animateOpenClose = this.animateOpenClose
	}

	static getInitialProps(props) {
		const {
			i,
			children: slides,
			mode,
			smallScreenMaxWidth,
			overlayOpacitySmallScreen,
			animateOpenCloseSmallScreen,
			animateOpenCloseScaleSmallScreen,
			animateOpenCloseOnPanOut,
			overlayOpacityFlowMode,
			overlayOpacity: defaultOverlayOpacity,
			// `SlideshowHoverPicture.getInitialProps()` is supposed to be
			// called before `SlideshowOpenClose.getInitialProps()`.
			thumbnailImage
		} = props

		let {
			animateOpenClose,
			animateOpenCloseScale
		} = props

		const animateOpen = animateOpenClose
		const animateClose = animateOpenClose || animateOpenCloseOnPanOut

		let overlayOpacity = mode === 'flow' && typeof overlayOpacityFlowMode !== undefined ?
			overlayOpacityFlowMode :
			defaultOverlayOpacity

		const slide = slides[i]
		const canAnimateScaleOpenClose =
			slide.type === 'picture' &&
			// Don't animate opening animated GIFs
			// because they can't be paused until they're expanded.
			// Considering that "scale" animation fades between
			// the enlarged preview and the original image
			// it could result in minor visual inconsistencies.
			slide.picture.type !== 'image/gif' &&
			thumbnailImage ? true : false

		animateOpenCloseScale = canAnimateScaleOpenClose && animateOpenCloseScale

		if (typeof window !== 'undefined' && smallScreenMaxWidth !== undefined) {
			if (getViewportWidth() <= smallScreenMaxWidth) {
				if (!animateOpenCloseScale && animateOpenCloseScaleSmallScreen && canAnimateScaleOpenClose) {
					animateOpenCloseScale = true
				}
				if (overlayOpacitySmallScreen !== undefined) {
					overlayOpacity = overlayOpacitySmallScreen
				}
				if (!animateOpenClose && animateOpenCloseSmallScreen) {
					animateOpenClose = true
				}
			}
		}

		return {
			...props,
			overlayOpacity,
			animateOpenClose,
			animateOpenCloseScale,
			animateOpen,
			animateClose
		}
	}

	animateOpenClose = () => {
		const {
			i,
			animateOpen,
			animateClose,
			animateOpenClose,
			animateOpenCloseOnPanOut,
			animateOpenCloseScale,
			getSlideDOMNode,
			thumbnailImage,
			shouldOffsetSlide
		} = this.slideshow.props
		if (animateOpen || animateClose) {
			let slideOffsetX
			let slideOffsetY
			if (this.slideshow.shouldOffsetSlide) {
				const result = this.slideshow.applySlideOffset()
				slideOffsetX = result[0]
				slideOffsetY = result[1]
			}
			let _promise = Promise.resolve()
			if (animateOpen) {
				const transition = animateOpenCloseScale ? this.slideshow.scaleOpenCloseTransition : this.slideshow.openCloseTransition
				const {
					animationDuration,
					promise
				} = transition.onOpen(
					getSlideDOMNode(),
					{
						thumbnailImage,
						slideOffsetX,
						slideOffsetY
					}
				)
				this.slideshow.setState({
					openingAnimationDuration: animationDuration,
					hasStartedOpening: true
				})
				this.slideshow.lock()
				_promise = promise.then(() => {
					this.slideshow.setState({
						hasFinishedOpening: true
					})
					this.slideshow.unlock()
				})
			}
			_promise.then(() => {
				this.slideshow.onCloseAnimation(({ interaction }) => {
					let transition
					if (animateOpenCloseScale) {
						// Close the initially opened slide via a "scale" animation
						// if it was opened via a "scale" animation, even if slides
						// were navigated through in the process.
						if (shouldOffsetSlide && this.slideshow.getState().i === i) {
							transition = this.slideshow.scaleOpenCloseTransition
						} else {
							// Fall back to the default open/close transition
							// if the original slide has already been changed.
							transition = this.slideshow.openCloseTransition
						}
					} else {
						if (animateOpenClose || (animateOpenCloseOnPanOut && interaction === 'pan')) {
							transition = this.slideshow.openCloseTransition
						}
					}
					if (!transition) {
						return
					}
					this.slideshow.setState({
						hasStartedClosing: true
					})
					const {
						animationDuration,
						promise
					} = transition.onClose(
						getSlideDOMNode(),
						{
							thumbnailImage,
							slideImage: getSlideDOMNode().querySelector('img')
						}
					)
					this.slideshow.setState({
						closingAnimationDuration: animationDuration
					})
					promise.then(() => {
						this.slideshow.setState({
							hasFinishedClosing: true
						})
					})
					return {
						animationDuration,
						promise
					}
				})
			})
		}
	}

	getInitialState() {
		const {
			animateOpen,
			animateClose
		} = this.slideshow.props
		return {
			hasStartedOpening: animateOpen ? false : true,
			hasFinishedOpening: animateOpen ? false : true,
			hasStartedClosing: animateClose ? false : true,
			hasFinishedClosing: animateClose ? false : true
		}
	}
}