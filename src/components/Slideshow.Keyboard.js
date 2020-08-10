import { isClickable } from '../utility/dom'
import { isKey } from '../utility/keys'

export default class SlideshowKeyboard {
	constructor(slideshow) {
		this.slideshow = slideshow
		slideshow.onKeyDown = this.onKeyDown
	}

	onKeyDown = (event) => {
		if (this.locked) {
			return event.preventDefault()
		}
		if (this.slideshow.getPluginForSlide().onKeyDown) {
			if (this.slideshow.getPluginForSlide().onKeyDown(event, {
				// slide: this.slideshow.getCurrentSlide()
			}) === true) {
				return
			}
		}
		if (event.defaultPrevented) {
			return
		}
		// "Space" shows next slide only if not focused on a clickable element.
		if (isKey('Space', event)) {
			if (isClickable(event.target)) {
				return
			}
		}
		if (this.handleKey(event)) {
			return event.preventDefault()
		}
	}

	getKeyboardDragDistance() {
		return Math.max(this.slideshow.getSlideshowWidth(), this.slideshow.getSlideshowHeight()) / 10
	}

	handleKey(event) {
		// Handle "Drag and Scale" mode keyboard interaction.
		if (this.slideshow.isDragAndScaleMode()) {
			if (this.slideshow.locked) {
				return
			}
			// Move right.
			if (isKey('Right', event)) {
				this.slideshow.pan.dragOffsetX += this.getKeyboardDragDistance()
				this.slideshow.onDragOffsetChange({ animate: true })
				return true
			}
			// Move left.
			if (isKey('Left', event)) {
				this.slideshow.pan.dragOffsetX -= this.getKeyboardDragDistance()
				this.slideshow.onDragOffsetChange({ animate: true })
				return true
			}
			// Move up.
			if (isKey('Up', event)) {
				this.slideshow.pan.dragOffsetY -= this.getKeyboardDragDistance()
				this.slideshow.onDragOffsetChange({ animate: true })
				return true
			}
			// Move down.
			if (isKey('Down', event)) {
				this.slideshow.pan.dragOffsetY += this.getKeyboardDragDistance()
				this.slideshow.onDragOffsetChange({ animate: true })
				return true
			}
			// Close.
			if (isKey('Esc', event)) {
				this.slideshow.exitDragAndScaleMode()
				return true
			}
		}
		// Show previous slide.
		if (isKey('Left', event) ||
			isKey('Ctrl', 'Left', event) ||
			isKey('PageUp', event)) {
			this.slideshow.resetAnimations()
			this.slideshow.showPrevious()
			return true
		}
		// Show next slide.
		if (isKey('Right', event) ||
			isKey('Ctrl', 'Right', event) ||
			isKey('PageDown', event) ||
			isKey('Space', event)) {
			this.slideshow.resetAnimations()
			this.slideshow.showNext()
			return true
		}
		// Scale up.
		if (isKey('Up', event) ||
			isKey('Shift', 'Up', event)) {
			this.slideshow.onScaleUp(event)
			return true
		}
		// Scale down.
		if (isKey('Down', event) ||
			isKey('Shift', 'Down', event)) {
			this.slideshow.onScaleDown(event)
			return true
		}
		// Close.
		if (isKey('Esc', event)) {
			this.slideshow.close()
			return true
		}
	}
}