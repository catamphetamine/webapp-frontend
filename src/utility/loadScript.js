export default function loadScript(url, setCallback) {
	return new Promise((resolve, reject) => {
		const script = document.createElement('script')
		script.onerror = reject
		script.src = url
		if (setCallback) {
			setCallback(resolve)
		} else {
			script.onload = resolve
		}
		const firstScriptTag = document.getElementsByTagName('script')[0]
		firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
	})
}