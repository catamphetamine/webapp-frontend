import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { videoShape } from '../PropTypes'
import { getEmbeddedVideoURL } from '../utility/video'

import Picture, { getMaxSize as getMaxPictureSize, scaleDownSize } from './Picture'
import VideoPlayIcon from './VideoPlayIcon'

import './Video.css'

export default class Video extends React.Component {
	state = {
		showPreview: this.props.showPreview, // && this.props.video.picture,
		autoPlay: this.props.autoPlay
	}

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

	showVideo = () => this.setState({
		showPreview: false,
		autoPlay: true
	})

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
					width: getAspectRatio(video) * maxHeight + 'px',
					height: maxHeight + 'px'
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

	onPreviewClick = (event) => {
		const { playOnClick } = this.props
		if (playOnClick) {
			event.stopPropagation()
			this.showVideo()
		}
	}

	render() {
		const {
			video,
			fit,
			// width,
			// height,
			onClick,
			style,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		return (
			<div
				onClick={onClick}
				className={classNames('rrui__video', className, {
					'rrui__video--aspect-ratio': fit === 'width'
				})}
				style={style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle()}>
				{showPreview &&
					<Picture
						onClick={this.onPreviewClick}
						picture={video.picture}
						fit="cover"/>
				}
				{showPreview &&
					<button
						onClick={this.onPreviewClick}
						className="rrui__button-reset rrui__video__play-button">
						<VideoPlayIcon />
					</button>
				}
				{!showPreview && this.renderVideo()}
			</div>
		)
	}

	renderVideo() {
		const {
			video
		} = this.props

		const {
			autoPlay
		} = this.state

		if (video.source.provider === 'file') {
			const size = video.source.sizes[video.source.sizes.length - 1]
			return (
				<video
					width="100%"
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
					src={getEmbeddedVideoURL(video.source.id, video.source.provider, {
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
	video: videoShape.isRequired,
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
	playOnClick: PropTypes.bool.isRequired,
	onClick: PropTypes.func,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	fit: 'width',
	showPreview: true,
	autoPlay: false,
	canPlay: true,
	playOnClick: true
}

const showsPreview = (props) => props.showPreview && props.video.picture ? true : false

function getAspectRatio(video) {
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
	// For HD-aspect-ratio YouTube videos assume default video size to be FullHD.
	// YouTube doesn't generate FullHD preview images for FullHD videos (and larger).
	// Upscaling HD videos to FullHD is fine.
	if (video.source.provider === 'YouTube') {
		const maxPictureSize = getMaxPictureSize(video.picture)
		if (maxPictureSize.width === 1280 && maxPictureSize.height === 720) {
			return {
				width: 1920,
				height: 1080
			}
		}
		return maxPictureSize
	}
	return getMaxPictureSize(video.picture)
}