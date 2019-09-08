export default class MemoryStorage {
	data = {}
	constructor(options = {}) {
		this.options = options
	}
	get(key, defaultValue) {
		const item = this.data[key] || defaultValue
		if (this.options.emulateSerialize) {
			if (item !== undefined) {
				return JSON.parse(JSON.stringify(item))
			}
		}
		return item
	}
	set(key, value) {
		this.data[key] = value
	}
	delete(key) {
		delete this.data[key]
	}
	// `clear()` is only used for tests.
	clear() {
		this.data = {}
	}
	keys() {
		return Object.keys(this.data)
	}
}