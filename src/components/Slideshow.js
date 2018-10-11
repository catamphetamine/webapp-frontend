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
		children: PropTypes.arrayOf(pictureShape) // .isRequired
	}

	static defaultProps = {
		i: 0
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
		this.container.current.focus()
		// `this.slides.current` is now available for `this.getSlideshowWidth()`.
		this.forceUpdate()
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
	getSlideWidth = () => this.slide.current.getWidth()

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

		event.preventDefault()

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth()
		const showPrevious = (event.clientX - deltaWidth / 2) / this.getSlideWidth() < 0.33

		if (showPrevious) {
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