import React from 'react'
import PropTypes from 'prop-types'

import Picture from './Picture'
import { pictureShape } from '../PropTypes'

import Close from '../../assets/images/icons/close.svg'

import './Slideshow.css'

export default function SlideshowWrapper(props) {
	if (props.isOpen) {
		return <Slideshow {...props}/>
	}
	return null
}

class Slideshow extends React.Component {
	static propTypes = {
		isOpen: PropTypes.bool,
		onClose: PropTypes.func.isRequired,
		i: PropTypes.number.isRequired,
		fullScreen: PropTypes.bool.isRequired,
		children: PropTypes.arrayOf(pictureShape) // .isRequired
	}

	static defaultProps = {
		i: 0,
		fullScreen: true
	}

	state = {}

	container = React.createRef()
	slides = React.createRef()
	slide = React.createRef()

	constructor(props)
	{
		super(props)

		const { i, children: pictures } = this.props

		this.state.i = i
		this.state.picturesShown = new Array(pictures.length)

		this.markPicturesShown(i)
	}

	componentDidMount() {
		const { fullScreen } = this.props
		if (document.activeElement) {
			this.returnFocusTo = document.activeElement
		}
		this.container.current.focus()
		if (fullScreen) {
			requestFullScreen(this.container.current)
			this.unlistenFullScreen = onFullScreenChange(this.onFullScreenChange)
		}
		// `this.slides.current` is now available for `this.getSlideshowWidth()`.
		this.forceUpdate()
	}

	componentWillUnmount() {
		const { fullScreen } = this.props
		if (fullScreen) {
			exitFullScreen()
			this.unlistenFullScreen()
		}
		if (this.returnFocusTo) {
			this.returnFocusTo.focus()
		}
	}

	onFullScreenChange = () => {
		const { i } = this.state
		this.showPicture(i)
	}

	markPicturesShown(i) {
		const { children: pictures } = this.props
		const { picturesShown } = this.state

		let j = 0
		while (j < pictures.length) {
			picturesShown[j] = j === i - 1 || j === i || j === i + 1
			j++
		}
	}

	showPicture(i) {
		this.markPicturesShown(i)
		this.setState({ i })
	}

	getSlideshowWidth = () => this.slides.current.clientWidth
	getSlideshowHeight = () => this.slides.current.clientHeight

	// For `<img/>` centered horizontally inside an `<li/>`.
	// getSlideWidth = () => this.slide.current.getWidth()

	// For `<img/>` with `object-fit: contain`.
	getSlideWidth = () => {
		return Math.min(
			this.getSlideshowHeight() + this.slide.current.getAspectRatio(),
			this.getSlideshowWidth()
		)
	}

	onBackgroundClick = (event) => {
		if (!event.defaultPrevented) {
			this.close()
		}
	}

	onSlideClick = (event) => {
		const { children: pictures } = this.props
		const { i } = this.state

		// Make background clicks fall through.
		if (event.target !== this.slide.current.picture.current) {
			return
		}

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth()
		const clickPosition = (event.clientX - deltaWidth / 2) / this.getSlideWidth()

		// If clicked outside the image then fall through.
		if (clickPosition < 0 || clickPosition > 1) {
			return
		}

		event.preventDefault()

		if (clickPosition < 0.33) {
			this.showPrevious()
		} else {
			this.showNext()
		}
	}

	close = () => {
		const { onClose } = this.props
		onClose()
	}

	showPrevious() {
		const { i } = this.state

		if (i > 0) {
			this.showPicture(i - 1)
		} else {
			this.close()
		}
	}

	showNext() {
		const { children: pictures } = this.props
		const { i } = this.state

		if (i + 1 < pictures.length) {
			this.showPicture(i + 1)
		} else {
			this.close()
		}
	}

	onKeyDown = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// "Left Arrow".
			// Show previous picture.
			case 37:
				event.preventDefault()
				this.showPrevious()
				return

			// "Right Arrow".
			// Show next picture.
			case 39:
				event.preventDefault()
				this.showNext()
				return

			// "Escape".
			// Close.
			case 27:
				event.preventDefault()
				this.close()
				return
		}
	}

	render() {
		const { isOpen, children: pictures } = this.props
		const { i, picturesShown } = this.state

		if (!isOpen) {
			return null
		}

		// `tabIndex={ -1 }` makes the `<div/>` focusable.

		return (
			<div
				ref={this.container}
				tabIndex={-1}
				className="slideshow"
				onKeyDown={this.onKeyDown}>
				<ul
					ref={this.slides}
					style={{
						transform: this.slides.current ? `translateX(-${this.getSlideshowWidth() * i}px)` : undefined,
						opacity: this.slides.current ? 1 : 0
					}}
					className="slideshow__slides">
					{pictures.map((picture, j) => (
						<li
							key={j}
							className="slideshow__slide"
							onClick={this.onBackgroundClick}>
							{picturesShown[j] &&
								<Picture
									ref={j === i ? this.slide : undefined}
									sizes={picture.sizes}
									onClick={this.onSlideClick}
									fit="contain"
									className="slideshow__picture"/>
							}
						</li>
					))}
				</ul>

				<button
					type="button"
					onClick={this.close}
					className="rrui__button-reset slideshow__close">
					<Close className="slideshow__close-icon"/>
				</button>
			</div>
		);
	}
}

SlideshowWrapper.propTypes = Slideshow.propTypes
SlideshowWrapper.defaultProps = Slideshow.defaultProps

function requestFullScreen(element) {
	if (document.fullscreenElement ||
		document.mozFullScreenElement ||
		document.webkitFullscreenElement) {
		return
	}
	if (element.requestFullscreen) {
		element.requestFullscreen()
	} else if (element.mozRequestFullScreen) {
		element.mozRequestFullScreen()
	} else if (element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen()
	}
}

function exitFullScreen(element) {
	if (document.cancelFullScreen) {
		document.cancelFullScreen()
	} else if (document.mozCancelFullScreen) {
		document.mozCancelFullScreen()
	} else if (document.webkitCancelFullScreen) {
		document.webkitCancelFullScreen()
	}
}

function onFullScreenChange(handler) {
	document.addEventListener('webkitfullscreenchange', handler)
	document.addEventListener('mozfullscreenchange', handler)
	document.addEventListener('fullscreenchange', handler)
	return () => {
		document.removeEventListener('webkitfullscreenchange', handler)
		document.removeEventListener('mozfullscreenchange', handler)
		document.removeEventListener('fullscreenchange', handler)
	}
}