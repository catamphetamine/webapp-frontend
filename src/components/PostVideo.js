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
			url = getVideoUrl(video.source.id, video.source.provider, {
				startAt: video.startAt
			})
		}

		return (
			<section className="post__video">
				<Video
					video={video}
					maxHeight={height}
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

export const EXAMPLE = {
	type: 'video/webm',
	width: 854,
	height: 480,
	duration: 12,
	title: 'Schlossbergbahn',
	description: 'A .webm video example from WikiPedia',
	date: new Date(2013, 2, 1), // March 1st, 2013.
	picture: {
		type: 'image/jpeg',
		sizes: [{
			width: 220,
			height: 124,
			url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Schlossbergbahn.webm/220px--Schlossbergbahn.webm.jpg'
		}]
	},
	source: {
		provider: 'file',
		sizes: [{
			width: 854,
			height: 480,
			url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Schlossbergbahn.webm/Schlossbergbahn.webm.480p.vp9.webm'
		}]
	}
}