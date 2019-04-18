import React from 'react'
import PropTypes from 'prop-types'

import Video, { getUrl, getMaxSize, getAspectRatio } from './Video'
import { videoAttachment } from '../PropTypes'

import './PostVideo.css'

export default function PostVideo({
	attachment: {
		video
	},
	maxSize,
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
				maxWidth={maxSize || maxHeight ? getMaxWidth(video, maxSize, maxHeight) : undefined}
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
	maxSize: PropTypes.number,
	maxHeight: PropTypes.number,
	saveBandwidth: PropTypes.bool,
	spoilerLabel: PropTypes.string
}

function getMaxWidth(video, maxSize, maxHeight) {
	const size = getMaxSize(video)
	const aspectRatio = getAspectRatio(video)
	if (aspectRatio >= 1) {
		return Math.min(maxSize || maxHeight * aspectRatio, size.width)
	} else {
		return Math.min(maxSize || maxHeight, size.height) / aspectRatio
	}
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