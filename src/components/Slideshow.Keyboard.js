import { isClickable } from '../utility/dom'

export default class SlideshowKeyboard {
	constructor(slideshow) {
		this.slideshow = slideshow
		slideshow.onKeyDown = this.onKeyDown
	}

	onKeyDown = (event) => {
		if (this.locked) {
			return event.preventDefault()
		}
		// Ignore system hotkeys.
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		if (this.slideshow.getPluginForSlide().onKeyDown) {
			if (this.slideshow.getPluginForSlide().onKeyDown(event, this.slideshow.getCurrentSlide()) === true) {
				return
			}
		}
		if (event.defaultPrevented) {
			return
		}
		// "Spacebar" shows next slide only if not focused on a clickable element.
		if (event.keyCode === 32) {
			if (isClickable(event.target)) {
				return
			}
		}
		if (this.handleKey(event.keyCode)) {
			return event.preventDefault()
		}
	}

	handleKey(keyCode) {
		switch (keyCode) {
			// Show previous slide.
			// "Left Arrow".
			case 37:
			// "Page Up".
			case 33:
				this.slideshow.resetAnimations()
				this.slideshow.showPrevious()
				return true

			// Show next slide.
			// "Right Arrow".
			case 39:
			// "Page Down".
			case 34:
			// "Spacebar".
			case 32:
				this.slideshow.resetAnimations()
				this.slideshow.showNext()
				return true

			// "Up Arrow".
			// Scale up.
			case 38:
				this.slideshow.scaleUp()
				return true

			// "Down Arrow".
			// Scale down.
			case 40:
				this.slideshow.scaleDown()
				return true

			// "Escape".
			// Close.
			case 27:
				this.slideshow.close()
				return true

			// // "Page Up"
			// case 33:
			// // "Page Down"
			// case 34:
			// 	// Prevent keys like "Home"/"End" from scrolling the page.
			// 	return true
		}
	}
}