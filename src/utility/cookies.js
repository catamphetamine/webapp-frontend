/**
 * Reads a cookie.
 * @param  {string} name
 * @return {string} [value]
 */
export function getCookie(name) {
	const matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

/**
 * Sets a cookie.
 * @param {string} name
 * @param {any} value
 * @param {object} [options] — All available cookie options (lowercase). https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Set-Cookie
 * @param {number} [options['max-age']=2147483647] — A cookie is set to "never expire" by default. Setting `max-age` to `-1` preserves the cookie until the browser is closed.
 */
export function setCookie(name, value, options = {}) {
	// `options` will be mutated.
	options = { ...options }
	if (options['expires'] instanceof Date) {
		options['expires'] = options['expires'].toUTCString()
	}
	// A cookie is set as "never expires" by default
	if (options['max-age'] === undefined) {
		// https://stackoverflow.com/a/22479460/970769
		options['max-age'] = 2147483647
	}
	let cookie = name + "=" + encodeURIComponent(value)
	for (const propName in options) {
		cookie += "; " + propName
		const propValue = options[propName]
		if (propValue !== true) {
			cookie += "=" + propValue
		}
	}
	document.cookie = cookie
}

/**
 * Deletes a cookie.
 * @param {string} name
 */
export function deleteCookie(name) {
	// Setting setMaxAge to `0` will delete the cookie.
	// Setting it to `-1` will preserve it until the browser is closed.
	setCookie(name, '', { 'max-age': 0 })
}