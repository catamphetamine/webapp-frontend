export default function onRenderError(error, options = {}) {
	// Will be shown on `/error` page in production.
	const element = document.createElement('div')
	element.style.cssText = `
		position: fixed;
		top: 0;
		left: 0;
		bottom: 0;
		right: 0;
		display: flex;
		align-items: center;
		justify-content: center;
	`
	element.innerHTML = 'Error'
	// Will prepend `element` to `<body/>` (even if `<body/>` is empty).
	// https://stackoverflow.com/questions/2007357/how-to-set-dom-element-as-the-first-child
	document.body.insertBefore(element, document.body.firstChild)
}