import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { videoShape } from '../PropTypes'
import { getEmbeddedVideoURL } from '../utility/video'

import Picture from './Picture'
import VideoPlayIcon from './VideoPlayIcon'

import './Video.css'

export default class Video extends React.Component {
	state = {
		showPreview: this.props.showPreview && this.props.video.picture
	}

	showVideo = () => this.setState({
		showPreview: false,
		autoplay: true
	})

	render() {
		const {
			video,
			// width,
			// height,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		let aspectRatio = 16 / 9
		if (video.width && video.height) {
			aspectRatio = video.width / video.height
		}

		return (
			<div
				className={classNames('rrui__video', className)}
				style={{ paddingBottom: 100 / aspectRatio + '%' }}>
				{showPreview &&
					<Picture
						onClick={this.showVideo}
						sizes={video.picture.sizes}/>
				}
				{showPreview &&
					<button
						onClick={this.showVideo}
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
			autoplay
		} = this.state

		if (video.source.provider === 'file') {
			const size = video.source.sizes[video.source.sizes.length - 1]
			return (
				<video
					width="100%"
					autoPlay={autoplay}
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
						autoplay
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
	showPreview: PropTypes.bool.isRequired,
	className: PropTypes.string
}

Video.defaultProps = {
	showPreview: true
}

const showsPreview = (props) => props.showPreview && props.video.picture ? true : false
