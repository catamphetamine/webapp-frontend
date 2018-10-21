import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { ActivityIndicator, FadeInOut } from 'react-responsive-ui'

import './Picture.css'

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

		// Any "child" content will be displayed if no picture is present.
		children : PropTypes.node,

		// The image sizing algorythm.
		fit : PropTypes.oneOf([
			'cover',
			'contain',
			'width',
			'repeat-x'
		]).isRequired,

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
		fit : 'width',
		border : false,
		showLoadingPlaceholder : false
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
			className,
			children,
			// Rest.
			sizes,
			...rest
		}
		= this.props

		let { style } = this.props

		const { initialImageLoaded } = this.state

		// For some reason on component mount `this.getWidth()`
		// returns screen width and not the actual `<div/>` width
		// which is weird, so not maintaining aspect ratio here.
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
				className={ classNames('picture', {
					'picture--repeat-x' : fit === 'repeat-x',
					// 'picture--cover' : fit === 'cover',
					// 'picture--contain' : fit === 'contain',
					'picture--border' : border
				},
				className) }
				{...rest}>

				{/* Excluding `fit: width` here because until the image loads
				the container height is 0 so it's collapsed vertically
				and the aspect ratio is also incorrect due to a browser bug. */}
				{ !initialImageLoaded && fit !== 'width' && showLoadingPlaceholder &&
					<div className="picture__loading-container">
						<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={3000}>
							<ActivityIndicator className="picture__loading"/>
						</FadeInOut>
					</div>
				}

				{ initialImageLoaded && fit !== 'repeat-x' &&
					<img
						ref={ this.picture }
						src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.url() || TRANSPARENT_PIXEL) }
						style={ getImageStyle(fit) }
						className="picture__image"/>
				}

				{ children }
			</div>
		)
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

		switch (fit) {
			case 'width':
				return this.getWidth()
			case 'repeat-x':
				return this.getContainerHeight() * this.getAspectRatio()
			case 'cover':
				return Math.max(this.getWidth(), this.getContainerHeight() * this.getAspectRatio())
			case 'contain':
				return Math.min(this.getWidth(), this.getContainerHeight() * this.getAspectRatio())
			default:
				throw new Error(`Unknown picture fit: ${fit}.`)
		}
	}

	getHeight() {
		const { fit } = this.props

		switch (fit) {
			case 'width':
				return this.getWidth() / this.getAspectRatio()
			case 'repeat-x':
				return this.getContainerHeight()
			case 'cover':
				return Math.max(this.getContainerHeight(), this.getWidth() / this.getAspectRatio())
			case 'contain':
				return Math.min(this.getContainerHeight(), this.getWidth() / this.getAspectRatio())
			default:
				throw new Error(`Unknown picture fit: ${fit}.`)
		}
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

const IMAGE_STYLE_FIT_WIDTH =
{
	maxWidth  : '100%',
	maxHeight : '100%',
	borderRadius : 'inherit'
}

const IMAGE_STYLE_COVER =
{
	width  : '100%',
	height : '100%',
	objectFit : 'cover',
	borderRadius : 'inherit'
}

const IMAGE_STYLE_CONTAIN =
{
	width  : '100%',
	height : '100%',
	objectFit : 'contain',
	borderRadius : 'inherit'
}

function getImageStyle(fit) {
	switch (fit) {
		case 'cover':
			return IMAGE_STYLE_COVER
		case 'contain':
			return IMAGE_STYLE_CONTAIN
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
		image.onload = () => resolve()
		image.onerror = reject
		image.src = url
	})
}