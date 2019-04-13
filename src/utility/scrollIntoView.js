// https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
// https://github.com/stipsan/scroll-into-view-if-needed#quality
import scrollIntoView from 'scroll-into-view-if-needed'
import smoothScrollIntoView from 'smooth-scroll-into-view-if-needed'

// const scrollIntoViewSmoothly =
// 	'scrollBehavior' in document.documentElement.style
// 		? scrollIntoView
// 		: smoothScrollIntoView

// `smooth-scroll-into-view-if-needed` returns a `Promise`
// so it is used here instead of the native `scrollIntoView()`.
export default function(node, options) {
	return smoothScrollIntoView(node, {
		behavior: 'smooth',
		...options,
		ease: options.ease ? EASING[options.ease] : undefined
	})
}

// https://gist.github.com/gre/1650294#file-easing-js
const EASING = {
	easeInOutSine: t => (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2
}