import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'react-responsive-ui'

// import DefaultTheme from '../styles/themes/default.css'
// import HighContrastTheme from '../styles/themes/high-contrast.css'

import {
	parseThemeCSS,
	getCSSVariableValue,
	resetCSSVariable,
	setCSSVariable,
	supportsCSSVariables
} from '../utility/theme'

export default class ThemeSwitcher extends Component {
	static propTypes = {
		localStorageKey: PropTypes.string.isRequired,
		onSetTheme: PropTypes.func
	}

	state = {
		theme: hasLocalStorage() && localStorage.getItem(this.props.localStorageKey) || 'default'
	}

	button = React.createRef()
	focus = () => this.button.current.focus()

	setTheme = (theme) => {
		const { onSetTheme } = this.props
		this.setState({ theme })
		if (onSetTheme) {
			onSetTheme(theme)
		}
	}

	render() {
		const { onSetTheme, ...rest } = this.props
		const { theme } = this.state
		return (
			<SwitchThemeButton
				{...rest}
				ref={this.button}
				theme={theme}
				setTheme={this.setTheme}/>
		)
	}
}

class SwitchThemeSelect extends React.Component {
	static propTypes = {
		theme: PropTypes.string.isRequired,
		setTheme: PropTypes.func.isRequired,
		themeVariables: PropTypes.object
	}

	button = React.createRef()
	focus = () => this.button.current.focus()

	setTheme = (newTheme) => {
		const {
			theme,
			setTheme,
			themeVariables,
			localStorageKey
		} = this.props
		if (chooseTheme(newTheme, theme, themeVariables, localStorageKey)) {
			setTheme(newTheme)
		} else {
			alert('Themes are not supported by your web browser.')
		}
	}

	render() {
		const {
			theme,
			setTheme,
			themeVariables,
			...rest
		} = this.props
		return (
			<Select
				value={theme}
				onChange={setTheme}
				options={[]}
				{...rest}/>
		)
	}
}

let THEME = 'default'

// const THEMES_DEFAULTS = {
// 	'default': parseThemeCSS(DefaultTheme),
// 	'high-contrast': parseThemeCSS(HighContrastTheme)
// }

const THEMES_DEFAULTS = {
	'default': {},
	'high-contrast': {}
}

// Validate themes' variables.
// (all possible variables must be defined in the default theme)
for (const theme of Object.keys(THEMES_DEFAULTS)) {
	for (const variableName of Object.keys(THEMES_DEFAULTS[theme])) {
		if (!THEMES_DEFAULTS.default[variableName]) {
			throw new Error(`Variable "${variableName}" not found in default theme`)
		}
	}
}

function applyThemeCSSVariables(theme, themeVariables = {}) {
	// Reset all CSS variables.
	for (const name of Object.keys(THEMES_DEFAULTS.default)) {
		resetCSSVariable(name)
	}
	for (const theme of Object.keys(themeVariables)) {
		for (const name of Object.keys(themeVariables[theme])) {
			resetCSSVariable(name)
		}
	}
	// Set all CSS variables for a theme.
	if (theme !== 'default') {
		if (THEMES_DEFAULTS[theme]) {
			for (const name of Object.keys(THEMES_DEFAULTS[theme])) {
				// `setProperty()` works in IE for some reason.
				setCSSVariable(name, THEMES_DEFAULTS[theme][name])
			}
		}
		if (themeVariables[theme]) {
			for (const name of Object.keys(themeVariables[theme])) {
				// `setProperty()` works in IE for some reason.
				setCSSVariable(name, themeVariables[theme][name])
			}
		}
	}
}

function chooseTheme(theme, prevTheme, themeVariables, localStorageKey) {
	if (applyTheme(theme, prevTheme, themeVariables)) {
		// Save the preferred theme.
		hasLocalStorage() && localStorage.setItem(localStorageKey, theme)
		return true
	}
}

function hasLocalStorage() {
	return typeof localStorage !== 'undefined' && localStorage !== null
}

function applyTheme(theme, prevTheme = 'default', themeVariables) {
	// Only if supports CSS variables.
	if (!supportsCSSVariables()) {
		return false
	}
	// Toggle <body/> CSS class.
	// It's required for stying things like "react-modal"
	// which are appended directly to <body/>.
	document.body.classList.remove('theme--' + prevTheme)
	document.body.classList.add('theme--' + theme)
	// Set CSS variables.
	applyThemeCSSVariables(theme, themeVariables)
	// Set theme variable.
	THEME = theme
	return true
}

// Update theme from `localStorage` in Redux state.
// Not doing this in Redux state "default" initializer
// because Redux state is initialized on server side
// and then client side re-uses that state.
export function initializeTheme(themeVariables, localStorageKey) {
	const preferredTheme = hasLocalStorage() && localStorage.getItem(localStorageKey)
	if (preferredTheme && preferredTheme !== THEME) {
		return applyTheme(preferredTheme, undefined, themeVariables)
	}
}