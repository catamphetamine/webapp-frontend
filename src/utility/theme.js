/**
 * Parses theme CSS into CSS variables object.
 * @param  {string} path
 * @return {object}
 * @example
 * // Outputs:
 * // {
 * //   --variable-one: 'value-one',
 * //   --variable-two: 'value-two'
 * // }
 * parseThemeCSS(`
 *   :root {
 *     --variable-one: value-one;
 *     --variable-two: value-two;
 *   }
 * `)
 */
export function parseThemeCSS(style) {
	const START = ':root {'
	const END = '}'
	const startIndex = style.indexOf(START)
	const endIndex = style.indexOf(END)
	if (startIndex < 0 || endIndex < 0) {
		throw new Error(`Invalid theme CSS: \n${style}`)
	}
	return style.slice(startIndex + START.length, endIndex).trim()
		.split('\n')
		.filter(_ => _.indexOf('/*') < 0)
		.map(_ => {
			const nameAndValue = _.trim().match(/(.+): (.*);/)
			if (!nameAndValue) {
				throw new Error(`Invalid theme CSS line: "${_}"`)
			}
			return nameAndValue
		})
		// .filter(_ => _)
		.reduce((all, _) => {
			const name = _[1]
			let value = _[2]
			// Won't work for "additonal styles" in `themeVariables`.
			// // Substitute `var(--...)` with `...` variable value.
			// if (value.indexOf('var(') === 0) {
			//   value = all[value.match(/var\((.+)\)/)[1]]
			// }
			all[name] = value
			return all
		}, {})
}

/**
 * Gets CSS variable value.
 * @param  {string} name
 * @return {string}
 * @example
 * // Outputs: '16px'
 * getCSSVariableValue('--font-size')
 */
export function getCSSVariableValue(name) {
	// `getPropertyValue()` works in IE for some reason.
	return getComputedStyle(document.documentElement).getPropertyValue(name)
}

/**
 * Resets a previously set CSS variable.
 * @param  {string} name
 * @example
 * resetCSSVariable('--font-size')
 */
export function resetCSSVariable(name) {
	// `removeProperty()` works in IE for some reason.
	return document.documentElement.style.removeProperty(name)
}

/**
 * Sets CSS variable value.
 * @param  {string} name
 * @param  {string} value
 * @return
 * @example
 * setCSSVariableValue('--font-size', '16px')
 */
export function setCSSVariable(name, value) {
	// `setProperty()` works in IE for some reason.
	document.documentElement.style.setProperty(name, value)
}

/**
 * Checks if a web browser supports CSS variables.
 * @return {boolean}
 */
export function supportsCSSVariables() {
	// `getPropertyValue()` and `setProperty()` functions
	// are present in IE 11 for some reason.
	// Calling those functions in IE 11 has no effect.
	if (!document.documentElement.style.getPropertyValue ||
		!document.documentElement.style.setProperty ||
		!document.documentElement.style.removeProperty) {
		return false
	}
	return true
}