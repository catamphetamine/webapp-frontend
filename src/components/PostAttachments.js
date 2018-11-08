import React from 'react'
import PropTypes from 'prop-types'

import Picture from './Picture'

import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import { postAttachmentShape } from '../PropTypes'

import VideoPlayIcon from './VideoPlayIcon'

import './PostAttachments.css'

const MAX_THUMBNAIL_PICTURES = 6

export default function PostAttachments({ openSlideshow, children: attachments })
{
	if (attachments.length === 0) {
		return null
	}

	const pictures = attachments.filter(_ => _.type === 'picture')
	const videos = attachments.filter(_ => _.type === 'video')
	const audios = attachments.filter(_ => _.type === 'audio')
	const links = attachments.filter(_ => _.type === 'link')

	const shouldExpandFirstPicture = pictures.length === 1 || (pictures.length > 1 && videos.length !== 1)
	const shouldExpandFirstVideo = videos.length === 1 || (videos.length > 1 && pictures.length !== 1)

	let thumbnailPictures = shouldExpandFirstPicture ? pictures.slice(1) : pictures
	const thumbnailVideos = shouldExpandFirstVideo ? videos.slice(1) : videos

	const thumbnailPicturesMoreCount = thumbnailPictures.length - MAX_THUMBNAIL_PICTURES
	if (thumbnailPicturesMoreCount > 0) {
		thumbnailPictures = thumbnailPictures.slice(0, MAX_THUMBNAIL_PICTURES)
	}

	return (
		<div className="post__attachments">
			{shouldExpandFirstPicture &&
				<PostPicture onClick={() => openSlideshow(0)}>
					{pictures[0]}
				</PostPicture>
			}
			{shouldExpandFirstVideo &&
				<PostVideo>
					{videos[0]}
				</PostVideo>
			}
			{(thumbnailPictures.length > 0 || thumbnailVideos.length > 0) &&
				<div className="post__thumbnail-attachments-container">
					<ul className="post__thumbnail-attachments row">
						{thumbnailPictures.length > 0 && thumbnailPictures.map(_ => _.picture).map((picture, i) => (
							<li
								key={`picture-${i}`}
								className="post__thumbnail-attachment col-4">
								<Picture
									fit="cover"
									sizes={picture.sizes}
									onClick={() => openSlideshow(shouldExpandFirstPicture ? i + 1 : i)}
									className="post__attachment-thumbnail picture--hd">
									{(i === thumbnailPictures.length - 1 && thumbnailPicturesMoreCount > 0) &&
										<div className="post__attachment-thumbnail-more">
											+{thumbnailPicturesMoreCount + 1}
										</div>
									}
								</Picture>
							</li>
						))}
						{thumbnailVideos.length > 0 && thumbnailVideos.map(_ => _.video).map((video, i) => (
							<li
								key={`video-${i}`}
								className="post__thumbnail-attachment col-4">
								<div className="position-relative aspect-ratio--hd">
									<Picture
										fit="cover"
										sizes={video.picture.sizes}
										className="post__attachment-thumbnail aspect-ratio__content--hd"/>
									<VideoPlayIcon className="post__thumbnail-video-icon"/>
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
	openSlideshow: PropTypes.func,
	children: PropTypes.arrayOf(postAttachmentShape)
}