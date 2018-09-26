import React from 'react'
import PropTypes from 'prop-types'

import Picture from './Picture'

import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import { postAttachmentShape } from '../PropTypes'

import PlayVideoIcon from '../../assets/images/video-player-play-icon-overlay.svg'

import './PostAttachments.css'

export default function PostAttachments({ children: attachments }) {
	if (attachments.length === 0) {
		return null
	}
	const pictures = attachments.filter(_ => _.type === 'picture')
	const videos = attachments.filter(_ => _.type === 'video')
	const audios = attachments.filter(_ => _.type === 'audio')
	const links = attachments.filter(_ => _.type === 'link')
	return (
		<div className="post__attachments">
			{pictures.length === 1 &&
				<PostPicture>
					{pictures[0]}
				</PostPicture>
			}
			{videos.length === 1 &&
				<PostVideo>
					{videos[0]}
				</PostVideo>
			}
			{(pictures.length > 1 || videos.length > 1) &&
				<div className="post__thumbnail-attachments-container">
					<ul className="post__thumbnail-attachments row">
						{pictures.length > 1 && pictures.map(_ => _.picture).map((picture, i) => (
							<li
								key={`picture-${i}`}
								className="post__thumbnail-attachment col-xs-12 col-xs-plus-6 col-m-4 col-xl-4">
								<Picture
									fit="cover"
									sizes={picture.sizes}
									className="post__attachment-thumbnail"/>
							</li>
						))}
						{videos.length > 1 && videos.map(_ => _.video).map((video, i) => (
							<li
								key={`video-${i}`}
								className="post__thumbnail-attachment col-xs-12 col-xs-plus-6 col-m-4 col-xl-4">
								<div className="position-relative">
									<Picture
										fit="cover"
										sizes={video.picture.sizes}
										className="post__attachment-thumbnail"/>
									<PlayVideoIcon
										className="play-video-icon post__thumbnail-video-icon"/>
								</div>
							</li>
						))}
					</ul>
				</div>
			}
			{audios.length > 0 &&
				<ul className="post__audios">
					{audios.map((audio, i) => (
						<li key={i}>
							<PostAudio>
								{audio}
							</PostAudio>
						</li>
					))}
				</ul>
			}
			{links.length > 0 &&
				<ul className="post__links">
					{links.map((link, i) => (
						<li key={i}>
							<PostAttachmentLink>
								{link}
							</PostAttachmentLink>
						</li>
					))}
				</ul>
			}
		</div>
	)
}

PostAttachments.propTypes = {
	children: PropTypes.arrayOf(postAttachmentShape)
}