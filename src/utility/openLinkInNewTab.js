// Opens external link in a new tab.
export default function openLinkInNewTab(url) {
	const link = document.createElement('a')
	link.setAttribute('href', url)
	link.setAttribute('target', '_blank')
	link.click()
}