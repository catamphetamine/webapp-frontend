import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import {
	TRANSPARENT_PIXEL,
	// getAspectRatio as getPictureAspectRatio
} from './Picture'

// import {
// 	getMaxSize as getVideoMaxSize,
// 	getAspectRatio as getVideoAspectRatio
// } from './Video'

import PostPicture, {
	EXAMPLE as PICTURE_EXAMPLE
} from './PostPicture'

import PostVideo, {
	EXAMPLE as VIDEO_EXAMPLE
} from './PostVideo'

import PostAudio, {
	EXAMPLE_1 as AUDIO_EXAMPLE_1,
	EXAMPLE_2 as AUDIO_EXAMPLE_2
} from './PostAudio'

import PostLinkBlock, {
	EXAMPLE_1 as LINK_EXAMPLE_1,
	EXAMPLE_2 as LINK_EXAMPLE_2
} from './PostLinkBlock'

import PostFile, {
	EXAMPLE_1 as FILE_EXAMPLE_1,
	EXAMPLE_2 as FILE_EXAMPLE_2,
	EXAMPLE_3 as FILE_EXAMPLE_3
} from './PostFile'

import PostAttachment, {
	getStyleForMaxSize
} from './PostAttachment'

import {
	postAttachment
} from '../PropTypes'

import './PostAttachments.css'

// Set to `true` to test rendering of all supported attachment types.
const TEST = false

export default function PostAttachments({
	expandFirstPictureOrVideo,
	attachmentThumbnailSize,
	saveBandwidth,
	spoilerLabel,
	openSlideshow,
	maxAttachmentThumbnails,
	children: attachments
}) {
	if (TEST) {
		attachments = TEST_ATTACHMENTS
	}

	if (attachments.length === 0) {
		return null
	}

	// const pictures = attachments.filter(_ => _.type === 'picture')
	// const videos = attachments.filter(_ => _.type === 'video')
	let picturesAndVideos = attachments.filter(_ => _.type === 'picture' || _.type === 'video')

	// Extract "title" picture or video.
	let titlePictureOrVideo
	if (expandFirstPictureOrVideo && picturesAndVideos.length > 0) {
		titlePictureOrVideo = picturesAndVideos[0]
		picturesAndVideos = picturesAndVideos.slice(1)
	}

	// Sort attachment thumbnails by height descending.
	sortPostAttachments(picturesAndVideos)

	// "All pictures and videos" used for the slideshow.
	let slideshowPicturesAndVideos = picturesAndVideos
	if (titlePictureOrVideo) {
		slideshowPicturesAndVideos = [titlePictureOrVideo].concat(picturesAndVideos)
	}

	const audios = attachments.filter(_ => _.type === 'audio').map(_ => _.audio)
	const links = attachments.filter(_ => _.type === 'link').map(_ => _.link)
	const files = attachments.filter(_ => _.type === 'file').map(_ => _.file)

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
			openSlideshow(slideshowPicturesAndVideos, i)
		}
	}

	return (
		<div className="post__attachments">
			{titlePictureOrVideo && titlePictureOrVideo.type === 'picture' &&
				<PostPicture
					attachment={titlePictureOrVideo}
					saveBandwidth={saveBandwidth}
					spoilerLabel={spoilerLabel}
					onClick={openSlideshow ? createOnOpenSlideshow(0) : undefined}/>
			}
			{titlePictureOrVideo && titlePictureOrVideo.type === 'video' &&
				<PostVideo
					attachment={titlePictureOrVideo}
					saveBandwidth={saveBandwidth}
					spoilerLabel={spoilerLabel}
					onClick={openSlideshow ? createOnOpenSlideshow(0) : undefined}/>
			}
			{picturesAndVideos.length > 0 &&
				<ul className="post__attachment-thumbnails">
					{picturesAndVideos.map((pictureOrVideo, i) => {
						const exactSize = true
						return (
							<li
								key={`picture-or-video-${i}`}
								style={exactSize ? undefined : getStyleForMaxSize(pictureOrVideo, attachmentThumbnailSize)}
								className={classNames('post__attachment-thumbnail', {
									'post__attachment-thumbnail--transparent': pictureOrVideo.type === 'picture' && pictureOrVideo.picture.transparent
								})}>
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
								<PostAttachment
									attachment={pictureOrVideo}
									saveBandwidth={saveBandwidth}
									maxSize={attachmentThumbnailSize}
									exactSize={exactSize}
									spoilerLabel={spoilerLabel}
									onClick={openSlideshow ? createOnOpenSlideshow(i + (titlePictureOrVideo ? 1 : 0)) : undefined}
									moreAttachmentsCount={i === picturesAndVideos.length - 1 ? picturesAndVideosMoreCount : undefined}/>
							</li>
						)
					})}
				</ul>
			}
			{audios.length > 0 && audios.map((audio, i) => (
				<PostAudio key={i} audio={audio}/>
			))}
			{links.length > 0 && links.map((link, i) => (
				<PostLinkBlock key={i} link={link}/>
			))}
			{files.length > 0 && files.map((file, i) => (
				<PostFile key={i} file={file}/>
			))}
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
	spoilerLabel: PropTypes.string,
	saveBandwidth: PropTypes.bool.isRequired,
	attachmentThumbnailSize: PropTypes.number.isRequired,
	maxAttachmentThumbnails: PropTypes.oneOfType([
		PropTypes.oneOf([false]),
		PropTypes.number
	]).isRequired,
	children: PropTypes.arrayOf(postAttachment)
}

PostAttachments.defaultProps = {
	expandFirstPictureOrVideo: false,
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

// function getAttachmentAspectRatio(attachment) {
// 	switch (attachment.type) {
// 		case 'picture':
// 			return getPictureAspectRatio(attachment.picture)
// 		case 'video':
// 			return getVideoAspectRatio(attachment.video)
// 		default:
// 			console.error(`Unknown attachment type: ${attachment.type}`)
// 			console.log(attachment)
// 			return 1
// 	}
// }

// function getAttachmentMaxHeight(attachment) {
// 	switch (attachment.type) {
// 		case 'picture':
// 			return attachment.picture.height
// 		case 'video':
// 			return getVideoMaxSize(attachment.video).height
// 		default:
// 			console.error(`Unknown attachment type: ${attachment.type}`)
// 			console.log(attachment)
// 			return
// 	}
// }

// function inscribeThumbnailHeightIntoSize(attachment, maxExtent) {
// 	const aspectRatio = getAttachmentAspectRatio(attachment)
// 	const maxHeight = getAttachmentMaxHeight(attachment)
// 	if (aspectRatio > 1) {
// 		maxExtent = maxExtent / aspectRatio
// 	}
// 	if (maxHeight < maxExtent) {
// 		return maxHeight
// 	}
// 	return maxExtent
// }

function getAttachmentThumbnailHeight(attachment) {
	switch (attachment.type) {
		case 'picture':
			if (attachment.picture.sizes) {
				return attachment.picture.sizes[0].height
			}
			return attachment.picture.height
		case 'video':
			if (attachment.video.picture.sizes) {
				return attachment.video.picture.sizes[0].height
			}
			return attachment.video.picture.height
		default:
			console.error(`Unknown attachment type: ${attachment.type}`)
			console.log(attachment)
			return 0
	}
}

// /**
//  * Sorts attachments by their aspect ratio ascending (the tallest ones first).
//  * Mutates the original array (could add `.slice()` but not required).
//  * @param  {object[]} attachments
//  * @return {object[]}
//  */
// function sortByAspectRatioAscending(attachments) {
// 	// A minor optimization.
// 	if (attachments.length === 1) {
// 		return attachments
// 	}
// 	return attachments.sort((a, b) => {
// 		return getAttachmentAspectRatio(a) - getAttachmentAspectRatio(b)
// 	})
// }

function sortByThumbnailHeightDescending(attachments) {
	// A minor optimization.
	if (attachments.length === 1) {
		return attachments
	}
	return attachments.sort((a, b) => {
		return getAttachmentThumbnailHeight(b) - getAttachmentThumbnailHeight(a)
	})
}

function sortPostAttachments(attachments) {
	return sortByThumbnailHeightDescending(attachments)
}

const TEST_ATTACHMENTS = [
	{
		id: 1,
		type: 'file',
		file: FILE_EXAMPLE_1
	},
	{
		id: 2,
		type: 'file',
		file: FILE_EXAMPLE_2
	},
	{
		id: 3,
		type: 'file',
		file: FILE_EXAMPLE_3
	},
	{
		id: 4,
		type: 'picture',
		picture: PICTURE_EXAMPLE
	},
	{
		id: 5,
		type: 'video',
		video: VIDEO_EXAMPLE
	},
	{
		id: 6,
		type: 'audio',
		audio: AUDIO_EXAMPLE_1
	},
	{
		id: 7,
		type: 'audio',
		audio: AUDIO_EXAMPLE_2
	},
	{
		id: 8,
		type: 'link',
		link: LINK_EXAMPLE_1
	},
	{
		id: 9,
		type: 'link',
		link: LINK_EXAMPLE_2
	}
]