import React, { useState } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FadeInOut, ActivityIndicator } from 'react-responsive-ui'

import { getViewportWidth } from '../utility/dom'
import SlideshowPicture from './Slideshow.Picture'
import ButtonOrLink from './ButtonOrLink'
import Picture from './Picture'

import {
	VideoDuration,
	getUrl as getVideoUrl
} from './Video'

import {
	pictureAttachment,
	videoAttachment
} from '../PropTypes'

import './PostAttachment.css'

export default function PostAttachment({
	onClick,
	attachment,
	spoilerLabel,
	expand,
	maxSize,
	maxWidth,
	maxHeight,
	width,
	height,
	useSmallestThumbnail,
	moreAttachmentsCount,
	className
}) {
	const [isRevealed, setIsRevealed] = useState(attachment.spoiler ? false : true)
	const [isLoading, loadOnClick] = useLoadOnClick(attachment)
	const picture = attachment.type === 'video' ? attachment.video.picture : attachment.picture
	const isLandscape = picture.width >= picture.height
	async function onPictureClick(event) {
		await loadOnClick(event)
		if (attachment.spoiler) {
			setIsRevealed(true)
		}
		if (onClick) {
			onClick(event)
		}
	}
	// ref={ref}
	return (
		<Picture
			border
			component={ButtonOrLink}
			url={getAttachmentUrl(attachment)}
			title={isRevealed ? attachment.title : spoilerLabel}
			onClick={onPictureClick}
			picture={picture}
			width={expand ? undefined : width}
			height={expand ? undefined : height}
			maxWidth={expand ? picture.width : maxWidth || (maxSize && isLandscape ? maxSize : undefined)}
			maxHeight={expand ? undefined : maxHeight || (maxSize && !isLandscape ? maxSize : undefined)}
			useSmallestSize={expand ? undefined : useSmallestThumbnail}
			blur={attachment.spoiler && !isRevealed ? BLUR_FACTOR : undefined}
			className={classNames(
				className,
				'post__attachment-thumbnail', {
					// 'rrui__picture-border': !(attachment.type === 'picture' && attachment.picture.transparentBackground)
					// 'post__attachment-thumbnail--spoiler': attachment.spoiler && !isRevealed
					'post__attachment-thumbnail--transparent': picture.transparentBackground
				}
			)}>
			{isLoading &&
				<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={0}>
					<div className="post__attachment-thumbnail__loading">
						<ActivityIndicator className="post__attachment-thumbnail__loading-indicator"/>
					</div>
				</FadeInOut>
			}
			{attachment.spoiler && !isRevealed && spoilerLabel &&
				<AttachmentSpoilerBar width={width} height={height}>
					{spoilerLabel}
				</AttachmentSpoilerBar>
			}
			{attachment.type === 'picture' && attachment.picture.type === 'image/gif' &&
				<VideoDuration>gif</VideoDuration>
			}
			{attachment.type === 'video' &&
				<VideoDuration duration={attachment.video.duration}/>
			}
			{moreAttachmentsCount > 0 &&
				<div className="post__attachment-thumbnail__more-count">
					+{moreAttachmentsCount + 1}
				</div>
			}
		</Picture>
	)
}

PostAttachment.propTypes = {
	attachment: PropTypes.oneOfType([
		pictureAttachment,
		videoAttachment
	]).isRequired,
	onClick: PropTypes.func,
	spoilerLabel: PropTypes.string,
	maxSize: PropTypes.number,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	width: PropTypes.number,
	height: PropTypes.number,
	expand: PropTypes.bool,
	useSmallestThumbnail: PropTypes.bool,
	moreAttachmentsCount: PropTypes.number,
	className: PropTypes.string
}

// export default React.forwardRef(PostAttachment)

const DEFAULT_FONT_SIZE = 16
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE_HEIGHT_FACTOR = 0.85
const BLUR_FACTOR = 0.1

function AttachmentSpoilerBar({ width, height, children: spoilerLabel, ...rest }) {
	let fontSize = DEFAULT_FONT_SIZE
	if (width && height) {
		fontSize = Math.floor(width / spoilerLabel.length)
		if (fontSize > height * MAX_FONT_SIZE_HEIGHT_FACTOR) {
			if (height > MIN_FONT_SIZE * MAX_FONT_SIZE_HEIGHT_FACTOR) {
				fontSize = height / MAX_FONT_SIZE_HEIGHT_FACTOR
			} else {
				return null
			}
		}
	}
	return (
		<div
			{...rest}
			style={{ fontSize: fontSize + 'px' }}
			className="post__spoiler-bar post__attachment-thumbnail__spoiler-bar">
			{spoilerLabel}
		</div>
	)
}

AttachmentSpoilerBar.propTypes = {
	width: PropTypes.number,
	height: PropTypes.number,
	children: PropTypes.string.isRequired
}

function useLoadOnClick(attachment) {
	const [isLoading, setIsLoading] = useState()
	async function onClick(event) {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		// Prevent hyperlink click.
		event.preventDefault()
		// "Persist" the event because the function is `async`.
		event.persist()
		if (attachment.type === 'picture') {
			// Preload the picture.
			setIsLoading(true)
			try {
				await SlideshowPicture.preload(attachment, getViewportWidth())
			} catch (error) {
				console.error(error)
			}
			// For testing/styling.
			// await new Promise(_ => setTimeout(_, 30000000))
			setIsLoading(false)
		}
		return event
	}
	return [isLoading, onClick]
}

function getAttachmentUrl(attachment) {
	switch (attachment.type) {
		case 'picture':
			return attachment.picture.url
		case 'video':
			return getVideoUrl(attachment.video)
		default:
			console.error(`Unknown attachment type: ${attachment.type}`)
			console.log(attachment)
			return
	}
}

export function getPicture(attachment) {
	return attachment.type === 'video' ? attachment.video.picture : attachment.picture
}