export function isKey() {
	const event = arguments[arguments.length - 1]
	let i = 0
	let hasCtrl
	let hasAlt
	let hasShift
	let hasMeta
	while (i < arguments.length - 1) {
		const key = arguments[i]
		switch (key) {
			case 'Ctrl':
				hasCtrl = true
				if (!event.ctrlKey) {
					return false
				}
				break
			case 'Alt':
				hasAlt = true
				if (!event.altKey) {
					return false
				}
				break
			case 'Shift':
				hasShift = true
				if (!event.shiftKey) {
					return false
				}
				break
			case 'Meta':
				hasMeta = true
				if (!event.metaKey) {
					return false
				}
				break
			default:
				const keyCode = KEY_CODES[key]
				if (!keyCode) {
					return false
				}
				if (event.keyCode !== keyCode) {
					return false
				}
				break
		}
		i++
	}
	if (event.ctrlKey && !hasCtrl) {
		return false
	}
	if (event.altKey && !hasAlt) {
		return false
	}
	if (event.shiftKey && !hasShift) {
		return false
	}
	if (event.metaKey && !hasMeta) {
		return false
	}
	return true
}

const KEY_CODES = {
	Left: 37,
	Up: 38,
	Right: 39,
	Down: 40,
	PageUp: 33,
	PageDown: 34,
	Space: 32,
	Esc: 27
}