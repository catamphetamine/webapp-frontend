import React from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

import {
	getViewportWidth,
	getViewportHeight
} from '../utility/dom'

let _isTouchDevice = false
let screenSize
let screenWidth

export default class DeviceInfo extends React.Component {
	componentDidMount() {
		window.addEventListener('touchstart', this.onTouchStart)
		window.addEventListener('resize', this.onWindowResize)
		this.onResize()
	}

	componentWillUnmount() {
		window.removeEventListener('touchstart', this.onTouchStart)
		window.removeEventListener('resize', this.onWindowResize)
	}

	onWindowResize = throttle((event) => this.onResize(), 100)

	onResize = () => {
		const { onScreenWidthChange } = this.props
		screenWidth = getViewportWidth()
		screenSize = getScreenSize(getViewportWidth() * getViewportHeight())
		if (onScreenWidthChange) {
			onScreenWidthChange(screenWidth)
		}
	}

	onTouchStart = () => {
		_isTouchDevice = true
		window.removeEventListener('touchstart', this.onTouchStart)
	}

	render() {
		return null
	}
}

DeviceInfo.propTypes = {
	onScreenWidthChange: PropTypes.func
}

// Must be equal to `$screen-xl-min` in `grid.mixins.css`
const SCREEN_WIDTH_XL = 1765

// Must be equal to `$screen-l-min` in `grid.mixins.css`
const SCREEN_WIDTH_L = 1261

export function isLargeScreenOrLarger(screenWidth) {
	return screenWidth >= SCREEN_WIDTH_L
}

export function isExtraLargeScreenOrLarger(screenWidth) {
	return screenWidth >= SCREEN_WIDTH_XL
}

// http://iosres.com/
// iPhone XS Max: 414 x 896
// iPad 11": 834 x 1194
// iPad Air: 768 x 1024
function getScreenSize(squarePixels) {
	if (squarePixels >= 1920 * 1080) {
		return 'L'
	} else if (squarePixels >= 1280 * 1024) {
		return 'M'
	} else if (squarePixels >= 768 * 1024) {
		return 'S'
	} else {
		return 'XS'
	}
}

export function isTouchDevice() {
	return _isTouchDevice
}

export function isLargeScreenSizeOrLarger(screenSize) {
	return screenSize === 'L'
}

export function isMediumScreenSizeOrLarger() {
	return screenSize === 'M' || isLargeScreenSizeOrLarger()
}