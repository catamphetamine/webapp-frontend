// https://developer.mozilla.org/en-US/docs/Web/API/Storage

export function hasObject(key) {
	return localStorage.getItem(key) !== null
}

export function getObject(key, defaultValue) {
	const value = localStorage.getItem(key)
	if (value) {
		try {
			return JSON.parse(value)
		} catch (error) {
			if (error instanceof SyntaxError) {
				console.error(`Invalid JSON:\n\n${value}`)
				return defaultValue
			} else {
				throw error
			}
		}
	} else {
		return defaultValue
	}
}

export function setObject(key, value) {
	if (value === undefined) {
		return deleteObject(key)
	}
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

export function forEach(func) {
	let i = 0
	while (i < localStorage.length) {
		const key = localStorage.key(i)
		func(key)
		i++
	}
}

class LocalStorage {
	get(key, defaultValue) {
		return getObject(key, defaultValue)
	}
	set(key, value) {
		return setObject(key, value)
	}
	delete(key) {
		return deleteObject(key)
	}
	forEach(func) {
		forEach(func)
	}
}

export default class CachedLocalStorage extends LocalStorage {
	get(key, defaultValue) {
		if (this.cache && this.cache[key]) {
			return this.cache[key]
		}
		return super.get(key, defaultValue)
	}
	set(key, value) {
		if (this.cache) {
			this.cache[key] = value
		}
		return super.set(key, value)
	}
	delete(key) {
		if (this.cache) {
			delete this.cache[key]
		}
		return super.delete(key)
	}
	cache(cache) {
		if (cache) {
			this.cache = {}
		} else {
			this.cache = undefined
		}
	}
}