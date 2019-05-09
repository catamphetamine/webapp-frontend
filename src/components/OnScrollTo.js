/**
 * Returns the DOM element's `top` and `left` offset relative to the document.
 * @param  {object} element
 * @return {object} `{ top: number, left: number, width: number, height: number }`
 */
function getOffset(element) {
	// Copied from:
	// http://stackoverflow.com/questions/5598743/finding-elements-position-relative-to-the-document

	const onScreenCoordinates = element.getBoundingClientRect()

	const documentLeftBorderWidth = document.clientLeft || document.body.clientLeft || 0
	const documentTopBorderWidth  = document.clientTop || document.body.clientTop || 0

	// `window.scrollY` and `window.scrollX` aren't supported in Internet Explorer.
	const scrollY = window.pageYOffset
	const scrollX = window.pageXOffset

	const top  = onScreenCoordinates.top + scrollY - documentTopBorderWidth
	const left = onScreenCoordinates.left + scrollX - documentLeftBorderWidth

	return {
		top,
		left,
		width: onScreenCoordinates.width,
		height: onScreenCoordinates.height
	}
}

const createRef = React.createRef

// import createRef from 'react-create-ref'
// import { getOffset } from './utility/dom'

import React from 'react'
import PropTypes from 'prop-types'
import throttle from 'lodash/throttle'

export default class OnScrollTo extends React.Component {
	static propTypes = {
		active: PropTypes.bool.isRequired,
		wrap: PropTypes.bool.isRequired,
		children: PropTypes.node,
		onScrollInTop: PropTypes.func,
		onScrollInBottom: PropTypes.func,
		onScrollOutTop: PropTypes.func,
		onScrollOutBottom: PropTypes.func,
		onScrollInDistance: PropTypes.number.isRequired
	}

	static defaultProps = {
		active: true,
		wrap: true,
		onScrollInDistance: 0
	}

	node = createRef()

	constructor() {
		super()
		this.reset()
	}

	componentDidMount() {
		this.activate()
	}

	componentWillUnmount() {
		this.deactivate()
	}

	activate = () => {
		window.addEventListener('scroll', this.onScrollThrottled)
		window.addEventListener('resize', this.onScrollThrottled)
		// window.addEventListener('wheel', this.onMouseWheelThrottled)
		this.isActive = true
		// The element may be initially visible.
		this.onScrollThrottled()
	}

	deactivate() {
		window.removeEventListener('scroll', this.onScrollThrottled)
		window.removeEventListener('resize', this.onScrollThrottled)
		// window.removeEventListener('wheel', this.onMouseWheelThrottled)
		this.reset()
	}

	reset() {
		// The element tracking is activated on mount.
		this.isActive = false
		// The element is considered initially invisible.
		this.isVisible = false
		this.scrollY = 0
		this.value = undefined
	}

	// // Prevents some hypothetical Chrome scroll bug:
	// // https://stackoverflow.com/questions/47524205/random-high-content-download-time-in-chrome/47684257#47684257
	// onMouseWheel = (event) => {
	// 	if (event.deltaY === 1) {
	// 		event.preventDefault()
	// 	}
	// }

	onScroll = () => {
		const {
			active,
			onScrollInDistance,
			onScrollInTop,
			onScrollInBottom,
			onScrollOutTop,
			onScrollOutBottom,
		} = this.props
		if (!active) {
			return
		}
		const previousScrollY = this.scrollY
		// `window.scrollY` is not supported by Internet Explorer.
		this.scrollY = window.pageYOffset
		const { top, bottom } = this.getCoordinates()
		const scrollDirection = scrollY >= previousScrollY ? 'down' : 'up'
		const screenHeight = window.innerHeight
		const screenTop = this.scrollY
		const screenBottom = this.scrollY + screenHeight
		let result
		let processResult = false
		if (!this.isVisible) {
			if (scrollDirection === 'down' && top < screenBottom + onScrollInDistance && bottom > screenTop) {
				this.isVisible = true
				if (onScrollInBottom) {
					result = onScrollInBottom(this.value)
					processResult = true
				}
			} else if (scrollDirection === 'up' && top < screenBottom && bottom > screenTop - onScrollInDistance) {
				this.isVisible = true
				if (onScrollInTop) {
					result = onScrollInTop(this.value)
					processResult = true
				}
			}
		} else {
			if (scrollDirection === 'down' && bottom < screenTop) {
				this.isVisible = false
				if (onScrollOutTop) {
					result = onScrollOutTop(this.value)
					processResult = true
				}
			} else if (scrollDirection === 'up' && top > screenBottom) {
				this.isVisible = false
				if (onScrollOutBottom) {
					result = onScrollOutBottom(this.value)
					processResult = true
				}
			}
		}
		if (processResult) {
			// If `onScrollInXxx`/`onScrollOutXxx` returns a `Promise`
			// then the tracker is first deactivated and then
			// after the `Promise` resolves or throws it's re-activated.
			if (result && typeof result.then === 'function') {
				this.deactivate()
				result.then(
					(result) => {
						if (result === false) {
							this.deactivate()
						} else {
							this.value = result
							this.activate()
						}
					},
					this.activate
				)
			} else {
				if (result === false) {
					this.deactivate()
				} else {
					this.value = result
				}
			}
		}
	}

	// onMouseWheelThrottled = throttle(this.onMouseWheel, 16.6)
	onScrollThrottled = throttle(this.onScroll, 16.6)

	getCoordinates() {
		const offset = getOffset(this.node.current)
		return {
			top: offset.top,
			bottom: offset.top + offset.height
		}
	}

	render() {
		const {
			wrap,
			children,
			// Rest.
			onScrollInTop,
			onScrollInBottom,
			onScrollOutTop,
			onScrollOutBottom,
			onScrollInDistance,
			value,
			active,
			...rest
		} = this.props

		if (wrap) {
			return (
				<div {...rest} ref={this.node}>
					{children}
				</div>
			)
		}

		return React.cloneElement(children, { nodeRef: this.node })
	}
}