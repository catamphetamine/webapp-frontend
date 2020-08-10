export function isClickable(element, maxParent) {
	if (!element || element === maxParent) {
		return false
	}
	switch (element.tagName) {
		case 'A':
		case 'BUTTON':
			return true
	}
	return isClickable(element.parentNode)
}

export function requestFullScreen(element) {
	if (document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement) {
		return false
	}
	if (element.requestFullscreen) {
		element.requestFullscreen()
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen()
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen()
	}
	return true
}

export function exitFullScreen(element) {
	if (document.cancelFullScreen) {
		document.cancelFullScreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen()
	}
}

export function onFullScreenChange(handler) {
	document.addEventListener('webkitfullscreenchange', handler)
	document.addEventListener('mozfullscreenchange', handler)
	document.addEventListener('fullscreenchange', handler)
	return () => {
		document.removeEventListener('webkitfullscreenchange', handler)
		document.removeEventListener('mozfullscreenchange', handler)
		document.removeEventListener('fullscreenchange', handler)
	}
}

export function getViewportWidth() {
	// Doesn't correctly reflect page zoom in iOS Safari.
	// (doesn't scale viewport width accordingly).
	// (but does reflect page zoom in desktop Chrome).
	return document.documentElement.clientWidth
}

// https://javascript.info/size-and-scroll-window
// `<!DOCTYPE html>` may be required in order for this to work correctly.
export function getViewportWidthIncludingScaleAndScrollbar() {
	// Correctly reflects page zoom in iOS Safari.
	// (scales viewport width accordingly).
	return window.innerWidth
}

export function getViewportHeight() {
	// Doesn't support iOS Safari's dynamically shown/hidden
	// top URL bar and bottom actions bar.
	// https://codesandbox.io/s/elegant-fog-iddrh
	// Tested in IE 11.
	// It also doesn't correctly reflect page zoom in iOS Safari.
	// (doesn't scale viewport height accordingly).
	// (but does reflect page zoom in desktop Chrome).
	return document.documentElement.clientHeight
}

// https://javascript.info/size-and-scroll-window
// `<!DOCTYPE html>` is required in order for this to work correctly.
// Without it, the returned height would be the height of the entire document.
export function getViewportHeightIncludingScaleAndScrollbar() {
	// This variant of `getViewportHeight()`
	// supports iOS Safari's dynamically shown/hidden
	// top URL bar and bottom actions bar.
	// https://codesandbox.io/s/elegant-fog-iddrh
	// Tested in IE 11.
	// It also correctly reflects page zoom in iOS Safari.
	// (scales viewport height accordingly).
	return window.innerHeight
}

// // This variant of `getViewportHeight()`
// // supports iOS Safari's dynamically shown/hidden
// // top URL bar and bottom actions bar.
// // https://codesandbox.io/s/elegant-fog-iddrh
// // Tested in IE 11.
// // It doesn't correctly reflect page zoom in iOS Safari.
// // (doesn't scale viewport height accordingly).
// // (but does reflect page zoom in desktop Chrome).
// function getViewportHeight() {
// 	const div = document.createElement('div')
// 	div.style.position = 'fixed'
// 	div.style.left = 0
// 	div.style.top = 0
// 	div.style.right = 0
// 	div.style.bottom = 0
// 	div.style.zIndex = -1
// 	document.body.appendChild(div)
// 	const height = div.clientHeight
// 	document.body.removeChild(div)
// 	return height
// }

export function getScrollBarWidth() {
	// This won't return correct scrollbar width
	// in iOS Safari when the page is zoomed,
	// because in iOS Safari, `document.documentElement.clientWidth`
	// doesn't reflect page zoom.
	return window.innerWidth - document.documentElement.clientWidth
}

export function triggerRender(element) {
	// Getting `element.offsetWidth` causes a "reflow" in a web browser.
	// This is a trick to force it to play a subsequent CSS transition.
	// https://stackoverflow.com/questions/24148403/trigger-css-transition-on-appended-element
	// Other possible solutions could be `getBoundingClientRect()` or `requestAnimationFrame()`.
	element.offsetWidth
}