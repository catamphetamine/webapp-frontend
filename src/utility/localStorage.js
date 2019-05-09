// https://developer.mozilla.org/en-US/docs/Web/API/Storage

export function hasObject(key) {
	return localStorage.getItem(key) !== null
}

export function getObject(key, defaultValue) {
	const value = localStorage.getItem(key)
	if (value) {
		return JSON.parse(value)
	} else {
		return defaultValue
	}
}

export function setObject(key, value) {
	localStorage.setItem(key, JSON.stringify(value))
}

export function deleteObject(key) {
	localStorage.removeItem(key)
}

export function addStorageListener(key, listener) {
	window.addEventListener('storage', (event) => {
		if (event.key === key) {
			// { oldValue, newValue, url }
			// https://developer.mozilla.org/en-US/docs/Web/API/StorageEvent
			if (event.newValue) {
				listener(JSON.parse(event.newValue))
			} else {
				listener()
			}
		}
	})
}