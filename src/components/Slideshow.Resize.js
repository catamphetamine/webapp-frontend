import throttle from 'lodash/throttle'

export default class SlideshowResize {
	constructor(slideshow) {
		slideshow.onInit(() => {
			const onWindowResize = throttle((event) => slideshow.rerender(), 100)
			window.addEventListener('resize', onWindowResize)
			slideshow.onCleanUp(() => {
				window.removeEventListener('resize', onWindowResize)
			})
		})
	}
}