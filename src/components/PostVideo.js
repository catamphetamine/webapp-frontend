import React from 'react'
import { videoAttachmentShape } from '../PropTypes'

import Picture from './Picture'
import Video from './Video'

import './PostVideo.css'

export default class PostVideo extends React.Component {
	render() {
		const {
			height,
			onClick,
			children: {
				video
			}
		} = this.props
		return (
			<Video
				fit={height ? 'height' : undefined}
				maxHeight={height}
				video={video}
				onClick={onClick}
				playOnClick={false}
				className="post__video"/>
		)
	}
}

PostVideo.propTypes = {
	children: videoAttachmentShape.isRequired
}