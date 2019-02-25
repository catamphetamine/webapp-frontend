import React from 'react'
import PropTypes from 'prop-types'
import filesize from 'filesize'

import Picture, { TRANSPARENT_PIXEL, getAspectRatio as getPictureAspectRatio } from './Picture'
import { getAspectRatio as getVideoAspectRatio } from './Video'

import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import {
	postAttachmentShape,
	fileAttachmentShape
} from '../PropTypes'

import VideoPlayIcon from './VideoPlayIcon'

import './PostAttachments.css'

const MAX_THUMBNAIL_PICTURES_OR_VIDEOS = 6

export default function PostAttachments({
	expandFirstPictureOrVideo,
	attachmentThumbnailSize,
	saveBandwidth,
	openSlideshow,
	children: attachments
}) {
	if (attachments.length === 0) {
		return null
	}

	// const pictures = attachments.filter(_ => _.type === 'picture')
	// const videos = attachments.filter(_ => _.type === 'video')
	let picturesAndVideos = attachments.filter(_ => _.type === 'picture' || _.type === 'video')

	let titlePictureOrVideo
	if (expandFirstPictureOrVideo && picturesAndVideos.length > 0) {
		titlePictureOrVideo = picturesAndVideos[0]
		picturesAndVideos = picturesAndVideos.slice(1)
	}

	const audios = attachments.filter(_ => _.type === 'audio')
	const links = attachments.filter(_ => _.type === 'link')
	const files = attachments.filter(_ => !_.type)

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

	function createOnOpenSlideshow(i) {
		return (event) => {
			event.preventDefault()
			openSlideshow(i)
		}
	}

	return (
		<div className="post__attachments">
			{titlePictureOrVideo && titlePictureOrVideo.type === 'picture' &&
				<PostPicture
					onClick={createOnOpenSlideshow(0)}>
					{titlePictureOrVideo}
				</PostPicture>
			}
			{titlePictureOrVideo && titlePictureOrVideo.type === 'video' &&
				<PostVideo
					onClick={createOnOpenSlideshow(0)}>
					{titlePictureOrVideo}
				</PostVideo>
			}
			{picturesAndVideos.length > 0 &&
				<ul className="post__thumbnail-attachments">
					{sortByAspectRatioAscending(picturesAndVideos).map((pictureOrVideo, i) => (
						<li
							key={`picture-or-video-${i}`}
							className="post__thumbnail-attachment">
							{/* When copy-pasting content an `<img/>` inside a `<button/>`
							    is ignored, that's why placing a "dummy" transparent pixel
							    having the correct `alt` before the `<button/>`. */}
							<img
								src={TRANSPARENT_PIXEL}
								width={0}
								height={0}
								alt={pictureOrVideo.title}
								style={POSITION_ABSOLUTE}/>
							<button
								aria-label={pictureOrVideo.title}
								onClick={createOnOpenSlideshow(i + (titlePictureOrVideo ? 1 : 0))}
								className="rrui__button-reset post__thumbnail-attachment-button">
								<Picture
									preview
									aria-hidden
									fit="height"
									height={inscribeThumbnailHeightIntoSize(pictureOrVideo, attachmentThumbnailSize)}
									picture={pictureOrVideo.type === 'video' ? pictureOrVideo.video.picture : pictureOrVideo.picture}
									saveBandwidth={saveBandwidth}
									className="post__attachment-thumbnail aspect-ratio__content--hd"/>
								{pictureOrVideo.type === 'video' &&
									<VideoPlayIcon className="post__thumbnail-video-icon"/>
								}
								{(i === picturesAndVideos.length - 1 && picturesAndVideosMoreCount > 0) &&
									<div className="post__attachment-thumbnail-more">
										+{picturesAndVideosMoreCount + 1}
									</div>
								}
							</button>
						</li>
					))}
				</ul>
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
			{files.length > 0 &&
				<ul className="post__files">
					{files.map((file, i) => (
						<li key={i}>
							<PostAttachmentFile file={file}/>
							{file.size &&
								<span className="post__file-size">
									{filesize(file.size)}
								</span>
							}
						</li>
					))}
				</ul>
			}
			{/* Insert a "new line" after attachments when copy-pasting selected content */}
			<div style={POSITION_ABSOLUTE}>
				<br/>
			</div>
		</div>
	)
}

PostAttachments.propTypes = {
	openSlideshow: PropTypes.func.isRequired,
	expandFirstPictureOrVideo: PropTypes.bool.isRequired,
	saveBandwidth: PropTypes.bool.isRequired,
	attachmentThumbnailSize: PropTypes.number.isRequired,
	children: PropTypes.arrayOf(postAttachmentShape)
}

PostAttachments.defaultProps = {
	expandFirstPictureOrVideo: true,
	saveBandwidth: false,
	attachmentThumbnailSize: 160
}

const POSITION_ABSOLUTE = {
	position: 'absolute'
}

// function groupThumbnails(thumbnails, targetRowRatioTolerance) {
// 	let targetRowRatio = 4.5
// 	const targetRowRatioToleranceStep = 0.1
// 	const rows = []
// 	let row = []
// 	for (const thumbnail of thumbnails) {
// 		row.push(thumbnail)
// 		const rowRatio = getRowRatio(row)
// 		if (rowRatio >= targetRowRatio + targetRowRatioTolerance * targetRowRatioToleranceStep) {
// 			rows.push(row)
// 			row = []
// 		}
// 	}
// 	if (row.length > 0) {
// 		rows.push([])
// 	}
// 	return rows
// }

// function groupThumbnailsRecursive(thumbnails, targetRowRatioTolerance = 0) {
// 	const forLowerRowRatio = groupThumbnails(thumbnails, targetRowRatioTolerance * -1 / 2)
// 	const forHigherRowRatio = groupThumbnails(thumbnails, targetRowRatioTolerance)
// 	if (!hasIncompleteRows(forHigherRowRatio)) {
// 		return forHigherRowRatio
// 	} else if (!hasIncompleteRows(forLowerRowRatio)) {
// 		return forLowerRowRatio
// 	} else {
// 		// If the last row is not complete
// 		// then maybe re-group with a looser target row ratio.
//
// 		// If there's not enough thumbnails for the higher row ratio
// 		// then just group them in a single row.
// 		if (forHigherRowRatio.length === 1) {
// 			// console.log(getRowRatio(thumbnails))
// 			return thumbnails
// 		}
//
// 		// If there is already at least a single complete row
// 		// then maybe add the ungrouped images left to it.
// 		return groupThumbnailsRecursive(thumbnails, targetRowRatioTolerance + 1)
// 	}
// }

// function hasIncompleteRows(result) {
// 	return result[result.length - 1].length === 0
// }

// function getRowRatio(row) {
// 	return row.reduce((totalWidth, _) => totalWidth + _.width / _.height, 0)
// }

// console.log(groupThumbnailsRecursive([{
// 	width: 1000,
// 	height: 700
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1080,
// 	height: 1920
// }, {
// 	width: 400,
// 	height: 400
// }, {
// 	width: 480,
// 	height: 640
// }]))

// console.log(groupThumbnailsRecursive([{
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }]))

// console.log(groupThumbnailsRecursive([{
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }]))

// console.log(groupThumbnailsRecursive([{
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }, {
// 	width: 1920,
// 	height: 1080
// }]))

const PostAttachmentFile = ({ file }) => {
	return (
		<a
			target="_blank"
			href={file.url}>
			{`${file.name}${file.ext}`}
		</a>
	)
}

PostAttachmentFile.propTypes = {
	file: fileAttachmentShape.isRequired
}

function getAttachmentAspectRatio(attachment) {
	switch (attachment.type) {
		case 'picture':
			return getPictureAspectRatio(attachment.picture)
		case 'video':
			return getVideoAspectRatio(attachment.video)
		default:
			console.error(`Unknown attachment type: ${attachment.type}`)
			console.log(attachment)
			return 1
	}
}

function inscribeThumbnailHeightIntoSize(attachment, size) {
	const aspectRatio = getAttachmentAspectRatio(attachment)
	if (aspectRatio <= 1) {
		return size
	}
	return size / aspectRatio
}

/**
 * Sorts attachments by their aspect ratio ascending (the tallest ones first).
 * Mutates the original array (could add `.slice()` but not required).
 * @param  {object[]} attachments
 * @return {object[]}
 */
export function sortByAspectRatioAscending(attachments) {
	// A minor optimization.
	if (attachments.length === 1) {
		return attachments
	}
	return attachments.sort((a, b) => {
		return getAttachmentAspectRatio(a) - getAttachmentAspectRatio(b)
	})
}