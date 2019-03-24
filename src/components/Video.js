import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { video } from '../PropTypes'
import { getEmbeddedVideoUrl, getVideoUrl } from '../utility/video'

import Picture, { getMaxSize as getMaxPictureSize, scaleDownSize } from './Picture'
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

	getContainerStyle() {
		const {
			video,
			fit,
			maxWidth,
			maxHeight
		} = this.props
		switch (fit) {
			case 'width':
				return {
					paddingBottom: 100 / getAspectRatio(video) + '%'
				}
			case 'height':
				return {
					paddingBottom: 100 / getAspectRatio(video) + '%'
				}
				// return {
				// 	width: getAspectRatio(video) * maxHeight + 'px',
				// 	height: maxHeight + 'px'
				// }
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
			fit,
			maxHeight
		} = this.props
		if (fit === 'height') {
			return (
				<div
					style={{ maxWidth: getAspectRatio(video) * maxHeight + 'px' }}>
					{this.render_()}
				</div>
			)
		}
		return this.render_()
	}

	render_() {
		const {
			video,
			fit,
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

		return (
			<div
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
					<VideoDuration video={video}/>
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

		if (video.source.provider === 'file') {
			const size = video.source.sizes[video.source.sizes.length - 1]
			return (
				<video
					ref={this.video}
					tabIndex={tabIndex}
					width="100%"
					height="100%"
					autoPlay={autoPlay}
					controls>
					<source
						src={size.url}
						type={video.source.type}/>
				</video>
			)
			/*
			<video
				width={width}
				height={height} />
			*/
		}

		if (video.source.provider === 'Vimeo' || video.source.provider === 'YouTube') {
			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
			// `allowFullScreen` property is for legacy browsers support.
			return (
				<iframe
					src={getEmbeddedVideoUrl(video.source.id, video.source.provider, {
						autoPlay
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

		console.error(`Unsupported video provider: ${video.source.provider}`)
		return null
	}
}

Video.propTypes = {
	video: video.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	fit: PropTypes.oneOf([
		'width',
		'height',
		'contain',
		'scale-down'
	]).isRequired,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	showPreview: PropTypes.bool.isRequired,
	autoPlay: PropTypes.bool.isRequired,
	canPlay: PropTypes.bool.isRequired,
	showPlayIcon: PropTypes.bool,
	onClick: PropTypes.func,
	tabIndex: PropTypes.bool,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	fit: 'width',
	showPreview: true,
	autoPlay: false,
	canPlay: true
}

const showsPreview = (props) => props.showPreview && props.video.picture ? true : false

export function getUrl(video) {
	if (video.source.provider === 'file') {
		const size = video.source.sizes[video.source.sizes.length - 1]
		return size.url
	}
	if (video.source.provider === 'Vimeo' || video.source.provider === 'YouTube') {
		return getVideoUrl(video.source.id, video.source.provider)
	}
	console.error(`Unsupported video provider: ${video.source.provider}`)
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
	if (video.source.provider === 'file') {
		return video.source.sizes[video.source.sizes.length - 1]
	}
	// // For HD-aspect-ratio YouTube videos assume default video size to be FullHD.
	// // YouTube doesn't generate FullHD preview images for FullHD videos (and larger).
	// // Upscaling HD videos to FullHD is fine.
	// if (video.source.provider === 'YouTube') {
	// 	const maxPictureSize = getMaxPictureSize(video.picture)
	// 	if (maxPictureSize.width === 1280 && maxPictureSize.height === 720) {
	// 		return {
	// 			width: 1920,
	// 			height: 1080
	// 		}
	// 	}
	// 	return maxPictureSize
	// }
	return getMaxPictureSize(video.picture)
}

export function VideoDuration({ video }) {
	return (
		<div className="rrui__video__duration">
			{video.duration === undefined ? '▶' : formatVideoDuration(video.duration)}
		</div>
	)
}

VideoDuration.propTypes = {
	video: video.isRequired
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