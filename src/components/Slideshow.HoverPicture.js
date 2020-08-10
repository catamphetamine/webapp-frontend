import { getFitSize } from './Picture'
import { roundScreenPixels } from '../utility/round'

export default class SlideshowHoverPicture {
	constructor(slideshow) {
		this.slideshow = slideshow
		this.slideshow.applySlideOffset = this.applySlideOffset
	}

	static getInitialProps(props) {
		// Get `thumbnailImage`.
		let { thumbnailImage } = props
		if (thumbnailImage) {
			if (thumbnailImage.tagName.toLowerCase() !== 'img') {
				thumbnailImage = thumbnailImage.querySelector('img')
			}
		}

		// All pictures (including animated GIFs) are opened above their thumbnails.
		const {
			i,
			children: slides
		} = props
		const slide = slides[i]
		const shouldOffsetSlide = thumbnailImage && slide.type === 'picture'

		const thumbnailCoords = thumbnailImage && thumbnailImage.getBoundingClientRect()

		return {
			...props,
			thumbnailImage,
			thumbnailCoords,
			shouldOffsetSlide
		}
	}

	getSlideSize = () => {
		return getFitSize(
			this.slideshow.getCurrentSlide().picture,
			this.slideshow.getMaxSlideWidth(),
			this.slideshow.getMaxSlideHeight()
		)
	}

	dontOffsetSlide = () => {
		// this.slideshow.shouldOffsetSlide = false
		this.slideshow.setState({
			offsetSlideIndex: undefined,
			slideOriginX: undefined,
			slideOriginY: undefined
		})
	}

	applySlideOffset = () => {
		const { getSlideDOMNode } = this.slideshow.props
		this.slideshow.onSlideChange(() => {
			const { offsetSlideIndex } = this.slideshow.getState()
			if (offsetSlideIndex !== undefined) {
				this.dontOffsetSlide()
			}
		}, { once: true })
		this.slideshow.onResize(() => {
			// Reset slide offset on window resize.
			getSlideDOMNode().style.transform = 'none'
			this.dontOffsetSlide()
		})
		return this.calculateAndApplySlideOffset(getSlideDOMNode())
	}

	/**
	 * @return {number[]} `[x, y]`
	 */
	applySlideOrigin() {
		const { i, thumbnailCoords } = this.slideshow.props
		const { x, y, width, height } = thumbnailCoords
		const originX = x + width / 2
		const originY = y + height / 2
		this.slideshow.setState({
			offsetSlideIndex: i,
			slideOriginX: originX,
			slideOriginY: originY
		})
		return [originX, originY]
	}

	/**
	 * @return {number[]} `[offsetX, offsetY]`
	 */
	calculateAndApplySlideOffset(slideDOMNode) {
		const [originX, originY] = this.applySlideOrigin()
		const slideCoords = slideDOMNode.getBoundingClientRect()
		const [slideOffsetX, slideOffsetY] = calculateSlideOffset(
			originX,
			originY,
			slideCoords.x,
			slideCoords.y,
			slideCoords.width,
			slideCoords.height,
			this.slideshow.getSlideshowWidth(),
			this.slideshow.getSlideshowHeight(),
			this.slideshow.getMargin
		)
		slideDOMNode.style.transform = `translateX(${roundScreenPixels(slideOffsetX)}px) translateY(${roundScreenPixels(slideOffsetY)}px)`
		return [slideOffsetX, slideOffsetY]
	}
}

function calculateSlideOffset(
	originX,
	originY,
	slideXWhenCentered,
	slideYWhenCentered,
	slideWidth,
	slideHeight,
	slideshowWidth,
	slideshowHeight,
	getMargin
) {
	const [slideX, slideY] = calculateSlideCoordinates(
		originX,
		originY,
		slideWidth,
		slideHeight,
		slideshowWidth,
		slideshowHeight,
		getMargin
	)
	// Calculating slide coordinates like this results
	// in a buggy behavior in iOS Safari and Chrome,
	// presumably because their `getViewportHeight()`
	// returns some incorrect values due to the
	// appearing/disappearing top/bottom panels,
	// or maybe their fullscreen flex align center
	// positioning is different from `getViewportHeight() / 2`
	// because of the same reason.
	// const slideXWhenCentered = (slideshowWidth - slideWidth) / 2
	// const slideYWhenCentered = (slideshowHeight - slideHeight) / 2
	const slideOffsetX = slideX - slideXWhenCentered
	const slideOffsetY = slideY - slideYWhenCentered
	// // Round coordinates. // upto 4 decimal place.
	// // Small numbers could be printed as `1.2345e-50` unless rounded.
	return [
		slideOffsetX,
		slideOffsetY
	]
}

export function calculateSlideCoordinates(
	originX,
	originY,
	slideWidth,
	slideHeight,
	slideshowWidth,
	slideshowHeight,
	getMargin
) {
	let slideX = originX - slideWidth / 2
	let slideY = originY - slideHeight / 2
	if (slideX < getMargin('left')) {
		slideX = getMargin('left')
	}
	if (slideX + slideWidth > slideshowWidth - getMargin('right')) {
		slideX = (slideshowWidth - getMargin('right')) - slideWidth
	}
	if (slideY < getMargin('top')) {
		slideY = getMargin('top')
	}
	if (slideY + slideHeight > slideshowHeight - getMargin('bottom')) {
		slideY = (slideshowHeight - getMargin('bottom')) - slideHeight
	}
	return [slideX, slideY]
}
