// Copy-pasted from:
// https://learn.javascript.ru/cookie

export function getCookie(name) {
	const matches = document.cookie.match(new RegExp(
		"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
	))
	return matches ? decodeURIComponent(matches[1]) : undefined
}

export function setCookie(name, value, options) {
	options = options || {}

	let expires = options.expires

	if (typeof expires == "number" && expires) {
		const date = new Date()
		date.setTime(date.getTime() + expires * 1000)
		expires = options.expires = date
	}
	if (expires && expires.toUTCString) {
		options.expires = expires.toUTCString()
	}

	value = encodeURIComponent(value)

	let updatedCookie = name + "=" + value

	for (const propName in options) {
		updatedCookie += "; " + propName
		const propValue = options[propName]
		if (propValue !== true) {
			updatedCookie += "=" + propValue
		}
	}

	document.cookie = updatedCookie
}

