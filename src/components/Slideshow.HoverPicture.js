import { getFitSize } from './Picture'
import { getViewportWidth, getViewportHeight } from '../utility/dom'

export default class SlideshowHoverPicture {
	constructor(slideshow) {
		this.slideshow = slideshow
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
			if (getShouldOffsetSlide()) {
				setOffset()
			}
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
		const [slideWidth, slideHeight] = this.getSlideSize()
		const [slideOffsetX, slideOffsetY] = calculateSlideOffset(
			thumbnailImage.getBoundingClientRect(),
			slideWidth,
			slideHeight,
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
}

function calculateSlideOffset(
	thumbnailCoords,
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
	const slideXWhenCentered = (slideshowWidth - slideWidth) / 2
	const slideYWhenCentered = (slideshowHeight - slideHeight) / 2
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
