import {
	requestFullScreen,
	exitFullScreen,
	onFullScreenChange
} from '../utility/dom'

export default class SlideshowFullscreen {
	constructor(slideshow) {
		this.slideshow = slideshow
	}

	enterFullscreen = (container) => {
		if (requestFullScreen(container)) {
			const unlistenFullScreen = onFullScreenChange(() => {
				// Re-render the current slide.
				this.slideshow.showSlide(this.slideshow.getState().i)
			})
			this.slideshow.onCleanUp(() => {
				exitFullScreen()
				unlistenFullScreen()
			})
			return true
		}
	}
}