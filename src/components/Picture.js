import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

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

		// Any "child" content will be displayed if no picture is present.
		children : PropTypes.node,

		// The image sizing algorythm.
		fit : PropTypes.oneOf(['cover', 'repeat-x', 'width']).isRequired,

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
		border : false
	}

	state = {}

	container = React.createRef()
	picture = React.createRef()

	componentDidMount()
	{
		const { sizes } = this.props

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
			className,
			children
		}
		= this.props

		let { style } = this.props

		if (fit !== 'width')
		{
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
					'picture--cover' : fit === 'cover',
					'picture--border' : border
				},
				className) }>

				{ fit === 'width' &&
					<img
						ref={ this.picture }
						src={ typeof window === 'undefined' ? TRANSPARENT_PIXEL : (this.url() || TRANSPARENT_PIXEL) }
						style={ IMAGE_STYLE }
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
			this.setState({ size: preferredSize })
		}
	}

	getContainerHeight = () => this.container.current.offsetHeight

	width = () => this.picture.current ? this.picture.current.offsetWidth : this.container.current.offsetWidth

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
				return this.width()
			case 'repeat-x':
				return this.getContainerHeight() * this.getAspectRatio()
			case 'cover':
				return Math.max(this.width(), this.getContainerHeight() * this.getAspectRatio())
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

const IMAGE_STYLE =
{
	// boxSizing : 'content-box',
	maxWidth  : '100%',
	maxHeight : '100%',
	borderRadius : 'inherit'
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