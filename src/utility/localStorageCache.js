import { getObject, setObject, deleteObject } from './localStorage'

export default class LocalStorageCache {
	constructor(maxSize, prefix) {
		this.maxSize = maxSize
		this.prefix = prefix
	}

	get(key) {
		const keys = getObject(this.prefix + ':keys') || []
		const index = keys.indexOf(key)
		if (index < 0) {
			return
		}
		keys.splice(index, 1)
		keys.push(key)
		setObject(this.prefix + ':keys', keys)
		const entries = getObject(this.prefix + ':entries')
		return entries[key]
	}

	set(key, value) {
		const keys = getObject(this.prefix + ':keys') || []
		const entries = getObject(this.prefix + ':entries') || {}
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
		setObject(this.prefix + ':keys', keys)
		setObject(this.prefix + ':entries', entries)
	}

	clear() {
		deleteObject(this.prefix + ':keys')
		deleteObject(this.prefix + ':entries')
	}
}