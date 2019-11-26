// For expand animation, in `PostAttachment.js`, in `onClick`,
// after `setIsLoading(false)` (still before opening the slideshow):
// import { openTransition } from './Slideshow.OpenCloseTransition'
// await openTransition(attachment.picture, thumbnailElement.current)

import { getFitSize, getPreferredSize } from './Picture'
import { calculateSlideCoordinates } from './Slideshow.HoverPicture'
import { getViewportWidth, getViewportHeight, triggerRender } from '../utility/dom'

const OPEN_ANIMATION_LOGARITHM_FACTOR = 5
const OPEN_ANIMATION_PIXELS_PER_SECOND = 2500 // `getViewportWidth()` doesn't play with mobile devices: too slow.

const ANIMATION_MIN_DURATION = 120

// This is a workaround for browsers not playing a CSS transition.
const CSS_TRANSITION_DELAY = 30

export default class SlideshowScaleOpenCloseTransition {
	constructor(slideshow) {
		this.slideshow = slideshow
		slideshow.onCleanUp(this.cleanUp)
	}

	cleanUp = () => {
		clearTimeout(this.openingAnimationTimeout)
		clearTimeout(this.closingAnimationTimeout)
	}

	/**
	 * Can be called when slideshow opens.
	 * @return {Promise}
	 */
	onOpen(slideElement, {
		thumbnailImage
	}) {
		const slide = this.slideshow.getCurrentSlide()
		// const [slideWidth, slideHeight] = this.getSlideSize()
		const slideCoords = slideElement.getBoundingClientRect()
		const slideX = slideCoords.x
		const slideY = slideCoords.y
		const slideWidth = slideCoords.width
		const slideHeight = slideCoords.height
		const {
			animationDuration,
			promise,
			timeout
		} = openTransition(
			getPreferredSize(slide.picture, slideWidth).url,
			thumbnailImage,
			slideX,
			slideY,
			slideWidth,
			slideHeight,
			this.slideshow.getMargin
		)
		this.openingAnimationTimeout = timeout
		slideElement.style.opacity = 0
		return {
			animationDuration,
			promise: promise.then(() => {
				// { clearThumbnailOverlay }
				// clearThumbnailImageOverlay.current = clearThumbnailOverlay
				slideElement.style.opacity = 1
			})
		}
	}

	/**
	 * Can be called when slideshow closes.
	 * @return {Promise}
	 */
	onClose(slideElement, {
		thumbnailImage
	}) {
		const {
			animationDuration,
			promise,
			timeout
		} = closeTransition(
			thumbnailImage,
			slideElement
		)
		this.closingAnimationTimeout = timeout
		slideElement.style.opacity = 0
		return {
			animationDuration,
			promise
		}
	}

	getSlideSize = () => {
		return getFitSize(
			this.slideshow.getCurrentSlide().picture,
			this.slideshow.getMaxSlideWidth(),
			this.slideshow.getMaxSlideHeight()
		)
	}
}

/**
 * Zooms in on opening an image in Slideshow.
 * @param  {String} expandedPictureUrl
 * // @param  {object} picture
 * @param  {Element} thumbnailElement
 * // @param  {Element} [expandedImageElement] — Will be hidden until the animation finishes.
 * @return {Promise}
 */
function openTransition(
	// picture,
	expandedPictureUrl,
	thumbnailElement,
	// expandedImageElement,
	slideX,
	slideY,
	slideWidth,
	slideHeight,
	getMargin
) {
	const slideshowWidth = getViewportWidth()
	const slideshowHeight = getViewportHeight()

	const thumbnailCoords = thumbnailElement.getBoundingClientRect()
	const thumbnailWidth = thumbnailElement.width
	const thumbnailHeight = thumbnailElement.height
	const thumbnailX = thumbnailCoords.left
	const thumbnailY = thumbnailCoords.top

	// Calculating slide coordinates like this results
	// in a buggy behavior in iOS Safari and Chrome,
	// presumably because their `getViewportHeight()`
	// returns some incorrect values due to the
	// appearing/disappearing top/bottom panels,
	// or maybe their fullscreen flex align center
	// positioning is different from `getViewportHeight() / 2`
	// because of the same reason.
	// const [slideX, slideY] = calculateSlideCoordinates(
	// 	thumbnailCoords,
	// 	slideWidth,
	// 	slideHeight,
	// 	slideshowWidth,
	// 	slideshowHeight,
	// 	getMargin
	// )

	// const travelDistanceTopLeft = calculateDistance(
	// 	thumbnailX,
	// 	thumbnailY,
	// 	slideX,
	// 	slideY
	// )

	// const travelDistanceTopRight = calculateDistance(
	// 	thumbnailX + thumbnailWidth,
	// 	thumbnailY,
	// 	slideX + slideWidth,
	// 	slideY
	// )

	// const travelDistanceBottomLeft = calculateDistance(
	// 	thumbnailX,
	// 	thumbnailY + thumbnailHeight,
	// 	slideX,
	// 	slideY + slideHeight
	// )

	// const travelDistanceBottomRight = calculateDistance(
	// 	thumbnailX + thumbnailWidth,
	// 	thumbnailY + thumbnailHeight,
	// 	slideX + slideWidth,
	// 	slideY + slideHeight
	// )

	// const travelDistance = (
	// 	travelDistanceTopLeft +
	// 	travelDistanceTopRight +
	// 	travelDistanceBottomLeft +
	// 	travelDistanceBottomRight
	// ) / 4

	// let animationDuration = travelDistance / OPEN_ANIMATION_PIXELS_PER_SECOND
	// animationDuration = ANIMATION_MIN_DURATION + 1000 * Math.log(1 + animationDuration * OPEN_ANIMATION_LOGARITHM_FACTOR) / OPEN_ANIMATION_LOGARITHM_FACTOR

	let animationDuration = Math.max(slideWidth - thumbnailWidth, slideHeight - thumbnailHeight) / OPEN_ANIMATION_PIXELS_PER_SECOND
	animationDuration = ANIMATION_MIN_DURATION + 1000 * Math.log(1 + animationDuration * 1) / 1

	// thumbnailElement.style.opacity = 0.25

	// thumbnailElement.parentNode.style.position = 'relative'

	// const thumbnailImagePlaceholder = document.createElement('div')
	// // "position: fixed" gets in the way of floating headers.
	// // thumbnailImagePlaceholder.style.position = 'fixed'
	// // thumbnailImagePlaceholder.style.left = thumbnailX + 'px'
	// // thumbnailImagePlaceholder.style.top = thumbnailY + 'px'
	// thumbnailImagePlaceholder.style.position = 'absolute'
	// thumbnailImagePlaceholder.style.left = '0'
	// thumbnailImagePlaceholder.style.top = '0'
	// thumbnailImagePlaceholder.style.width = thumbnailWidth + 'px'
	// thumbnailImagePlaceholder.style.height = thumbnailHeight + 'px'
	// thumbnailImagePlaceholder.style.backgroundColor = 'var(--Picture-borderColor--focus)'
	// thumbnailImagePlaceholder.style.opacity = 0.35
	// thumbnailElement.parentNode.appendChild(thumbnailImagePlaceholder)

	// A copy of thumbnail image is created and animated
	// along with the expanded image, because without it
	// the sudden transition between the thumbnail and
	// the scaled down expanded image would be noticeable
	// with the thumbnail being more blurry and the
	// scaled down expanded image being more sharp.
	const thumbnailImageCopy = document.createElement('img')
	thumbnailImageCopy.width = thumbnailWidth
	thumbnailImageCopy.height = thumbnailHeight
	thumbnailImageCopy.src = thumbnailElement.src
	thumbnailImageCopy.style.transform = `translateX(${thumbnailX}px) translateY(${thumbnailY}px)`
	thumbnailImageCopy.style.transformOrigin = 'top left'
	thumbnailImageCopy.style.position = 'fixed'
	thumbnailImageCopy.style.left = '0'
	thumbnailImageCopy.style.top = '0'
	thumbnailImageCopy.style.transition = `transform ${animationDuration}ms`
	document.body.appendChild(thumbnailImageCopy)

	// if (expandedImageElement) {
	// 	expandedImageElement.style.opacity = 0
	// }

	// A copy of the current slide image is created
	// and animated, because it's animated along with
	// the copy of the thumbnail image.
	// If the current slide image was animated directly
	// then it would be unobvious how to set up the correct
	// `z-index`es so that the expanded image is shown
	// above the thumbnail image copy.
	// By creating a copy of the current slide image
	// `z-index`es are automatically correct
	// (both elements are appended to `<body/>`).
	const expandedImage = document.createElement('img')
	expandedImage.width = slideWidth
	expandedImage.height = slideHeight
	expandedImage.src = expandedPictureUrl // expandedPictureSize.url
	expandedImage.style.transform = `scaleX(${thumbnailWidth / slideWidth}) scaleY(${thumbnailHeight / slideHeight}) translateX(${thumbnailX * (slideWidth / thumbnailWidth)}px) translateY(${thumbnailY * (slideHeight / thumbnailHeight)}px)`
	expandedImage.style.transformOrigin = 'top left'
	expandedImage.style.position = 'fixed'
	expandedImage.style.left = '0'
	expandedImage.style.top = '0'
	expandedImage.style.zIndex = 'var(--Slideshow-zIndex)'
	expandedImage.style.opacity = 0
	expandedImage.style.boxShadow = 'var(--SlideshowSlide-boxShadow)'
	expandedImage.style.transition = `transform ${animationDuration}ms, box-shadow ${animationDuration}ms, opacity ${ANIMATION_MIN_DURATION}ms`
	document.body.appendChild(expandedImage)

	// const [slideOffsetX, slideOffsetY] = calculateSlideOffset(
	// 	slideX,
	// 	slideY,
	//  slideWidth,
	// 	slideHeight
	// )

	// Run CSS transitions.
	triggerRender(expandedImage)
	triggerRender(thumbnailImageCopy)
	expandedImage.style.opacity = 1
	expandedImage.style.transform = `translateX(${slideX}px) translateY(${slideY}px)`
	thumbnailImageCopy.style.transform = `scaleX(${slideWidth / thumbnailWidth}) scaleY(${slideHeight / thumbnailHeight}) translateX(${slideX * (thumbnailWidth / slideWidth)}px) translateY(${slideY * (thumbnailHeight / slideHeight)}px)`
	let timeout
	const promise = new Promise((resolve) => {
		timeout = setTimeout(() => {
			document.body.removeChild(thumbnailImageCopy)
			// if (expandedImageElement) {
				document.body.removeChild(expandedImage)
			// }
			resolve()
			// resolve({
			// 	clearThumbnailOverlay: () => thumbnailElement.parentNode.removeChild(thumbnailImagePlaceholder)
			// })
		}, animationDuration)
	})

	return {
		animationDuration,
		// slideOffsetX,
		// slideOffsetY,
		promise,
		timeout
	}
}

/**
 * Zooms out on closing an image in Slideshow.
 * @param  {Element} thumbnailElement
 * @param  {Element} slideElement
 * @return {Promise}
 */
function closeTransition(
	thumbnailElement,
	slideElement
) {
	const thumbnailCoords = thumbnailElement.getBoundingClientRect()
	const thumbnailWidth = thumbnailElement.width
	const thumbnailHeight = thumbnailElement.height
	const thumbnailX = thumbnailCoords.left
	const thumbnailY = thumbnailCoords.top

	const slideCoords = slideElement.getBoundingClientRect()
	const slideWidth = slideCoords.width
	const slideHeight = slideCoords.height
	const slideX = slideCoords.left
	const slideY = slideCoords.top

	let animationDuration = Math.max(slideWidth - thumbnailWidth, slideHeight - thumbnailHeight) / OPEN_ANIMATION_PIXELS_PER_SECOND
	animationDuration = ANIMATION_MIN_DURATION + 1000 * Math.log(1 + animationDuration * 1) / 1

	const thumbnailImageCopy = document.createElement('img')
	thumbnailImageCopy.width = thumbnailWidth
	thumbnailImageCopy.height = thumbnailHeight
	thumbnailImageCopy.src = thumbnailElement.src
	thumbnailImageCopy.style.transform = `scaleX(${slideWidth / thumbnailWidth}) scaleY(${slideHeight / thumbnailHeight}) translateX(${slideX * (thumbnailWidth / slideWidth)}px) translateY(${slideY * (thumbnailHeight / slideHeight)}px)`
	thumbnailImageCopy.style.transformOrigin = 'top left'
	thumbnailImageCopy.style.position = 'fixed'
	thumbnailImageCopy.style.left = '0'
	thumbnailImageCopy.style.top = '0'
	thumbnailImageCopy.style.transition = `transform ${animationDuration}ms`
	document.body.appendChild(thumbnailImageCopy)

	const expandedImage = document.createElement('img')
	expandedImage.width = slideWidth
	expandedImage.height = slideHeight
	expandedImage.src = slideElement.querySelector('img').src
	expandedImage.style.transform = `translateX(${slideX}px) translateY(${slideY}px)`
	expandedImage.style.transformOrigin = 'top left'
	expandedImage.style.position = 'fixed'
	expandedImage.style.left = '0'
	expandedImage.style.top = '0'
	expandedImage.style.zIndex = 'var(--Slideshow-zIndex)'
	expandedImage.style.opacity = 1
	expandedImage.style.boxShadow = 'var(--SlideshowSlide-boxShadow)'
	expandedImage.style.transition = `transform ${animationDuration}ms, box-shadow ${animationDuration}ms, opacity ${ANIMATION_MIN_DURATION}ms`
	document.body.appendChild(expandedImage)

	// Run CSS transitions.
	triggerRender(expandedImage)
	triggerRender(thumbnailImageCopy)
	expandedImage.style.opacity = 0
	expandedImage.style.transform = `scaleX(${thumbnailWidth / slideWidth}) scaleY(${thumbnailHeight / slideHeight}) translateX(${thumbnailX * (slideWidth / thumbnailWidth)}px) translateY(${thumbnailY * (slideHeight / thumbnailHeight)}px)`
	thumbnailImageCopy.style.transform = `translateX(${thumbnailX}px) translateY(${thumbnailY}px)`
	let timeout
	const promise = new Promise((resolve) => {
		timeout = setTimeout(() => {
			document.body.removeChild(thumbnailImageCopy)
			document.body.removeChild(expandedImage)
			resolve()
		}, animationDuration)
	})

	return {
		animationDuration,
		// slideOffsetX,
		// slideOffsetY,
		promise,
		timeout
	}
}

function calculateDistance(x1, y1, x2, y2) {
	return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1))
}