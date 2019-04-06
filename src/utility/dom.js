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