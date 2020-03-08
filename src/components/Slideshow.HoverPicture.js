import { getFitSize } from './Picture'
import { getViewportWidth, getViewportHeight } from '../utility/dom'

export default class SlideshowHoverPicture {
	constructor(slideshow) {
		this.slideshow = slideshow
		this.slideshow.applySlideOffset = this.applySlideOffset
		slideshow.onSlideChange(this.resetState)
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

		return {
			...props,
			thumbnailImage,
			shouldOffsetSlide
		}
	}

	/**
	 * @return {number[]} `[slideOffsetX, slideOffsetY]`
	 */
	onOpen(slideDOMNode, {
		thumbnailImage,
		getShouldOffsetSlide,
		setSlideOffset
	}) {
		const setOffset = () => {
			return this.setSlideOffset(slideDOMNode, {
				thumbnailImage,
				setSlideOffset
			})
		}
		this.slideshow.onRerender(() => {
			// if (getShouldOffsetSlide()) {
			// 	setOffset()
			// }
			// Reset slide offset on window resize.
			slideDOMNode.style.transform = 'none'
			setSlideOffset(0, 0)
		})
		return setOffset()
	}

	getSlideSize = () => {
		return getFitSize(
			this.slideshow.getCurrentSlide().picture,
			this.slideshow.getMaxSlideWidth(),
			this.slideshow.getMaxSlideHeight()
		)
	}

	setSlideOffset(slideDOMNode, {
		thumbnailImage,
		setSlideOffset
	}) {
		const slideCoords = slideDOMNode.getBoundingClientRect()
		// const [slideWidth, slideHeight] = this.getSlideSize()
		const [slideOffsetX, slideOffsetY] = calculateSlideOffset(
			thumbnailImage.getBoundingClientRect(),
			slideCoords.x,
			slideCoords.y,
			slideCoords.width,
			slideCoords.height,
			// slideWidth,
			// slideHeight,
			this.slideshow.getMargin
		)
		// slideDOMNode.style.left = slideOffsetX + 'px'
		// slideDOMNode.style.top = slideOffsetY + 'px'
		slideDOMNode.style.transform = `translateX(${slideOffsetX}px) translateY(${slideOffsetY}px)`
		setSlideOffset(slideOffsetX, slideOffsetY)
		// setSlideOffsetX(slideOffsetX)
		// setSlideOffsetY(slideOffsetY)
		return [slideOffsetX, slideOffsetY]
	}

	getInitialState() {
		const { i, shouldOffsetSlide } = this.slideshow.props
		return {
			slideOffsetX: shouldOffsetSlide ? 0 : undefined,
			slideOffsetY: shouldOffsetSlide ? 0 : undefined,
			slideOffsetIndex: shouldOffsetSlide ? i : undefined
		}
	}

	resetState = () => {
		this.slideshow.setState({
			slideOffsetIndex: undefined,
			slideOffsetX: undefined,
			slideOffsetY: undefined
		})
	}

	applySlideOffset = () => {
		const { getSlideDOMNode, thumbnailImage } = this.slideshow.props
		this.slideshow.onSlideChange(() => {
			if (this.slideshow.shouldOffsetSlide) {
				this.slideshow.shouldOffsetSlide = false
				this.resetState()
			}
		})
		return this.onOpen(getSlideDOMNode(), {
			thumbnailImage,
			// Not using `useState()` for `shouldOffsetSlide`
			// because the updated state value wouldn't be accessible
			// from within the Slideshow.
			getShouldOffsetSlide: () => this.slideshow.shouldOffsetSlide,
			setSlideOffset: (x, y) => {
				this.slideshow.setState({
					slideOffsetX: x,
					slideOffsetY: y
				})
			}
		})
	}
}

function calculateSlideOffset(
	thumbnailCoords,
	slideXWhenCentered,
	slideYWhenCentered,
	slideWidth,
	slideHeight,
	getMargin
) {
	const slideshowWidth = getViewportWidth()
	const slideshowHeight = getViewportHeight()
	const [slideX, slideY] = calculateSlideCoordinates(
		thumbnailCoords,
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
	// Round coordinates. // upto 4 decimal place.
	// Small numbers could be printed as `1.2345e-50` unless rounded.
	return [
		Math.round(slideOffsetX), // .toFixed(4),
		Math.round(slideOffsetY) // .toFixed(4)
	]
}

export function calculateSlideCoordinates(
	thumbnailCoords,
	slideWidth,
	slideHeight,
	slideshowWidth,
	slideshowHeight,
	getMargin
) {
	const { x, y, width, height } = thumbnailCoords

	// const slideshowWidth = getViewportWidth()
	// const slideshowHeight = getViewportHeight()

	const xCenter = x + width / 2
	const yCenter = y + height / 2

	let slideX = xCenter - slideWidth / 2
	let slideY = yCenter - slideHeight / 2

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
