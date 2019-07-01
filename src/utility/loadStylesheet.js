export function getStylesheet(url) {
	for (const stylesheet of document.styleSheets) {
		if (stylesheet.href === url) {
			return stylesheet.ownerNode
		}
	}
}

export default function loadStylesheet(url, setCallback) {
	return new Promise((resolve, reject) => {
		const stylesheet = document.createElement('link')
		stylesheet.rel = 'stylesheet'
		stylesheet.type = 'text/css'
		stylesheet.onerror = (event) => {
			document.head.removeChild(stylesheet)
			const error = new Error('STYLESHEET_ERROR')
			error.event = event
			reject(error)
		}
		stylesheet.href = url
		if (setCallback) {
			setCallback(() => resolve(stylesheet))
		} else {
			stylesheet.onload = () => resolve(stylesheet)
		}
		document.head.appendChild(stylesheet)
	})
}