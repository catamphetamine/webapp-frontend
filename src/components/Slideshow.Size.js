import {
	getViewportWidth,
	getViewportHeightIncludingScaleAndScrollbar
} from '../utility/dom'

export default class SlideshowSize {
	constructor(slideshow, props) {
		this.slideshow = slideshow
		this.props = props

		this.extraMargin = {
			top: props.headerHeight,
			bottom: props.footerHeight
		}

		slideshow.getSlideshowWidth = this.getSlideshowWidth
		slideshow.getSlideshowHeight = this.getSlideshowHeight

		slideshow.getMaxSlideWidth = this.getMaxSlideWidth
		slideshow.getMaxSlideHeight = this.getMaxSlideHeight

		// slideshow.getCurrentSlideMaxWidth = this.getCurrentSlideMaxWidth
		// slideshow.getCurrentSlideMaxHeight = this.getCurrentSlideMaxHeight
		// slideshow.getSlideAspectRatio = this.getSlideAspectRatio

		// slideshow.getCurrentSlideWidth = this.getCurrentSlideWidth
		// slideshow.getCurrentSlideHeight = this.getCurrentSlideHeight

		slideshow.getSlideWidth = this.getSlideWidth
		slideshow.getSlideHeight = this.getSlideHeight

		slideshow.getMargin = this.getMargin
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
			// This won't reflect page zoom in iOS Safari,
			// but there isn't supposed to be any page zoom on mobile devices.
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
			// There aren't supposed to be any horizontal scrollbars,
			// and there isn't supposed to be any page zoom on mobile devices,
			// so `getViewportHeightIncludingScaleAndScrollbar()`
			// will behave same as `getViewportHeight()`.
			// The regular `getViewportHeight()` won't work with iOS Safari's
			// auto-hide/show top/bottom bars feature.
			return getViewportHeightIncludingScaleAndScrollbar()
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
	getSlideMaxWidth = (i) => {
		return Math.min(
			this.getMaxSlideHeight() * this.getSlideAspectRatio(i),
			this.getMaxSlideWidth(),
			this.shouldUpscaleSmallSlides() ? Number.MAX_VALUE : this.getSlideMaxAvailableSize(i).width
		)
	}

	getSlideMaxHeight = (i) => {
		return this.getSlideMaxWidth(i) / this.getSlideAspectRatio(i)
	}

	/**
	 * Returns max slide width.
	 * Doesn't account for slide scale.
	 * @param  {number} i — Slide index.
	 * @return {number}
	 */
	getSlideWidth = (i) => {
		return Math.min(
			this.getSlideMaxWidth(i),
			this.getSlideMaxHeight(i) * this.getSlideAspectRatio(i)
		)
	}

	/**
	 * Returns max slide height.
	 * Doesn't account for slide scale.
	 * @param  {number} i — Slide index.
	 * @return {number}
	 */
	getSlideHeight = (i) => {
		return Math.min(
			this.getSlideMaxHeight(i),
			this.getSlideMaxWidth(i) / this.getSlideAspectRatio(i)
		)
	}

	getSlideAspectRatio(i) {
		const slide = this.slideshow.getSlide(i)
		return this.slideshow.getPluginForSlide(slide).getAspectRatio(slide)
	}

	getSlideMaxAvailableSize(i) {
		const slide = this.slideshow.getSlide(i)
		return this.slideshow.getPluginForSlide(slide).getMaxSize(slide)
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
		const { i } = this.slideshow.state
		const maxSize = this.getSlideMaxAvailableSize(i)
		return maxSize.width >= this.getMaxSlideWidth() * fitFactor ||
			maxSize.height >= this.getMaxSlideHeight() * fitFactor
	}

	/**
	 * Fits the slide on screen (also introduces some margins).
	 * @param  {number} i — Slide index.
	 * @param  {number} scale — Slide scale.
	 * @param  {number} originX — "Gravitate to origin" X.
	 * @param  {number} originY — "Gravitate to origin" Y.
	 * @return {number[]} [offsetX, offsetY]
	 */
	getFittedSlideOffset = (i, scale, originX, originY) => {
		const scaledWidth = scale * this.getSlideWidth(i)
		const scaledHeight = scale * this.getSlideHeight(i)
		const shouldOffsetX = scaledWidth < this.getMaxSlideWidth()
		const shouldOffsetY = scaledHeight < this.getMaxSlideHeight()
		// const originX = this.getSlideshowWidth() / 2 + initialOffsetX
		// const originY = this.getSlideshowHeight() / 2 + initialOffsetY
		let offsetX = 0
		let offsetY = 0
		if (shouldOffsetX) {
			let deltaX = 0
			const left = originX - scaledWidth / 2
			const right = originX + scaledWidth / 2
			if (left < this.getMargin('left')) {
				deltaX = this.getMargin('left') - left
			}
			if (right > this.getSlideshowWidth() - this.getMargin('right')) {
				deltaX = this.getSlideshowWidth() - this.getMargin('right') - right
			}
			const targetOffsetX = originX - this.getSlideshowWidth() / 2
			offsetX = targetOffsetX + deltaX
		}
		if (shouldOffsetY) {
			let deltaY = 0
			const top = originY - scaledHeight / 2
			const bottom = originY + scaledHeight / 2
			if (top < this.getMargin('top')) {
				deltaY = this.getMargin('top') - top
			}
			if (bottom > this.getSlideshowHeight() - this.getMargin('bottom')) {
				deltaY = this.getSlideshowHeight() - this.getMargin('bottom') - bottom
			}
			const targetOffsetY = originY - this.getSlideshowHeight() / 2
			offsetY = targetOffsetY + deltaY
		}
		return [
			offsetX,
			offsetY
		]
	}
}