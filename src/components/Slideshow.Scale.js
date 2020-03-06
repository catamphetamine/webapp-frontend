export default class SlideshowScale {
	constructor(slideshow, props) {
		this.slideshow = slideshow
		this.props = props
	}

	/**
	 * Returns a preferred initial scale for a slide depending on the slideshow element size.
	 * @param  {object} slide
	 * @return {number}
	 */
	getScaleForSlide(slide) {
		const plugin = this.slideshow.getPluginForSlide(slide)
		const minInitialScale = plugin.minInitialScale
		if (!minInitialScale) {
			return 1
		}
		const maxWidth = this.slideshow.getMaxSlideWidth()
		const maxHeight = this.slideshow.getMaxSlideHeight()
		const maxSize = plugin.getMaxSize(slide)
		const widthRatio = maxSize.width / maxWidth
		const heightRatio = maxSize.height / maxHeight
		const ratio = Math.min(widthRatio, heightRatio)
		if (ratio < minInitialScale) {
			const largerScale = minInitialScale / ratio
			const maxScale = 1 / Math.max(widthRatio, heightRatio)
			return Math.min(largerScale, maxScale)
		}
		return 1
	}

	scaleUp = (scale, scaleStep, factor = 1) => {
		return Math.min(
			scale * (1 + scaleStep * factor),
			this.getCurrentSlideMaxScale()
		)
	}

	scaleDown = (scale, scaleStep, factor = 1) => {
		scale = scale / (1 + scaleStep * factor)
		return Math.max(
			scale,
			// Won't scale down past the original 1:1 size.
			// (for non-vector images)
			this.getMinScaleForCurrentSlide(scale)
		)
	}

	scaleToggle = (scale) => {
		// Compensates math precision (is supposed to).
		return scale > 0.99 && scale < 1.01 ? this.getCurrentSlideMaxScale() : 1
	}

	zoom(scaleBeforeZoom, zoomFactor) {
		const scale = scaleBeforeZoom * zoomFactor
		return Math.max(
			Math.min(scale, this.getCurrentSlideMaxScale()),
			this.getMinScaleForCurrentSlide(scale)
		)
	}

	getCurrentSlideMaxScale() {
		const fullScreenWidthScale = this.slideshow.getMaxSlideWidth() / this.slideshow.getCurrentSlideMaxWidth()
		const fullScreenHeightScale = this.slideshow.getMaxSlideHeight() / this.slideshow.getCurrentSlideMaxHeight()
		return Math.min(fullScreenWidthScale, fullScreenHeightScale)
	}

	// Won't scale down past the original 1:1 size.
	// (for non-vector images)
	getMinScaleForCurrentSlide(scale) {
		const { minScaledSlideRatio } = this.props
		// if (this.getPluginForSlide().isScaleDownAllowed) {
		// 	if (!this.getPluginForSlide().isScaleDownAllowed(this.getCurrentSlide())) {
		// 		return 1
		// 	}
		// }
		const slideWidthRatio = this.slideshow.getCurrentSlideMaxWidth() / this.slideshow.getMaxSlideWidth()
		const slideHeightRatio = this.slideshow.getCurrentSlideMaxHeight() / this.slideshow.getMaxSlideHeight()
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
}