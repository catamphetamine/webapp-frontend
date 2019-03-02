import React from 'react'
import { videoAttachmentShape } from '../PropTypes'

import Picture from './Picture'
import Video from './Video'

import { getVideoUrl } from '../utility/video'

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

		let url
		if (video.source.provider) {
			url = getVideoUrl(video.source.id, video.source.provider)
		}

		return (
			<section className="post__video">
				<Video
					fit={height ? 'height' : undefined}
					maxHeight={height}
					video={video}
					onClick={onClick}
					aria-label={this.props['aria-label'] || video.title}/>
				{video.title &&
					<h1 className="post__video-title">
						{url &&
							<a
								target="_blank"
								href={url}>
								{video.title}
							</a>
						}
						{!url && video.title}
					</h1>
				}
			</section>
		)
	}
}

PostVideo.propTypes = {
	children: videoAttachmentShape.isRequired
}