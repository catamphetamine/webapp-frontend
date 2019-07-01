let promise
let _resolve

export function createPromise() {
	promise = new Promise((resolve) => _resolve = resolve)
}

export function getPromise() {
	return promise
}

export function resolve(value) {
	return _resolve(value)
}