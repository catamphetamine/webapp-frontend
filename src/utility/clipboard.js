// Copy-pasted from:
// https://stackoverflow.com/questions/400212/how-do-i-copy-to-the-clipboard-in-javascript
export default function copyTextToClipboard(text) {
	const textArea = document.createElement('textarea')
	for (const key of Object.keys(HIDDEN_TEXTAREA_STYLE)) {
		textArea.style[key] = HIDDEN_TEXTAREA_STYLE[key]
	}
	textArea.value = text
	document.body.appendChild(textArea)
	textArea.focus()
	textArea.select()
	try {
		return document.execCommand('copy')
	} catch (error) {
		console.error(error)
		return false
	} finally {
		document.body.removeChild(textArea)
	}
}

// *** This styling is an extra step which is likely not required. ***
//
// Why is it here? To ensure:
// 1. the element is able to have focus and selection.
// 2. if element was to flash render it has minimal visual impact.
// 3. less flakyness with selection and copying which **might** occur if
//    the textarea element is not visible.
//
// The likelihood is the element won't even render, not even a
// flash, so some of these are just precautions. However in
// Internet Explorer the element is visible whilst the popup
// box asking the user for permission for the web page to
// copy to the clipboard.
//
const HIDDEN_TEXTAREA_STYLE = {
	// Place in top-left corner of screen regardless of scroll position.
	position: 'fixed',
	top: 0,
	left: 0,
	// Ensure it has a small width and height. Setting to 1px / 1em
	// doesn't work as this gives a negative w/h on some browsers.
	width: '2em',
	height: '2em',
	// We don't need padding, reducing the size if it does flash render.
	padding: 0,
	// Clean up any borders.
	border: 'none',
	outline: 'none',
	boxShadow: 'none',
	// Avoid flash of white box if rendered for any reason.
	background: 'transparent'
}