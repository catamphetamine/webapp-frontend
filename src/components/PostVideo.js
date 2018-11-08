import React from 'react'
import { videoAttachmentShape } from '../PropTypes'

import Picture from './Picture'
import Video from './Video'

import './PostVideo.css'

export default class PostVideo extends React.Component {
	render() {
		const { children: { video } } = this.props
		return (
			<Video
				video={video}
				className="post__video"/>
		)
	}
}

PostVideo.propTypes = {
	children: videoAttachmentShape.isRequired
}