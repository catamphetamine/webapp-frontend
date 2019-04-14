import React from 'react'

export let isTouchDevice = false

export default class DeviceInfo extends React.Component {
	componentDidMount() {
		window.addEventListener('touchstart', this.onTouchStart)
	}

	componentWillUnmount() {
		window.removeEventListener('touchstart', this.onTouchStart)
	}

	onTouchStart = () => {
		isTouchDevice = true
		window.removeEventListener('touchstart', this.onTouchStart)
	}

	render() {
		return null
	}
}