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
	getCurrentSlideMaxWidth = () => {
		return Math.min(
			this.getMaxSlideHeight() * this.getSlideAspectRatio(),
			this.getMaxSlideWidth(),
			this.shouldUpscaleSmallSlides() ? Number.MAX_VALUE : this.getSlideMaxAvailableSize().width
		)
	}

	getCurrentSlideMaxHeight = () => {
		return this.getCurrentSlideMaxWidth() / this.getSlideAspectRatio()
	}

	getCurrentSlideWidth = () => {
		return Math.min(
			this.getCurrentSlideMaxWidth(),
			this.getCurrentSlideMaxHeight() * this.getSlideAspectRatio()
		)
	}

	getCurrentSlideHeight = () => {
		return Math.min(
			this.getCurrentSlideMaxHeight(),
			this.getCurrentSlideMaxWidth() / this.getSlideAspectRatio()
		)
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

	getSlideOffset = (scale, slideOffsetX, slideOffsetY) => {
		const scaledWidth = scale * this.getCurrentSlideWidth()
		const scaledHeight = scale * this.getCurrentSlideHeight()
		const originX = this.getSlideshowWidth() / 2 + slideOffsetX
		const originY = this.getSlideshowHeight() / 2 + slideOffsetY
		const left = originX - scaledWidth / 2
		const right = originX + scaledWidth / 2
		const top = originY - scaledHeight / 2
		const bottom = originY + scaledHeight / 2
		let deltaX = 0
		let deltaY = 0
		if (left < this.getMargin('left')) {
			deltaX = this.getMargin('left') - left
		}
		if (right > this.getSlideshowWidth() - this.getMargin('right')) {
			deltaX = this.getSlideshowWidth() - this.getMargin('right') - right
		}
		if (top < this.getMargin('top')) {
			deltaY = this.getMargin('top') - top
		}
		if (bottom > this.getSlideshowHeight() - this.getMargin('bottom')) {
			deltaY = this.getSlideshowHeight() - this.getMargin('bottom') - bottom
		}
		let correctedSlideOffsetX = slideOffsetX + deltaX
		if (scaledWidth >= this.getMaxSlideWidth()) {
			correctedSlideOffsetX = 0
		}
		let correctedSlideOffsetY = slideOffsetY + deltaY
		if (scaledHeight >= this.getMaxSlideHeight()) {
			correctedSlideOffsetY = 0
		}
		return [correctedSlideOffsetX, correctedSlideOffsetY]
	}
}