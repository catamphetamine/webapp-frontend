import React from 'react'
import { videoAttachmentShape } from '../PropTypes'

import Picture from './Picture'
import Video from './Video'

import PlayVideoIcon from '../../assets/images/video-player-play-icon-overlay.svg'

import './PostVideo.css'

export default class PostVideo extends React.Component {
	state = {}

	showVideo = () => this.setState({ showVideo: true })

	render() {
		const { children: { video } } = this.props
		const { showVideo } = this.state

		if (showVideo) {
			return (
				<Video
					video={video}
					className="post__video"/>
			)
		}

		return (
			<div className="post__video">
				<Picture
					onClick={this.showVideo}
					sizes={video.picture.sizes}/>
				<PlayVideoIcon
					className="play-video-icon post__video-icon"/>
			</div>
		)
	}
}

PostVideo.propTypes = {
	children: videoAttachmentShape.isRequired
}