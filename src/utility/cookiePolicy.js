import { getCookie, setCookie } from './cookie'

let ON_COOKIES_ACCEPTED = []

export function areCookiesAccepted() {
	if (!window.SHOW_COOKIE_NOTICE) {
		return true
	}
	return getCookie('cookiesAccepted') === '✓'
}

export function onCookiesAccepted(callback) {
	if (areCookiesAccepted()) {
		callback()
	} else {
		ON_COOKIES_ACCEPTED.push(callback)
	}
}

export function acceptCookies() {
	setCookie('cookiesAccepted', '✓')
	for (const callback of ON_COOKIES_ACCEPTED) {
		callback()
	}
	ON_COOKIES_ACCEPTED = []
}

export function addLearnMoreLink(content, learnMore, url) {
	learnMore = {
		type: 'link',
		url,
		content: learnMore
	}
	if (!Array.isArray(content)) {
		content = [content]
	}
	return content.concat(' ').concat(learnMore)
}