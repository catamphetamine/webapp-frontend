import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { video } from '../PropTypes'
import { getEmbeddedVideoUrl, getVideoUrl } from '../utility/video'

import Picture, { scaleDownSize } from './Picture'
import VideoPlayIcon from './VideoPlayIcon'

import './Video.css'

export default class Video extends React.Component {
	state = {
		showPreview: this.props.showPreview, // && this.props.video.picture,
		autoPlay: this.props.autoPlay
	}

	button = React.createRef()
	video = React.createRef()

	componentDidUpdate(prevProps) {
		// On `showPreview` property change.
		if (this.props.showPreview !== prevProps.showPreview) {
			this.setState({
				showPreview: this.props.showPreview
			})
		}
		// On `autoPlay` property change.
		if (this.props.autoPlay !== prevProps.autoPlay) {
			this.setState({
				autoPlay: this.props.autoPlay
			})
		}
		// On `canPlay` property change.
		if (this.props.canPlay !== prevProps.canPlay) {
			if (!this.props.canPlay && this.props.showPreview) {
				this.setState({
					showPreview: true,
					autoPlay: false
				})
			}
		}
	}

	focus = () => {
		if (this.button.current) {
			this.button.current.focus()
		} else if (this.video.current) {
			this.video.current.focus()
		} else {
			return false
		}
	}

	// `<video/>` docs:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

	play = () => {
		if (this.video.current) {
			this.video.current.play()
			return true
		}
	}

	pause = () => {
		if (this.video.current) {
			this.video.current.pause()
			return true
		}
	}

	isPaused = () => {
		if (this.video.current) {
			return this.video.current.paused
		}
	}

	isStart = () => {
		if (this.video.current) {
			return this.video.current.currentTime === 0
		}
	}

	isEnd = () => {
		if (this.video.current) {
			return this.video.current.ended
		}
	}

	seek = (forward) => {
		const seconds = forward ? 5 : -5
		if (this.video.current) {
			this.video.current.currentTime += seconds
			return true
		}
	}

	showVideo = () => {
		this.setState({
			showPreview: false,
			autoPlay: true
		}, this.focus)
	}

	onClick = (event) => {
		const { onClick } = this.props
		const { showPreview } = this.state
		if (onClick) {
			onClick(event)
		}
		if (showPreview && !event.defaultPrevented) {
			event.preventDefault()
			this.showVideo()
		}
	}

	onKeyDown = (event) => {
		const { seekOnArrowKeys } = this.props
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// (is already handled by the `<video/>` itself)
			// // Pause/Play on Spacebar.
			// case 32:
			// 	if (video.isPaused()) {
			// 		video.play()
			// 	} else {
			// 		video.pause()
			// 	}
			// 	event.preventDefault()
			// 	break

			// Seek backwards on Left Arrow key.
			case 37:
				if (seekOnArrowKeys) {
					if (this.seek(false)) {
						event.preventDefault()
					}
				}
				break

			// Seek forward on Right Arrow key.
			case 39:
				if (seekOnArrowKeys) {
					if (this.seek(true)) {
						event.preventDefault()
					}
				}
				break
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
			video,
			maxWidth,
			maxHeight
		} = this.props
		const fit = this.getFit()
		switch (fit) {
			case 'width':
			case 'exact-contain':
				return {
					paddingBottom: 100 / getAspectRatio(video) + '%'
				}
			case 'scale-down':
				let maxSize = getMaxSize(video)
				if (maxWidth && maxHeight) {
					maxSize = scaleDownSize(maxSize, maxWidth, maxHeight, fit)
				}
				return {
					maxWidth: maxSize.width,
					maxHeight: maxSize.height
				}
		}
	}

	render() {
		const {
			video,
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
						maxWidth: (maxWidth || (maxHeight * getAspectRatio(video))) + 'px'
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
			video,
			// width,
			// height,
			onClick,
			tabIndex,
			style,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		const _style = style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle()
		const _className = classNames(className, 'rrui__video', {
			'rrui__video--aspect-ratio': fit === 'width'
		})

		if (showPreview) {
			// Percentage `padding-bottom` is set on the `<button/>` to enforce aspect ratio.
			return (
				<button
					ref={this.button}
					type="button"
					aria-label={this.props['aria-label']}
					onClick={this.onClick}
					tabIndex={tabIndex}
					style={_style}
					className={classNames('rrui__button-reset', 'rrui__video__button', _className)}>
					{this.renderPreview()}
				</button>
			)
		}

		// Percentage `padding-bottom` is set on the `<div/>` to enforce aspect ratio.
		return (
			<div
				ref={this.container}
				style={_style}
				className={_className}>
				{this.renderVideo()}
			</div>
		)
	}

	renderPreview() {
		const {
			video,
			showPlayIcon
		} = this.props

		return (
			<React.Fragment>
				<Picture
					picture={video.picture}
					fit="cover"
					aria-hidden/>
				{showPlayIcon &&
					<VideoPlayIcon className="rrui__video__play-icon--center"/>
				}
				{!showPlayIcon &&
					<VideoDuration duration={video.duration}/>
				}
			</React.Fragment>
		);
	}

	renderVideo() {
		const {
			video,
			tabIndex
		} = this.props

		const {
			autoPlay
		} = this.state

		if (!video.provider) {
			return (
				<video
					ref={this.video}
					tabIndex={tabIndex}
					width="100%"
					height="100%"
					poster={video.picture && video.picture.url}
					autoPlay={autoPlay}
					controls>
					<source
						src={video.url}
						type={video.type}/>
				</video>
			)
			/*
			<video
				width={width}
				height={height} />
			*/
		}

		if (video.provider === 'Vimeo' || video.provider === 'YouTube') {
			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
			// `allowFullScreen` property is for legacy browsers support.
			return (
				<iframe
					src={getEmbeddedVideoUrl(video.id, video.provider, {
						autoPlay,
						startAt: video.startAt
					})}
					frameBorder={0}
					allow="autoplay; fullscreen"
					allowFullScreen />
			)
			/*
			<iframe
				width={width}
				height={height} />
			*/
		}

		console.error(`Unsupported video provider: ${video.provider}`)
		return null
	}
}

Video.propTypes = {
	video: video.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	fit: PropTypes.oneOf([
		'contain',
		'scale-down'
	]).isRequired,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	showPreview: PropTypes.bool.isRequired,
	seekOnArrowKeys: PropTypes.bool.isRequired,
	autoPlay: PropTypes.bool.isRequired,
	canPlay: PropTypes.bool.isRequired,
	showPlayIcon: PropTypes.bool,
	onClick: PropTypes.func,
	tabIndex: PropTypes.bool,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	showPreview: true,
	seekOnArrowKeys: true,
	autoPlay: false,
	canPlay: true
}

const showsPreview = (props) => props.showPreview && props.video.picture ? true : false

export function getUrl(video) {
	if (!video.provider) {
		return video.url
	}
	if (video.provider === 'Vimeo' || video.provider === 'YouTube') {
		return getVideoUrl(video.id, video.provider, {
			startAt: video.startAt
		})
	}
	console.error(`Unsupported video provider: ${video.provider}`)
	return
}

export function getAspectRatio(video) {
	if (video.aspectRatio) {
		return video.aspectRatio
	}
	const maxSize = getMaxSize(video)
	if (maxSize) {
		return maxSize.width / maxSize.height
	}
}

export function getMaxSize(video) {
	if (video.width && video.height) {
		return video
	}
	return video.picture
}

export function VideoDuration({ duration, children }) {
	return (
		<div className={classNames('rrui__video__duration', {
			'rrui__video__duration--time': duration
		})}>
			{duration ? formatVideoDuration(duration) : (children || '▶')}
		</div>
	)
}

VideoDuration.propTypes = {
	duration: PropTypes.number,
	children: PropTypes.string
}

function formatVideoDuration(seconds) {
	let minutes = Math.floor(seconds / 60)
	seconds = seconds % 60
	const hours = Math.floor(minutes / 60)
	minutes = minutes % 60
	if (hours === 0) {
		return minutes + ':' + formatTwoPositions(seconds)
	}
	return hours + ':' + formatTwoPositions(minutes) + ':' + formatTwoPositions(seconds)
}

function formatTwoPositions(number) {
	if (number < 10) {
		return '0' + number
	}
	return number
}