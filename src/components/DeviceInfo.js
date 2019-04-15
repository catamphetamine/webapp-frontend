import React from 'react'
import throttle from 'lodash/throttle'

import {
	getViewportWidth,
	getViewportHeight
} from '../utility/dom'

let _isTouchDevice = false
let screenSize

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
		screenSize = getScreenSize(getViewportWidth() * getViewportHeight())
	}

	onTouchStart = () => {
		_isTouchDevice = true
		window.removeEventListener('touchstart', this.onTouchStart)
	}

	render() {
		return null
	}
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

export function isLargeScreenOrLarger() {
	return screenSize === 'L'
}

export function isMediumScreenOrLarger() {
	return screenSize === 'M' || isLargeScreenOrLarger()
}