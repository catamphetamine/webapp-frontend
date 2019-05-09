export default function loadStylesheet(url, setCallback) {
	if (!setCallback) {
		// Avoid duplicates.
		for (const stylesheet of document.styleSheets) {
			if (stylesheet.href === url) {
				return Promise.resolve()
			}
		}
	}
	return new Promise((resolve, reject) => {
		const stylesheet = document.createElement('link')
		stylesheet.rel = 'stylesheet'
		stylesheet.type = 'text/css'
		script.onerror = reject
		stylesheet.href = url
		if (setCallback) {
			setCallback(resolve)
		} else {
			stylesheet.onload = resolve
		}
		document.head.appendChild(link)
	})
}