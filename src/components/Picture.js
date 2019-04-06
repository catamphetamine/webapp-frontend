import React, { PureComponent } from 'react'
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

/**
 * A `<Picture/>` is "responsive"
 * showing the size that suits most based on
 * its actual display size (which could be set in "rem"s, for example)
 * with device pixel ratio being taken into account.
 * Refreshes itself on window resize.
 * On server it renders an empty picture.
 * (because there's no way of getting the device pixel ratio on server).
 */
export default class Picture extends PureComponent
{
	static propTypes =
	{
		// When a GIF picture is rendered and `preview` is `true`
		// then it will output a non-gif preview (if available).
		preview : PropTypes.bool,

		maxWidth : PropTypes.number,
		maxHeight: PropTypes.number,

		width : PropTypes.number,
		height : PropTypes.number,

		// By default a border will be added around the picture.
		// Set to `false` to not add border for picture.
		border : PropTypes.bool.isRequired,

		// Can show a spinner while the initial image is loading.
		// Will display the image over the loading indicator.
		showLoadingIndicator : PropTypes.bool.isRequired,

		// Can show a spinner while the initial image is loading.
		// Will show the image only after it loads.
		showLoadingPlaceholder : PropTypes.bool.isRequired,

		// // `<img/>` fade in duration.
		// fadeInDuration : PropTypes.number.isRequired,

		// Any "child" content will be displayed if no picture is present.
		children : PropTypes.node,

		// The image sizing algorythm.
		fit : PropTypes.oneOf([
			'cover',
			'contain',
			'scale-down',
			'repeat-x'
		]).isRequired,

		// Blurs the `<img/>`.
		blur : PropTypes.number,

		// (optional)
		// Image type (for example, vector or raster).
		type: PropTypes.oneOf([
			'image/svg+xml',
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp'
		]),

		picture: picture,

		// // In "bandwidth saving" mode it won't load
		// // sharper images for "retina" displays
		// // and it also won't load larger images
		// // until their respective size is surpassed.
		// In "bandwidth saving" mode it won't load larger images
		// until their respective size is surpassed.
		saveBandwidth: PropTypes.bool.isRequired
	}

	static defaultProps =
	{
		border: false,
		showLoadingPlaceholder: false,
		showLoadingIndicator: false,
		saveBandwidth: false,
		// fadeInDuration: 0
	}

	state = {}

	container = React.createRef()
	picture = React.createRef()

	componentDidMount() {
		this._isMounted = true

		// When the DOM node has been mounted
		// its width in pixels is known
		// so an appropriate size can now be picked.
		//
		// This only works when styles are included "statically" on a page.
		// (i.e. via `<link rel="stylesheet" href="..."/>`)
		//
		// It won't work though when loading styles dynamically
		// (via javascript): by the time the component mounts
		// the styles haven't yet been loaded so `this.getContainerWidth()`
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
				setTimeout(this.setUpSizing, DEV_MODE_WAIT_FOR_STYLES - elapsed)
			} else {
				this.setUpSizing()
			}
		}
	}

	setUpSizing = () => {
		this.refreshSize()
		if (!window.interactiveResize) {
			window.interactiveResize = new InteractiveResize()
		}
		window.interactiveResize.add(this.refreshSize)
	}

	componentWillUnmount() {
		this._isMounted = false
		window.interactiveResize.remove(this.refreshSize)
	}

	componentDidUpdate(prevProps) {
		const { picture } = this.props
		if (prevProps.picture !== picture) {
			this.refreshSize(true)
		}
	}

	getFit() {
		const {
			fit,
			width,
			height,
			maxWidth,
			maxHeight
		} = this.props
		if (fit) {
			return fit
		}
		if (width || height) {
			return 'exact'
		}
		if (maxWidth || maxHeight) {
			return 'exact-contain'
		}
		return 'width'
	}

	getContainerStyle() {
		const {
			picture,
			width,
			height,
			maxWidth,
			maxHeight
		} = this.props
		const fit = this.getFit()
		switch (fit) {
			case 'repeat-x':
				return {
					backgroundImage: `url(${ this.getUrl() || TRANSPARENT_PIXEL })`
				}
			case 'width':
			case 'exact-contain':
				return {
					paddingBottom: 100 / getAspectRatio(picture) + '%'
				}
			case 'exact':
				return {
					width: (width || (height * getAspectRatio(picture))) + 'px',
					height: (height || (width / getAspectRatio(picture))) + 'px'
				}
			case 'contain':
			case 'cover':
			case 'scale-down':
				let maxSize
				if (maxWidth && maxHeight) {
					maxSize = scaleDownSize(picture, maxWidth, maxHeight, fit)
				} else if (fit === 'scale-down') {
					maxSize = picture
				}
				if (maxSize) {
					return {
						maxWidth: maxSize.width,
						maxHeight: maxSize.height
					}
				}
				return
		}
	}

	render() {
		const {
			picture,
			maxWidth,
			maxHeight
		} = this.props
		const fit = this.getFit()
		switch (fit) {
			case 'exact-contain':
				// Setting `max-width: 100%` on the top-most container to make
				// the whole thing downsize when the page width is not enough.
				// Percentage `padding-bottom` is set on child element which sets aspect ratio.
				// Setting `max-width` together with `padding-bottom` doesn't work:
				// aspect ratio is not being inforced in that case.
				// That's the reason the extra wrapper is introduced.
				return (
					<div style={{
						maxWidth: (maxWidth || (maxHeight * getAspectRatio(picture))) + 'px'
					}}>
						{this.render_(fit)}
					</div>
				)
			default:
				return this.render_(fit)
		}
	}

	render_(fit) {
		const {
			border,
			showLoadingPlaceholder,
			showLoadingIndicator,
			// fadeInDuration,
			blur,
			style,
			className,
			children,
			// Rest.
			fit: _fit,
			preview,
			picture,
			width,
			height,
			maxWidth,
			maxHeight,
			saveBandwidth,
			...rest
		} = this.props

		const {
			initialImageLoaded,
			initialImageLoadError
		} = this.state

		// The aspect ratio is also incorrect when loading styles
		// dynamically (via javascript): by the time the component mounts
		// `this.getContainerWidth()` returns screen width and not the actual
		// `<div/>` width, so aspect ratio is unknown at mount in those cases.
		// if (fit === 'width') {
		// 	if (this._isMounted) {
		// 		style = {
		// 			...style,
		// 			minHeight: `${this.getHeight()}px`
		// 		}
		// 	}
		// }

		const showImagePlaceholder = showLoadingPlaceholder && !initialImageLoaded

		return (
			<div
				ref={this.container}
				style={style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle()}
				className={classNames(className, 'rrui__picture', {
					'rrui__picture--repeat-x': fit === 'repeat-x',
					'rrui__picture--border': border
				})}
				{...rest}>

				{/* Excluding `fit: width` here because until the image loads
				the container height is 0 so it's collapsed vertically
				and the aspect ratio is also incorrect when loading styles
				dynamically (via javascript): by the time the component mounts
				`this.getContainerWidth()` returns screen width and not the actual
				`<div/>` width, so aspect ratio is unknown at mount in those cases. */}
				{ ((showLoadingPlaceholder || showLoadingIndicator) && !initialImageLoaded) && fit !== 'width' &&
					<div className="rrui__picture__loading-container">
						<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={3000}>
							{initialImageLoadError ?
								<Close
									onClick={this.retryInitialImageLoad}
									title="Retry"
									className="rrui__picture__loading rrui__picture__loading--error"/>
								:
								<ActivityIndicator className="post__attachment-thumbnail__loading-indicator"/>
							}
						</FadeInOut>
					</div>
				}

				{/*
					<FadeInOut show fadeInInitially fadeInDuration={fadeInDuration} fadeOutDuration={0}>
					</FadeInOut>
				*/}

				{ !(showLoadingPlaceholder && !initialImageLoaded) && fit !== 'repeat-x' &&
					<img
						ref={ this.picture }
						src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.getUrl() || TRANSPARENT_PIXEL) }
						style={ blur ? addBlur(getImageStyle(fit), blur) : getImageStyle(fit) }
						className="rrui__picture__image"/>
				}

				{ children }
			</div>
		)
	}

	retryInitialImageLoad = (event) => {
		event.stopPropagation()
		this.setState({
			size: undefined,
			initialImageLoadError: false
		}, this.refreshSize)
	}

	getPreferredSize = () => {
		const {
			preview,
			saveBandwidth,
			picture
		} = this.props
		const maxSize = {
			type: picture.type,
			width: picture.width,
			height: picture.height,
			url: picture.url
		}
		if (picture.sizes) {
			return getPreferredSize(
				picture.sizes.concat(maxSize),
				this.getWidth(),
				{
					preview,
					saveBandwidth
				}
			)
		}
		return maxSize
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

	getContainerHeight = () => this.container.current.offsetHeight
	getContainerWidth = () => this.container.current.offsetWidth

	// getContainerWidth = () => {
	// 	return this.picture.current ? this.picture.current.offsetWidth : this.container.current.offsetWidth
	// }

	getWidth() {
		const { picture } = this.props
		return getWidth(
			picture,
			this.getFit(),
			this.getContainerWidth(),
			this.getContainerHeight()
		)
	}

	getHeight() {
		const { picture } = this.props
		return getHeight(
			picture,
			this.getFit(),
			this.getContainerWidth(),
			this.getContainerHeight()
		)
	}

	getUrl() {
		const { size } = this.state
		return size && size.url
	}
}

// `sizes` must be sorted from smallest to largest.
export function getPreferredSize(sizes, width, options = {}) {
	const {
		preview,
		saveBandwidth
	} = options
	if (!width) {
		return sizes[0]
	}
	let pixelRatio = 1
	if (typeof window !== 'undefined' && window.devicePixelRatio) {
		if (!saveBandwidth) {
			pixelRatio = window.devicePixelRatio
		}
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
			// Prefer larger size unless it's too oversized.
			if (saveBandwidth && preferredSize) {
				if ((width - preferredSize.width) / (size.width - width) < 0.35) {
					return preferredSize
				}
			}
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
		// When a GIF is small enough a JPG preview is generated,
		// and so `sizes` contains the JPF preview and the original GIF
		// which are of the same size so without this explicit `if` check
		// the size returned would be the original GIF and not the JPG preview.
		if (preview && preferredSize && preferredSize.width === size.width) {
			// Skip this one (most likely the original GIF animation).
		} else {
			preferredSize = size
		}
	}
	return preferredSize
}

const IMAGE_STYLE_BASE =
{
	width  : '100%',
	height : '100%',
	borderRadius : 'inherit'
}

const IMAGE_STYLE_FIT_WIDTH =
{
	...IMAGE_STYLE_BASE,
	position: 'absolute',
	// width : 'auto',
	height : 'auto',
	objectFit : 'contain',
	// maxWidth  : '100%',
	// maxHeight : '100%'
}

const IMAGE_STYLE_COVER =
{
	...IMAGE_STYLE_BASE,
	objectFit : 'cover'
}

const IMAGE_STYLE_CONTAIN =
{
	...IMAGE_STYLE_BASE,
	objectFit : 'contain'
}

const IMAGE_STYLE_SCALE_DOWN =
{
	...IMAGE_STYLE_BASE,
	objectFit : 'scale-down'
}

function getImageStyle(fit) {
	switch (fit) {
		case 'cover':
			return IMAGE_STYLE_COVER
		case 'contain':
			return IMAGE_STYLE_CONTAIN
		case 'scale-down':
			return IMAGE_STYLE_SCALE_DOWN
		case 'exact':
			return IMAGE_STYLE_BASE
		case 'exact-contain':
		default:
			return IMAGE_STYLE_FIT_WIDTH
	}
}

class InteractiveResize
{
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
			reject(event)
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

function getWidth(picture, fit, containerWidth, containerHeight) {
	switch (fit) {
		case 'width':
		case 'exact':
		case 'exact-contain':
			return containerWidth
		case 'repeat-x':
			return containerHeight * getAspectRatio(picture)
		case 'cover':
			return Math.max(containerWidth, containerHeight * getAspectRatio(picture))
		case 'contain':
			return Math.min(containerWidth, containerHeight * getAspectRatio(picture))
		case 'scale-down':
			// if (isVector(picture)) {
			// 	// Fit vector images as "contain".
			// 	return getWidth(picture, 'contain', containerWidth, containerHeight)
			// }
			return Math.min(containerWidth, picture.width)
		default:
			throw new Error(`Unknown picture fit: ${fit}.`)
	}
}

function getHeight(picture, fit, containerWidth, containerHeight) {
	switch (fit) {
		case 'width':
			return containerWidth / getAspectRatio(picture)
		case 'exact':
		case 'exact-contain':
			return containerHeight
		case 'repeat-x':
			return containerHeight
		case 'cover':
			return Math.max(containerHeight, containerWidth / getAspectRatio(picture))
		case 'contain':
			return Math.min(containerHeight, containerWidth / getAspectRatio(picture))
		case 'scale-down':
			// if (isVector(picture)) {
			// 	// Fit vector images as "contain".
			// 	return getHeight(picture, fit, containerWidth, containerHeight)
			// }
			return Math.min(containerHeight, picture.height)
		default:
			throw new Error(`Unknown picture fit: ${fit}.`)
	}
}

export function scaleDownSize(size, maxWidth, maxHeight, fit) {
	let widthFactor = size.width / maxWidth
	let heightFactor = size.height / maxHeight
	if (fit === 'cover' || fit === 'contain') {
		const maxFactor = Math.max(widthFactor, heightFactor)
		if (maxFactor < 1) {
			const factorMultiplier = 1 / maxFactor
			widthFactor *= factorMultiplier
			heightFactor *= factorMultiplier
		}
	}
	const sizeFactor = Math.max(widthFactor, heightFactor)
	if (sizeFactor > 1) {
		return {
			width: size.width / sizeFactor,
			height: size.height / sizeFactor
		}
	}
	return size
}

function addBlur(style, radius) {
	return {
		...style,
		// https://caniuse.com/#feat=css-filters
		filter: `blur(${radius}px)`,
		// Works around the white edges bug.
		// https://stackoverflow.com/questions/28870932/how-to-remove-white-border-from-blur-background-image
		width: `calc(100% + ${2 * radius}px)`,
		height: `calc(100% + ${2 * radius}px)`,
		marginLeft: `-${radius}px`,
		marginTop: `-${radius}px`
	}
}