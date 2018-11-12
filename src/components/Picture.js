import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ActivityIndicator, FadeInOut } from 'react-responsive-ui'

import './Picture.css'

import Close from '../../assets/images/icons/close.svg'

// When no picture is available for display.
const TRANSPARENT_PIXEL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII='

/**
 * A `<Picture/>` is passed `sizes` and is "responsive"
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
		// Can be set up to load images no wider than `maxWidth`.
		// E.g. for saving bandwidth, but I guess it won't be used.
		maxWidth : PropTypes.number,

		// By default a border will be added around the picture.
		// Set to `false` to not add border for picture.
		border : PropTypes.bool.isRequired,

		// Can show a spinner while the initial image is loading.
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
			'width',
			'repeat-x'
		]).isRequired,

		// (optional)
		// Image type (for example, vector or raster).
		type: PropTypes.oneOf([
			'image/svg+xml',
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/webp'
		]),

		// Available image sizes.
		sizes : PropTypes.arrayOf(PropTypes.shape
		({
			// Image size width.
			// `width` can be omitted for vector graphics.
			width : PropTypes.number,

			// Image size file name.
			// A full URL will be constructed based on this file name.
			url : PropTypes.string.isRequired
		}))
	}

	static defaultProps =
	{
		fit: 'width',
		border: false,
		showLoadingPlaceholder: false,
		// fadeInDuration: 0
	}

	state = {}

	container = React.createRef()
	picture = React.createRef()

	componentDidMount()
	{
		const { sizes } = this.props

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
		// the styles haven't yet been loaded so `this.getWidth()`
		// returns screen width and not the actual `<div/>` width,
		// so, for example, for a 4K monitor and a small picture thumbnail
		// it will still load the full-sized 4K image on page load.
		// There seems to be no way around this issue.
		//
		this.refreshSize()

		if (!window.interactiveResize) {
			window.interactiveResize = new InteractiveResize()
		}

		window.interactiveResize.add(this.refreshSize)
	}

	componentWillUnmount()
	{
		this._isMounted = false
		window.interactiveResize.remove(this.refreshSize)
	}

	componentDidUpdate(prevProps)
	{
		const { sizes } = this.props
		if (prevProps.sizes !== sizes) {
			this.refreshSize(true)
		}
	}

	render()
	{
		const
		{
			fit,
			border,
			showLoadingPlaceholder,
			// fadeInDuration,
			className,
			children,
			// Rest.
			type,
			sizes,
			...rest
		}
		= this.props

		let { style } = this.props

		const {
			initialImageLoaded,
			initialImageLoadError
		} = this.state

		// The aspect ratio is also incorrect when loading styles
		// dynamically (via javascript): by the time the component mounts
		// `this.getWidth()` returns screen width and not the actual
		// `<div/>` width, so aspect ratio is unknown at mount in those cases.
		// if (fit === 'width') {
		// 	if (this._isMounted) {
		// 		style = {
		// 			...style,
		// 			minHeight: `${this.getHeight()}px`
		// 		}
		// 	}
		// }

		if (fit === 'repeat-x') {
			style = {
				...style,
				backgroundImage: `url(${ this.url() || TRANSPARENT_PIXEL })`
			}
		}

		return (
			<div
				ref={ this.container }
				style={ style }
				className={ classNames('rrui__picture', {
					'rrui__picture--repeat-x' : fit === 'repeat-x',
					// 'rrui__picture--cover' : fit === 'cover',
					// 'rrui__picture--contain' : fit === 'contain',
					'rrui__picture--border' : border
				},
				className) }
				{...rest}>

				{/* Excluding `fit: width` here because until the image loads
				the container height is 0 so it's collapsed vertically
				and the aspect ratio is also incorrect when loading styles
				dynamically (via javascript): by the time the component mounts
				`this.getWidth()` returns screen width and not the actual
				`<div/>` width, so aspect ratio is unknown at mount in those cases. */}
				{ !initialImageLoaded && fit !== 'width' && showLoadingPlaceholder &&
					<div className="rrui__picture__loading-container">
						<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={3000}>
							{initialImageLoadError	?
								<Close
									onClick={this.retryInitialImageLoad}
									title="Retry"
									className="rrui__picture__loading rrui__picture__loading--error"/>
								:
								<ActivityIndicator className="rrui__picture__loading"/>
							}
						</FadeInOut>
					</div>
				}

				{/*
					<FadeInOut show fadeInInitially fadeInDuration={fadeInDuration} fadeOutDuration={0}>
					</FadeInOut>
				*/}

				{ initialImageLoaded && fit !== 'repeat-x' &&
						<img
							ref={ this.picture }
							src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.url() || TRANSPARENT_PIXEL) }
							style={ getImageStyle(fit, this.isVector()) }
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

	refreshSize = (force) =>
	{
		const { sizes } = this.props
		const { size } = this.state

		if (!sizes) {
			return
		}

		const preferredSize = this.getPreferredSize(sizes)

		if (force ||
			!size ||
			(preferredSize && preferredSize.width > size.width))
		{
			this.onImageChange(preferredSize)
			this.setState({ size: preferredSize })
		}
	}

	onImageChange(newSize) {
		const { size } = this.state
		if (!size) {
			prefetchImage(newSize.url).then(() => {
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

	getWidth = () => {
		return this.picture.current ? this.picture.current.offsetWidth : this.container.current.offsetWidth
	}

	getPreferredSize(sizes)
	{
		const { maxWidth } = this.props

		if (sizes) {
			return getPreferredSize(sizes, this.getPreferredWidth(), maxWidth)
		}
	}

	getPreferredWidth()
	{
		const { fit } = this.props
		const { size } = this.state

		switch (fit) {
			case 'width':
				return this.getWidth()
			case 'repeat-x':
				return this.getContainerHeight() * this.getAspectRatio()
			case 'cover':
				return Math.max(this.getWidth(), this.getContainerHeight() * this.getAspectRatio())
			case 'contain':
				return Math.min(this.getWidth(), this.getContainerHeight() * this.getAspectRatio())
			case 'scale-down':
				if (this.isVector() || !size) {
					return Math.min(this.getWidth(), this.getContainerHeight() * this.getAspectRatio())
				}
				return Math.min(this.getWidth(), size.width)
			default:
				throw new Error(`Unknown picture fit: ${fit}.`)
		}
	}

	getHeight() {
		const { fit } = this.props
		const { size } = this.state

		switch (fit) {
			case 'width':
				return this.getWidth() / this.getAspectRatio()
			case 'repeat-x':
				return this.getContainerHeight()
			case 'cover':
				return Math.max(this.getContainerHeight(), this.getWidth() / this.getAspectRatio())
			case 'contain':
				return Math.min(this.getContainerHeight(), this.getWidth() / this.getAspectRatio())
			case 'scale-down':
				if (this.isVector() || !size) {
					return Math.min(this.getContainerHeight(), this.getWidth() / this.getAspectRatio())
				}
				return Math.min(this.getContainerHeight(), size.height)
			default:
				throw new Error(`Unknown picture fit: ${fit}.`)
		}
	}

	isVector() {
		const { type } = this.props
		const { size } = this.state
		return type === 'image/svg+xml' || (size && SVG_FILE_URL.test(size.url))
	}

	getAspectRatio()
	{
		const { sizes } = this.props
		if (sizes) {
			return sizes[sizes.length - 1].width / sizes[sizes.length - 1].height
		}
	}

	url()
	{
		const { size } = this.state

		if (size) {
			return size.url
		}
	}
}

// `sizes` must be sorted from smallest to largest.
export function getPreferredSize(sizes, width, maxWidth)
{
	if (!width) {
		return sizes[0]
	}

	let pixelRatio = 1

	if (typeof window !== 'undefined' && window.devicePixelRatio) {
		pixelRatio = window.devicePixelRatio
	}

	width *= pixelRatio

	let previousSize
	for (const size of sizes)
	{
		if (size.width > maxWidth) {
			return previousSize || sizes[0]
		}
		if (size.width >= width) {
			return size
		}
		previousSize = size
	}

	return sizes[sizes.length - 1]
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

function getImageStyle(fit, isVector) {
	switch (fit) {
		case 'cover':
			return IMAGE_STYLE_COVER
		case 'contain':
			return IMAGE_STYLE_CONTAIN
		case 'scale-down':
			return isVector ? IMAGE_STYLE_CONTAIN : IMAGE_STYLE_SCALE_DOWN
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
function prefetchImage(url)
{
	return new Promise((resolve, reject) =>
	{
		const image = new Image()
		// image.onload = () => setTimeout(resolve, 1000)
		image.onload = resolve
		image.onerror = reject
		image.src = url
	})
}

const SVG_FILE_URL = /\.svg/i