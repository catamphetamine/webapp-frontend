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