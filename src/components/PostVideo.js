import React from 'react'
import PropTypes from 'prop-types'

import Video, { getUrl } from './Video'
import { videoAttachment } from '../PropTypes'

import './PostVideo.css'

export default function PostVideo({
	attachment: {
		video
	},
	maxHeight,
	saveBandwidth,
	spoilerLabel,
	onClick
}) {
	const url = getUrl(video)
	return (
		<section className="post__video">
			<Video
				video={video}
				maxHeight={maxHeight}
				saveBandwidth={saveBandwidth}
				spoilerLabel={spoilerLabel}
				onClick={onClick}/>
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

PostVideo.propTypes = {
	attachment: videoAttachment.isRequired,
	maxHeight: PropTypes.number,
	saveBandwidth: PropTypes.bool,
	spoilerLabel: PropTypes.string
}

export const EXAMPLE = {
	type: 'video/webm',
	width: 854,
	height: 480,
	duration: 12,
	title: 'Schlossbergbahn',
	description: 'A .webm video example from WikiPedia',
	date: new Date(2013, 2, 1), // March 1st, 2013.
	size: 2 * 1024 * 1024, // in bytes
	url: 'https://upload.wikimedia.org/wikipedia/commons/transcoded/8/87/Schlossbergbahn.webm/Schlossbergbahn.webm.480p.vp9.webm',
	picture: {
		type: 'image/jpeg',
		width: 220,
		height: 124,
		size: 25 * 1024, // in bytes.
		url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Schlossbergbahn.webm/220px--Schlossbergbahn.webm.jpg'
	}
}