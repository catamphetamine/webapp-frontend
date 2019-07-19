import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ActivityIndicator, FadeInOut } from 'react-responsive-ui'

import { picture } from '../PropTypes'

import './Picture.css'

import Close from '../../assets/images/icons/close.svg'

// When no picture is available for display.
export const TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

const PAGE_LOADED_AT = Date.now()
const DEV_MODE_WAIT_FOR_STYLES = 1000

// Picture border width.
// Could also be read from the CSS variable:
// `parseInt(getComputedStyle(this.container.current).getPropertyValue('--Picture-borderWidth'))`.
export const BORDER_WIDTH = 1

/**
 * A `<Picture/>` is "responsive"
 * showing the size that suits most based on
 * its actual display size (which could be set in "rem"s, for example)
 * with device pixel ratio being taken into account.
 * Refreshes itself on window resize.
 * On server it renders an empty picture.
 * (because there's no way of getting the device pixel ratio on server).
 */
export default class Picture extends React.PureComponent {
	static propTypes = {
		// Container component. Is `<div/>` by default.
		component: PropTypes.elementType.isRequired,

		// When a `<Picture/>` is a preview for a `<Video/>`
		// then the `<Video/>` may supply its own `aspectRatio`
		// so that there's no jump in width or height when a user clicks the preview
		// and the `<Picture/>` is replaced by a `<Video/>`
		// when the `<Video/>` is sized as `maxWidth`/`maxHeight`.
		aspectRatio: PropTypes.number,

		maxWidth: PropTypes.number,
		maxHeight: PropTypes.number,

		width: PropTypes.number,
		height: PropTypes.number,

		// // `<img/>` fade in duration.
		// fadeInDuration: PropTypes.number.isRequired,

		// Any "child" content will be displayed if no picture is present.
		children: PropTypes.node,

		// The image sizing algorithm.
		fit: PropTypes.oneOf([
			'cover',
			'scale-down'
		]).isRequired,

		// Blurs the `<img/>`.
		blur: PropTypes.number,

		// If `picture` is absent then `children` are used.
		picture: picture,

		// If `true` then will only show the smallest size ever.
		useSmallestSize: PropTypes.bool,

		// Set to `false` to not show "loading" background.
		// Is `true` by default.
		showLoadingPlaceholder: PropTypes.bool.isRequired,

		// Set to `true` to show "loading" spinner while the image is being loaded.
		showLoadingIndicator: PropTypes.bool,

		// Set to `true` to show a border around the image.
		border: PropTypes.bool
	}

	static defaultProps = {
		component: 'div',
		// fadeInDuration: 0,
		showLoadingPlaceholder: true
	}

	state = {}

	container = React.createRef()
	picture = React.createRef()

	componentDidMount() {
		this._isMounted = true

		if (!window.interactiveResize) {
			window.interactiveResize = new InteractiveResize()
		}

		// When the DOM node has been mounted
		// its width in pixels is known
		// so an appropriate size can now be picked.
		//
		// This only works when styles are included "statically" on a page.
		// (i.e. via `<link rel="stylesheet" href="..."/>`)
		//
		// It won't work though when loading styles dynamically
		// (via javascript): by the time the component mounts
		// the styles haven't yet been loaded so `this.getWidth()`
		// returns screen width and not the actual `<div/>` width,
		// so, for example, for a 4K monitor and a small picture thumbnail
		// it will still load the full-sized 4K image on page load.
		// There seems to be no way around this issue.
		//
		if (process.env.NODE_ENV === 'production') {
			this.setUpSizing()
		} else {
			const elapsed = Date.now() - PAGE_LOADED_AT
			if (elapsed < DEV_MODE_WAIT_FOR_STYLES) {
				setTimeout(
					() => {
						if (this._isMounted) {
							this.setUpSizing()
						}
					},
					DEV_MODE_WAIT_FOR_STYLES - elapsed
				)
			} else {
				this.setUpSizing()
			}
		}
	}

	setUpSizing = () => {
		this.refreshSize()
		window.interactiveResize.add(this.refreshSize)
	}

	componentWillUnmount() {
		this._isMounted = false
		window.interactiveResize.remove(this.refreshSize)
	}

	componentDidUpdate(prevProps, prevState) {
		const { picture } = this.props
		if (prevProps.picture !== picture) {
			this.refreshSize(true)
		}
	}

	focus = () => {
		if (this.container.current.focus) {
			this.container.current.focus()
		}
	}

	addBorder(dimension) {
		const { border } = this.props
		if (border) {
			return dimension + 2 * BORDER_WIDTH
		}
		return dimension
	}

	excludeBorder(dimension) {
		const { border } = this.props
		if (border) {
			return dimension - 2 * BORDER_WIDTH
		}
		return dimension
	}

	getMaxWidth() {
		const {
			maxWidth,
			maxHeight
		} = this.props
		if (maxWidth) {
			if (maxHeight) {
				return Math.min(maxWidth, maxHeight * this.getAspectRatio())
			}
			return maxWidth
		} else {
			return maxHeight * this.getAspectRatio()
		}
	}

	getContainerStyle() {
		const {
			picture,
			fit,
			width,
			height,
			maxWidth,
			maxHeight
		} = this.props
		if (width || height) {
			return {
				width: this.addBorder(width || (height * this.getAspectRatio())) + 'px',
				height: this.addBorder(height || (width / this.getAspectRatio())) + 'px'
			}
		}
		if (maxWidth || maxHeight) {
			let _maxWidth = this.getMaxWidth()
			if (fit === 'scale-down') {
				_maxWidth = Math.min(_maxWidth, picture.width)
			}
			return {
				width: '100%',
				maxWidth: this.addBorder(_maxWidth) + 'px'
			}
		}
	}

	calculateBlurRadius(blurFactor) {
		const {
			picture,
			width,
			height,
			maxWidth,
			maxHeight
		} = this.props
		let w
		let h
		if (width || height) {
			w = width
			h = height
		}
		else if (maxWidth || maxHeight) {
			w = maxWidth
			h = maxHeight
			const scale = maxWidth ? picture.width / maxWidth : picture.height / maxHeight
			if (scale < 1) {
				if (w) {
					w *= scale
				}
				if (h) {
					h *= scale
				}
			}
		}
		else {
			if (!this.picture.current) {
				return 0
			}
			w = this.picture.current.offsetWidth
			h = this.picture.current.offsetHeight
		}
		return Math.round(Math.min(w || h, h || w) * blurFactor)
	}

	render() {
		const {
			component: Component,
			showLoadingPlaceholder,
			border,
			fit,
			// fadeInDuration,
			blur,
			showLoadingIndicator,
			style,
			className,
			children,
			// Rest.
			picture,
			width,
			height,
			maxWidth,
			maxHeight,
			useSmallestSize,
			aspectRatio,
			...rest
		} = this.props

		const {
			initialImageLoaded,
			initialImageLoadError
		} = this.state

		const imageStyle = fit === 'cover' ? { height: '100%', objectFit: fit } : undefined

		return (
			<Component
				ref={this.container}
				style={style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle()}
				className={classNames(className, 'rrui__picture', {
					'rrui__picture--border': border && !picture.transparentBackground,
					'rrui__picture--background': showLoadingPlaceholder && !picture.transparentBackground // && !initialImageLoaded (transparent PNGs may require some sort of a background after they've loaded)
				})}
				{...rest}>

				{/* Could exclude `width: 100%` here because until the image loads
				the container height is 0 so it's collapsed vertically
				and the aspect ratio is also incorrect when loading styles
				dynamically (via javascript): by the time the component mounts
				`this.getWidth()` returns screen width and not the actual
				`<div/>` width, so aspect ratio is unknown at mount in those cases. */}
				{/* Placeholder must stretch the parent element vertically
				    same as the `<img/>` does it (for maintaining aspect ratio). */}
				{!initialImageLoaded &&
					<div
						style={{ width: '100%', paddingBottom: 100 / this.getAspectRatio() + '%' }}
						className="rrui__picture__placeholder">
						<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={3000}>
							{initialImageLoadError ?
								<Close
									onClick={this.retryInitialImageLoad}
									title="Retry"
									className="rrui__picture__loading-error"/>
								:
								(showLoadingIndicator ?
									<ActivityIndicator className="rrui__picture__loading-indicator"/> :
									<div/>
								)
							}
						</FadeInOut>
					</div>
				}

				{initialImageLoaded &&
					<img
						ref={ this.picture }
						src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.getUrl() || TRANSPARENT_PIXEL) }
						style={ imageStyle }
						className="rrui__picture__image"/>
				}

				{initialImageLoaded && blur &&
					<img
						src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.getUrl() || TRANSPARENT_PIXEL) }
						style={ addBlur(imageStyle, this.calculateBlurRadius(blur)) }
						className="rrui__picture__image rrui__picture__image--blurred"/>
				}

				{ children }
			</Component>
		)
	}

	retryInitialImageLoad = (event) => {
		event.stopPropagation()
		this.setState({
			size: undefined,
			initialImageLoadError: false
		}, this.refreshSize)
	}

	getAspectRatio() {
		const { picture, aspectRatio } = this.props
		const { size } = this.state
		// When a `<Picture/>` is a preview for a `<Video/>`
		// then the `<Video/>` may supply its own `aspectRatio`
		// so that there's no jump in width or height when a user clicks the preview
		// and the `<Picture/>` is replaced by a `<Video/>`
		// when the `<Video/>` is sized as `maxWidth`/`maxHeight`.
		if (aspectRatio) {
			return aspectRatio
		}
		// If the `size` hasn't been selected yet
		// (for example, `componentDidMount()` hasn't been called yet)
		// then use the max size.
		return getAspectRatio(size || picture)
	}

	getPreferredSize = () => {
		const {
			picture,
			useSmallestSize
		} = this.props
		if (useSmallestSize) {
			return getMinSize(picture)
		}
		return getPreferredSize(
			picture,
			this.getPreferredImageWidth()
		)
	}

	refreshSize = (force) => {
		const {
			size
		} = this.state
		const preferredSize = this.getPreferredSize()
		if (force ||
			!size ||
			(preferredSize && preferredSize.width > size.width)) {
			this.onImageChange(preferredSize)
			this.setState({ size: preferredSize })
		}
	}

	onImageChange(newSize) {
		const { size } = this.state
		if (!size) {
			preloadImage(newSize.url).then(() => {
				if (this._isMounted) {
					this.setState({ initialImageLoaded: true })
				}
			}, (error) => {
				console.error(error)
				if (this._isMounted) {
					this.setState({ initialImageLoadError: true })
				}
			})
		}
	}

	// `offsetWidth` and `offsetHeight` include border width.
	getWidth = () => this.container.current.offsetWidth
	getHeight = () => this.container.current.offsetHeight

	getPreferredImageWidth() {
		const {
			picture,
			fit,
			width,
			height
		} = this.props
		if (fit === 'cover') {
			return this.excludeBorder(Math.max(this.getWidth(), this.getHeight() * this.getAspectRatio()))
		}
		return this.excludeBorder(this.getWidth())
	}

	getUrl() {
		const { size } = this.state
		return size && size.url
	}
}

export function getPreferredSize(picture, width, options = {}) {
	const maxSize = {
		type: picture.type,
		width: picture.width,
		height: picture.height,
		url: picture.url
	}
	if (picture.sizes) {
		return _getPreferredSize(
			picture.sizes.concat(maxSize),
			width,
			options
		)
	}
	return maxSize
}

// `sizes` must be sorted from smallest to largest.
function _getPreferredSize(sizes, width, options = {}) {
	if (!width) {
		return sizes[0]
	}
	let pixelRatio = 1
	if (typeof window !== 'undefined' && window.devicePixelRatio) {
		pixelRatio = window.devicePixelRatio
	}
	width *= pixelRatio
	width = Math.floor(width)
	let preferredSize
	for (const size of sizes) {
		// if (size.width > maxWidth) {
		// 	return preferredSize || sizes[0]
		// }
		if (size.width === width) {
			return size
		}
		if (size.width > width) {
			// // Prefer larger size unless it's too oversized.
			// if (saveBandwidth && preferredSize) {
			// 	if ((width - preferredSize.width) / (size.width - width) < 0.35) {
			// 		return preferredSize
			// 	}
			// }
			// 	const aspectRatio = sizes[sizes.length - 1].width / sizes[sizes.length - 1].height
			// 	//
			// 	const w1 = preferredSize.width
			// 	const h1 = preferredSize.height
			// 	const dw1 = width - w1
			// 	const dh1 = dw1 / aspectRatio
			// 	//
			// 	const w2 = size.width
			// 	const h2 = size.height
			// 	const dw2 = w2 - width
			// 	const dh2 = dw2 / aspectRatio
			// 	//
			// 	const dS1 = dw1 * h1 + dh1 * w1 + dw1 * dh1
			// 	const dS2 = dw2 * h2 + dh2 * w2 + dw2 * dh2
			// 	//
			// 	if (dS2 / dS1 > 10) {
			// 		return preferredSize
			// 	}
			return size
		}
		preferredSize = size
	}
	return preferredSize
}

// // Self-test.
// const testSizes = [
// 	{ width: 200, height: 163, type: 'image/jpeg' },
// 	{ width: 248, height: 203, type: 'image/gif' }
// ]

// These tests are non-deterministic because they're using `window.devicePixelRatio`.
// if (_getPreferredSize(testSizes, 220) !== testSizes[1] ||
// 	_getPreferredSize(testSizes, 200) !== testSizes[0]) {
// 	console.error('Picture.getPreferredSize() test didn\'t pass')
// }

class InteractiveResize {
	subscribers = new Set()
	constructor() {
		window.addEventListener('resize', this.onResize)
	}
	add(subscriber) {
		this.subscribers.add(subscriber)
	}
	remove(subscriber) {
		this.subscribers.delete(subscriber)
	}
	onResize = () => {
		clearTimeout(this.debounceTimer)
		this.debounceTimer = setTimeout(this.resize, 500)
	}
	resize = () => {
		this.debounceTimer = undefined
		for (const subscriber of this.subscribers) {
			subscriber()
		}
	}
	destroy() {
		for (const subscriber of this.subscribers) {
			this.unregister(subscriber)
		}
		window.removeEventListener('resize', this.onResize)
	}
}

// Preloads an image before displaying it.
export function preloadImage(url) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = resolve
		image.onerror = (event) => {
			if (event.path && event.path[0]) {
				console.error(`Image not found: ${event.path[0].src}`)
			}
			const error = new Error('IMAGE_NOT_FOUND')
			error.url = url
			error.event = event
			reject(error)
		}
		image.src = url
	})
}

const SVG_FILE_URL = /\.svg/i

export function getAspectRatio(picture) {
	return picture.width / picture.height
}

export function isVector({ type }) {
	return type === 'image/svg+xml' // || (!size && SVG_FILE_URL.test(picture.url))
}

function addBlur(style, radius) {
	return {
		...style,
		// https://caniuse.com/#feat=css-filters
		filter: `blur(${radius}px)`,
		// Works around the white edges bug.
		// https://stackoverflow.com/questions/28870932/how-to-remove-white-border-from-blur-background-image
		width: `calc(100% + ${4 * radius}px)`,
		height: `calc(100% + ${4 * radius}px)`,
		marginLeft: `-${4 * radius / 2}px`,
		marginTop: `-${4 * radius / 2}px`
	}
}

export function getMinSize(picture) {
	return picture.sizes && picture.sizes[0] || picture
}