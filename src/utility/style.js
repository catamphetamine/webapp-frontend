export const FONT_SIZES = [
	'small',
	'medium',
	'large'
]

/**
 * Applies font size to document.
 * Both `html` and `body` elements are required to be updated
 * because `html` is required in order for `rem`s to work
 * and without `body` changing fonts doesn't work for some weird reason.
 * @param  {string} fontSize
 */
export function applyFontSize(fontSize) {
	for (const fontSize of FONT_SIZES) {
		document.documentElement.classList.remove(`font-size--${fontSize}`)
		document.body.classList.remove(`font-size--${fontSize}`)
	}
	document.documentElement.classList.add(`font-size--${fontSize}`)
	document.body.classList.add(`font-size--${fontSize}`)
}

/**
 * Turns Dark Model on or off.
 * @param  {boolean} shouldSwitchIntoDarkMode
 */
export function applyDarkMode(shouldSwitchIntoDarkMode) {
	if (shouldSwitchIntoDarkMode) {
		document.documentElement.classList.add('dark')
		document.documentElement.classList.remove('light')
	} else {
		document.documentElement.classList.add('light')
		document.documentElement.classList.remove('dark')
	}
}

/**
 * Enables or disables "auto" dark mode.
 * "Auto" dark mode uses the operating system preference
 * to determine whether the app should switch itself
 * into dark mode or light mode.
 * @param {boolean} enableAutoDarkMode
 * @param {func} onSetDarkMode
 */
let disableAutoDarkMode
export function autoDarkMode(value, onSetDarkMode) {
	if (!value && disableAutoDarkMode) {
		disableAutoDarkMode()
		disableAutoDarkMode = undefined
	} else if (value && !disableAutoDarkMode) {
		disableAutoDarkMode = enableAutoDarkMode(onSetDarkMode)
	}
}

/**
 * Sets a color scheme for the website.
 * If browser supports "prefers-color-scheme"
 * it will respect the setting for light or dark mode.
 * Will fall back to light mode by default.
 * https://medium.com/@jonas_duri/enable-dark-mode-with-css-variables-and-javascript-today-66cedd3d7845
 */
function enableAutoDarkMode(onSetDarkMode) {
	const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
	const isLightMode = window.matchMedia('(prefers-color-scheme: light)').matches
	const isNotSpecified = window.matchMedia('(prefers-color-scheme: no-preference)').matches
	const hasNoSupport = !isDarkMode && !isLightMode && !isNotSpecified

	const darkMode = (value) => {
		applyDarkMode(value)
		onSetDarkMode(value)
	}

	// Watch "dark" mode.
	const darkModeWatcher = window.matchMedia('(prefers-color-scheme: dark)')
	const darkModeListener = (event) => {
		if (event.matches) {
			darkMode(true)
		}
	}
	darkModeWatcher.addEventListener('change', darkModeListener)

	// Watch "light" mode.
	const lightModeWatcher = window.matchMedia('(prefers-color-scheme: light)')
	const lightModeListener = (event) => {
		if (event.matches) {
			darkMode(false)
		}
	}
	lightModeWatcher.addEventListener('change', lightModeListener)

	if (isDarkMode) {
		darkMode(true)
	} else if (isLightMode) {
		darkMode(false)
	} else if (isNotSpecified || hasNoSupport) {
		darkMode(false)
	}

	return () => {
		darkModeWatcher.removeEventListener('change', darkModeListener)
		lightModeWatcher.removeEventListener('change', lightModeListener)
	}
}