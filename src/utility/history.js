export function replacePageUrl(url) {
	history.replaceState(undefined, undefined, url)
}