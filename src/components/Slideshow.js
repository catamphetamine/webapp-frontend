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

	slide = React.createRef()
	slides = React.createRef()

	constructor(props)
	{
		super(props)

		const { i, children: pictures } = this.props

		this.state.i = i
		this.state.picturesShown = new Array(pictures.length)

		this.markPicturesShown(i)
	}

	componentDidMount() {
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
		const { onClose } = this.props

		if (!event.defaultPrevented) {
			onClose()
		}
	}

	onSlideClick = (event) => {
		const { onClose, children: pictures } = this.props
		const { i } = this.state

		// Make background clicks fall through.
		if (event.target !== this.slide.current.picture.current) {
			return
		}

		event.preventDefault()

		const deltaWidth = this.getSlideshowWidth() - this.getSlideWidth()
		const showPrevious = (event.clientX - deltaWidth / 2) / this.getSlideWidth() < 0.33

		if (showPrevious) {
			if (i > 0) {
				this.showPicture(i - 1)
			} else {
				onClose()
			}
		} else {
			if (i + 1 < pictures.length) {
				this.showPicture(i + 1)
			} else {
				onClose()
			}
		}
	}

	render() {
		const { isOpen, onClose, children: pictures } = this.props
		const { i, picturesShown } = this.state

		if (!isOpen) {
			return null
		}

		return (
			<div className="slideshow">
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
					onClick={onClose}
					className="rrui__button-reset slideshow__close">
					<Close className="slideshow__close-icon"/>
				</button>
			</div>
		);
	}
}

SlideshowWrapper.propTypes = Slideshow.propTypes
SlideshowWrapper.defaultProps = Slideshow.defaultProps