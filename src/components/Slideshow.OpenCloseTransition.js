import { triggerRender } from '../utility/dom'

const SCALE = 0.95
const ANIMATION_DURATION = 120

export default class OpenCloseTransition {
	constructor(slideshow) {
		this.slideshow = slideshow
	}

	onOpen(slideElement, { slideOffsetX, slideOffsetY }) {
		const slideWidth = slideElement.offsetWidth
		const slideHeight = slideElement.offsetHeight
		let transform = `scale(${SCALE})`
		if (slideOffsetX !== undefined) {
			transform += ` translateX(${slideOffsetX - slideWidth * (1 - SCALE) / 2}px) translateY(${slideOffsetY - slideHeight * (1 - SCALE) / 2}px)`
		}
		slideElement.style.transform = transform
		slideElement.style.opacity = 0
		triggerRender(slideElement)
		slideElement.style.transition = `transform ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms`
		slideElement.style.transform = 'none'
		slideElement.style.opacity = 1
		return {
			animationDuration: ANIMATION_DURATION,
			promise: timeoutPromise(ANIMATION_DURATION)
		}
	}

	onClose(slideElement) {
		// Preserves the current `translateX()` and `translateY()`.
		let transform = slideElement.style.transform
		if (!transform || transform === 'none') {
			transform = ''
		}
		transform += `scale(${SCALE})`
		slideElement.style.transition = `transform ${ANIMATION_DURATION}ms, opacity ${ANIMATION_DURATION}ms`
		slideElement.style.transform = transform
		slideElement.style.opacity = 0
		return {
			animationDuration: ANIMATION_DURATION,
			promise: timeoutPromise(ANIMATION_DURATION)
		}
	}
}

function timeoutPromise(duration) {
	return new Promise(resolve => setTimeout(resolve, duration))
}