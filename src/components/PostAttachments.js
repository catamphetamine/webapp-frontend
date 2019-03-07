import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import filesize from 'filesize'

import Picture, {
	TRANSPARENT_PIXEL,
	getUrl as getPictureUrl,
	getMaxSize as getPictureMaxSize,
	getAspectRatio as getPictureAspectRatio
} from './Picture'

import {
	VideoDuration,
	getUrl as getVideoUrl,
	getMaxSize as getVideoMaxSize,
	getAspectRatio as getVideoAspectRatio
} from './Video'

import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import {
	postAttachment,
	fileAttachmentShape
} from '../PropTypes'

import './PostAttachments.css'

export default function PostAttachments({
	expandFirstPictureOrVideo,
	attachmentThumbnailSize,
	saveBandwidth,
	openSlideshow,
	maxAttachmentThumbnails,
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

	sortByAspectRatioAscending(picturesAndVideos)

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

	let picturesAndVideosMoreCount = 0
	if (maxAttachmentThumbnails > 0) {
		picturesAndVideosMoreCount = picturesAndVideos.length - maxAttachmentThumbnails
		if (picturesAndVideosMoreCount > 0) {
			picturesAndVideos = picturesAndVideos.slice(0, maxAttachmentThumbnails)
		}
	}

	function createOnOpenSlideshow(i) {
		return (event) => {
			event.preventDefault()
			openSlideshow(i)
		}
	}

	return (
		<div className="post__attachments">
			{titlePictureOrVideo && titlePictureOrVideo.type === 'picture' && (
				openSlideshow
				?
				<button
					type="button"
					onClick={createOnOpenSlideshow(0)}
					className="rrui__button-reset">
					<PostPicture>
						{titlePictureOrVideo}
					</PostPicture>
				</button>
				:
				<a
					target="_blank"
					href={getPictureUrl(titlePictureOrVideo.picture)}>
					<PostPicture>
						{titlePictureOrVideo}
					</PostPicture>
				</a>
			)}
			{titlePictureOrVideo && titlePictureOrVideo.type === 'video' &&
				<PostVideo
					onClick={openSlideshow ? createOnOpenSlideshow(0) : undefined}>
					{titlePictureOrVideo}
				</PostVideo>
			}
			{picturesAndVideos.length > 0 &&
				<ul className="post__attachment-thumbnails">
					{picturesAndVideos.map((pictureOrVideo, i) => {
						const attachmentThumbnail = (
							<AttachmentThumbnail
								attachment={pictureOrVideo}
								saveBandwidth={saveBandwidth}
								maxSize={attachmentThumbnailSize}
								moreAttachmentsCount={i === picturesAndVideos.length - 1 ? picturesAndVideosMoreCount : undefined}/>
						)
						return (
							<li
								key={`picture-or-video-${i}`}
								className={classNames(
									'post__attachment-thumbnail',
									pictureOrVideo.type === 'picture' &&
										pictureOrVideo.picture.kind &&
										`post__attachment-thumbnail--${pictureOrVideo.picture.kind}`
								)}>
								{/* When copy-pasting content an `<img/>` inside a `<button/>`
								    is ignored, that's why placing a "dummy" transparent pixel
								    having the correct `alt` before the `<button/>`. */}
								<img
									aria-hidden
									src={TRANSPARENT_PIXEL}
									width={0}
									height={0}
									alt={pictureOrVideo.title}
									style={POSITION_ABSOLUTE}/>
								{openSlideshow &&
									<button
										type="button"
										aria-label={pictureOrVideo.title}
										onClick={createOnOpenSlideshow(i + (titlePictureOrVideo ? 1 : 0))}
										className="rrui__button-reset post__attachment-thumbnail__clickable">
										{attachmentThumbnail}
									</button>
								}
								{!openSlideshow &&
									<a
										target="_blank"
										href={getAttachmentUrl(pictureOrVideo)}
										aria-label={pictureOrVideo.title}
										className="post__attachment-thumbnail__clickable">
										{attachmentThumbnail}
									</a>
								}
							</li>
						)
					})}
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
	openSlideshow: PropTypes.func,
	expandFirstPictureOrVideo: PropTypes.bool.isRequired,
	saveBandwidth: PropTypes.bool.isRequired,
	attachmentThumbnailSize: PropTypes.number.isRequired,
	maxAttachmentThumbnails: PropTypes.oneOfType([
		PropTypes.oneOf([false]),
		PropTypes.number
	]).isRequired,
	children: PropTypes.arrayOf(postAttachment)
}

PostAttachments.defaultProps = {
	expandFirstPictureOrVideo: true,
	saveBandwidth: false,
	attachmentThumbnailSize: 160,
	maxAttachmentThumbnails: 6
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

function getAttachmentUrl(attachment) {
	switch (attachment.type) {
		case 'picture':
			return getPictureUrl(attachment.picture)
		case 'video':
			return getVideoUrl(attachment.video)
		default:
			console.error(`Unknown attachment type: ${attachment.type}`)
			console.log(attachment)
			return
	}
}

function getAttachmentMaxHeight(attachment) {
	switch (attachment.type) {
		case 'picture':
			return getPictureMaxSize(attachment.picture).height
		case 'video':
			return getVideoMaxSize(attachment.video).height
		default:
			console.error(`Unknown attachment type: ${attachment.type}`)
			console.log(attachment)
			return
	}
}

function inscribeThumbnailHeightIntoSize(attachment, size) {
	const aspectRatio = getAttachmentAspectRatio(attachment)
	const maxHeight = getAttachmentMaxHeight(attachment)
	if (aspectRatio > 1) {
		size = size / aspectRatio
	}
	if (maxHeight < size) {
		return maxHeight
	}
	return size
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

function AttachmentThumbnail({
	attachment,
	maxSize,
	saveBandwidth,
	moreAttachmentsCount
}) {
	return (
		<React.Fragment>
			<Picture
				preview
				fit="height"
				height={inscribeThumbnailHeightIntoSize(attachment, maxSize)}
				picture={attachment.type === 'video' ? attachment.video.picture : attachment.picture}
				saveBandwidth={saveBandwidth}
				className="post__attachment-thumbnail__picture"/>
			{attachment.type === 'video' &&
				<VideoDuration video={attachment.video}/>
			}
			{moreAttachmentsCount > 0 &&
				<div className="post__attachment-thumbnail__more-count">
					+{moreAttachmentsCount + 1}
				</div>
			}
		</React.Fragment>
	)
}

AttachmentThumbnail.propTypes = {
	attachment: postAttachment.isRequired,
	maxSize: PropTypes.number.isRequired,
	saveBandwidth: PropTypes.bool,
	moreAttachmentsCount: PropTypes.number
}