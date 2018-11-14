import React from 'react'
import PropTypes from 'prop-types'

import Picture from './Picture'

import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import { postAttachmentShape } from '../PropTypes'

import VideoPlayIcon from './VideoPlayIcon'

import './PostAttachments.css'

const MAX_THUMBNAIL_PICTURES_OR_VIDEOS = 6

export default function PostAttachments({ openSlideshow, children: attachments })
{
	if (attachments.length === 0) {
		return null
	}

	// const pictures = attachments.filter(_ => _.type === 'picture')
	// const videos = attachments.filter(_ => _.type === 'video')
	let picturesAndVideos = attachments.filter(_ => _.type === 'picture' || _.type === 'video')

	let titlePictureOrVideo
	if (picturesAndVideos.length > 0) {
		titlePictureOrVideo = picturesAndVideos[0]
		picturesAndVideos = picturesAndVideos.slice(1)
	}

	const audios = attachments.filter(_ => _.type === 'audio')
	const links = attachments.filter(_ => _.type === 'link')

	// const shouldExpandFirstPicture = pictures.length === 1 || (pictures.length > 1 && videos.length !== 1)
	// const shouldExpandFirstVideo = videos.length === 1 || (videos.length > 1 && pictures.length !== 1)

	// let thumbnailPictures = shouldExpandFirstPicture ? pictures.slice(1) : pictures
	// const thumbnailVideos = shouldExpandFirstVideo ? videos.slice(1) : videos

	// const thumbnailPicturesMoreCount = thumbnailPictures.length - MAX_THUMBNAIL_PICTURES
	// if (thumbnailPicturesMoreCount > 0) {
	// 	thumbnailPictures = thumbnailPictures.slice(0, MAX_THUMBNAIL_PICTURES)
	// }

	const picturesAndVideosMoreCount = picturesAndVideos.length - MAX_THUMBNAIL_PICTURES_OR_VIDEOS
	if (picturesAndVideosMoreCount > 0) {
		picturesAndVideos = picturesAndVideos.slice(0, MAX_THUMBNAIL_PICTURES_OR_VIDEOS)
	}

	return (
		<div className="post__attachments">
			{titlePictureOrVideo && titlePictureOrVideo.type === 'picture' &&
				<PostPicture onClick={() => openSlideshow(0)}>
					{titlePictureOrVideo}
				</PostPicture>
			}
			{titlePictureOrVideo && titlePictureOrVideo.type === 'video' &&
				<PostVideo onClick={() => openSlideshow(0)}>
					{titlePictureOrVideo}
				</PostVideo>
			}
			{picturesAndVideos.length > 0 &&
				<div className="post__thumbnail-attachments-container">
					<ul className="post__thumbnail-attachments row">
						{picturesAndVideos.map((pictureOrVideo, i) => (
							<li
								key={`picture-or-video-${i}`}
								className="post__thumbnail-attachment col-4">
								<div className="position-relative aspect-ratio--hd">
									<Picture
										fit="cover"
										picture={pictureOrVideo.type === 'video' ? pictureOrVideo.video.picture : pictureOrVideo.picture}
										onClick={() => openSlideshow(i + 1)}
										className="post__attachment-thumbnail aspect-ratio__content--hd"/>
									{pictureOrVideo.type === 'video' &&
										<VideoPlayIcon className="post__thumbnail-video-icon"/>
									}
									{(i === picturesAndVideos.length - 1 && picturesAndVideosMoreCount > 0) &&
										<div className="post__attachment-thumbnail-more">
											+{picturesAndVideosMoreCount + 1}
										</div>
									}
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