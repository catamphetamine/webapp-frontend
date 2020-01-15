import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { sortByThumbnailHeightDescending } from 'social-components/commonjs/utility/post/getSortedAttachments'

import {
	// TRANSPARENT_PIXEL,
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

import PostAttachment from './PostAttachment'
import PictureStack from './PictureStack'

import {
	postAttachment
} from '../PropTypes'

import getPostThumbnail from 'social-components/commonjs/utility/post/getPostThumbnail'

import './PostAttachments.css'

// Set to `true` to test rendering of all supported attachment types.
const TEST = false

export default function PostAttachments({
	post,
	expandFirstPictureOrVideo,
	expandAttachments,
	hideRestAttachments,
	attachmentThumbnailSize,
	useSmallestThumbnails,
	spoilerLabel,
	onAttachmentClick,
	maxAttachmentThumbnails,
	showPostThumbnailWhenThereAreMultipleAttachments,
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
	if (!expandAttachments && expandFirstPictureOrVideo && picturesAndVideos.length > 0) {
		titlePictureOrVideo = picturesAndVideos[0]
		picturesAndVideos = picturesAndVideos.slice(1)
	}

	// Sort attachment thumbnails by height descending.
	sortPostAttachments(picturesAndVideos)

	// "All pictures and videos" that can be used for a slideshow.
	let allPicturesAndVideos = picturesAndVideos
	if (titlePictureOrVideo) {
		allPicturesAndVideos = [titlePictureOrVideo].concat(picturesAndVideos)
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

	function createOnAttachmentClick(i) {
		return (event) => {
			event.preventDefault()
			onAttachmentClick(allPicturesAndVideos[i], { thumbnailImage: event.target })
		}
	}

	// `<Post/>`s with no `content` don't have a "post thumbnail" shown:
	// they just show all attachments.
	const postThumbnailCandidate = getPostThumbnail(post, { showPostThumbnailWhenThereAreMultipleAttachments })

	let Container = PassthroughContainer
	if (hideRestAttachments) {
		Container = PictureStackContainer
		if (titlePictureOrVideo) {
			picturesAndVideos = []
		} else {
			picturesAndVideos = [picturesAndVideos[0]]
		}
	}

	return (
		<div className="post__attachments">
			{expandAttachments &&
				picturesAndVideos.map((pictureOrVideo, i) => {
					switch (pictureOrVideo.type) {
						case 'picture':
							return (
								<PostPicture
									key={i}
									expand
									attachment={pictureOrVideo}
									spoilerLabel={spoilerLabel}
									onClick={onAttachmentClick ? createOnAttachmentClick(i) : undefined}/>
							)
						case 'video':
							return (
								<PostVideo
									key={i}
									expand
									attachment={pictureOrVideo}
									spoilerLabel={spoilerLabel}
									onClick={onAttachmentClick ? createOnAttachmentClick(i) : undefined}/>
							)
					}
				})
			}
			{!expandAttachments && titlePictureOrVideo && titlePictureOrVideo.type === 'picture' &&
				<Container count={allPicturesAndVideos.length}>
					<PostPicture
						attachment={titlePictureOrVideo}
						spoilerLabel={spoilerLabel}
						onClick={onAttachmentClick ? createOnAttachmentClick(0) : undefined}/>
				</Container>
			}
			{!expandAttachments && titlePictureOrVideo && titlePictureOrVideo.type === 'video' &&
				<Container count={allPicturesAndVideos.length}>
					<PostVideo
						attachment={titlePictureOrVideo}
						spoilerLabel={spoilerLabel}
						onClick={onAttachmentClick ? createOnAttachmentClick(0) : undefined}/>
				</Container>
			}
			{!expandAttachments && picturesAndVideos.length > 0 &&
				<div className={classNames('post__attachment-thumbnails', {
					'post__attachment-thumbnails--hide-rest-attachments': hideRestAttachments
				})}>
					{picturesAndVideos.map((pictureOrVideo, i) => {
						return (
							<Container
								key={`picture-or-video-${i}`}
								count={allPicturesAndVideos.length}>
								<PostAttachment
									attachment={pictureOrVideo}
									useSmallestThumbnail={useSmallestThumbnails}
									maxSize={attachmentThumbnailSize}
									spoilerLabel={spoilerLabel}
									onClick={onAttachmentClick ? createOnAttachmentClick(i + (titlePictureOrVideo ? 1 : 0)) : undefined}
									moreAttachmentsCount={i === picturesAndVideos.length - 1 ? picturesAndVideosMoreCount : undefined}
									className={pictureOrVideo === postThumbnailCandidate ? 'post__attachment-thumbnail--post-thumbnail-candidate' : undefined}/>
							</Container>
						)
					})}
				</div>
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
	post: PropTypes.object,
	onAttachmentClick: PropTypes.func,
	expandFirstPictureOrVideo: PropTypes.bool.isRequired,
	expandAttachments: PropTypes.bool,
	// Currently this property only limits the displayed pictures and videos.
	// Doesn't affect audios, files, links, etc.
	hideRestAttachments: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	useSmallestThumbnails: PropTypes.bool,
	attachmentThumbnailSize: PropTypes.number.isRequired,
	maxAttachmentThumbnails: PropTypes.oneOfType([
		PropTypes.oneOf([false]),
		PropTypes.number
	]).isRequired,
	children: PropTypes.arrayOf(postAttachment)
}

PostAttachments.defaultProps = {
	expandFirstPictureOrVideo: false,
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

function PassthroughContainer({ count, ...rest }) {
	return <React.Fragment {...rest}/>
}

PassthroughContainer.propTypes = {
	count: PropTypes.number
}

function PictureStackContainer({ count, ...rest }) {
	return <PictureStack count={count} {...rest}/>
}

PictureStackContainer.propTypes = {
	count: PropTypes.number.isRequired
}