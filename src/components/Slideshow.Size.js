import {
	getViewportWidth,
	getViewportHeight,
	// getScrollBarWidth
} from '../utility/dom'

export default class SlideshowSize {
	constructor(slideshow, props) {
		this.slideshow = slideshow
		this.props = props
		this.extraMargin = {
			top: props.headerHeight,
			bottom: props.footerHeight
		}
	}

	getMaxSlideWidth = () => {
		return this.getSlideshowWidth() - this.getMargin('left') - this.getMargin('right')
	}

	getMaxSlideHeight = () => {
		return this.getSlideshowHeight() - this.getMargin('top') - this.getMargin('bottom')
	}

	getSlideshowWidth = () => {
		const {
			isRendered,
			getWidth,
			inline
		} = this.props
		if (!inline) {
			return getViewportWidth()
		}
		if (isRendered() && getWidth) {
			return getWidth()
		}
		throw new Error('Slideshow not rendered')
	}

	getSlideshowHeight = () => {
		const {
			isRendered,
			getHeight,
			inline
		} = this.props
		if (!inline) {
			return getViewportHeight()
		}
		if (isRendered() && getHeight) {
			return getHeight()
		}
		throw new Error('Slideshow not rendered')
	}

	shouldUpscaleSmallSlides() {
		const { inline } = this.props
		return inline
	}

	// This is used for `<Picture/>` with `fit="contain"`.
	getSlideWidth = () => {
		return Math.min(
			this.getMaxSlideHeight() * this.getSlideAspectRatio(),
			this.getMaxSlideWidth(),
			this.shouldUpscaleSmallSlides() ? Number.MAX_VALUE : this.getSlideMaxAvailableSize().width
		)
	}

	getSlideHeight = () => {
		return this.getSlideWidth() / this.getSlideAspectRatio()
	}

	getSlideAspectRatio() {
		return this.slideshow.getPluginForSlide().getAspectRatio(this.slideshow.getCurrentSlide())
	}

	getSlideMaxAvailableSize() {
		return this.slideshow.getPluginForSlide().getMaxSize(this.slideshow.getCurrentSlide())
	}

	getMargin = (edge) => {
		const { inline, margin: marginRatio, minMargin } = this.props
		if (inline) {
			return 0
		}
		const extraMargin = edge ? this.extraMargin[edge] || 0 : 0
		return Math.max(
			marginRatio * Math.min(
				this.getSlideshowWidth(),
				this.getSlideshowHeight()
			),
			minMargin + extraMargin
		)
	}

	/**
	 * Scale buttons won't be shown if a slide is large enough
	 * to be considered a "max size" slide.
	 * @param  {Boolean} precise — The slide must be at least as large as one of the slideshow's dimensions.
	 * @return {Boolean} [isMaxSizeSlide]
	 */
	isMaxSizeSlide(precise = true) {
		const { isRendered, fullScreenFitPrecisionFactor } = this.props
		// No definite answer (`true` or `false`) could be
		// given until slideshow dimensions are known.
		if (!isRendered) {
			return
		}
		const fitFactor = precise ? 1 : fullScreenFitPrecisionFactor
		const maxSize = this.getSlideMaxAvailableSize()
		return maxSize.width >= this.getMaxSlideWidth() * fitFactor ||
			maxSize.height >= this.getMaxSlideHeight() * fitFactor
	}
}