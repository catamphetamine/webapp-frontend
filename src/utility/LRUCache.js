import LocalStorage from './LocalStorage'

class LRUCache {
	constructor(maxSize, prefix, storage) {
		this.maxSize = maxSize
		this.prefix = prefix
		this.storage = storage
	}

	get(key) {
		const keys = this.storage.get(this.prefix + ':keys') || []
		const index = keys.indexOf(key)
		if (index < 0) {
			return
		}
		keys.splice(index, 1)
		keys.push(key)
		this.storage.set(this.prefix + ':keys', keys)
		const entries = this.storage.get(this.prefix + ':entries')
		return entries[key]
	}

	set(key, value) {
		const keys = this.storage.get(this.prefix + ':keys') || []
		const entries = this.storage.get(this.prefix + ':entries') || {}
		const index = keys.findIndex(_ => _ === key)
		if (index >= 0) {
			keys.splice(index, 1)
		} else {
			while (keys.length >= this.maxSize) {
				const expiredKey = keys.shift()
				delete entries[expiredKey]
			}
		}
		keys.push(key)
		entries[key] = value
		this.storage.set(this.prefix + ':keys', keys)
		this.storage.set(this.prefix + ':entries', entries)
	}

	clear() {
		this.storage.delete(this.prefix + ':keys')
		this.storage.delete(this.prefix + ':entries')
	}
}

export class LocalStorageCache extends LRUCache {
	constructor(maxSize, prefix) {
		super(maxSize, prefix, new LocalStorage())
	}
}