import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FadeInOut, ActivityIndicator } from 'react-responsive-ui'

import ButtonOrLink from './ButtonOrLink'
import { preloadPictureSlide } from './Slideshow.Picture'
import SlideshowSize from './Slideshow.Size'
import Picture from './Picture'
import { getOriginalPictureSizeAndUrl } from '../utility/fixPictureSize'

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
	fixAttachmentPictureSize,
	className
}) {
	const thumbnailElement = useRef()
	const [isRevealed, setIsRevealed] = useState(attachment.spoiler ? false : true)
	const [loadOnClick, isLoading, setIsLoading, isMounted] = useLoadOnClick(attachment, fixAttachmentPictureSize, thumbnailElement)
	const picture = getPicture(attachment)
	const isLandscape = picture.width >= picture.height
	const slideshowOpenRequest = useRef()
	const onPictureClick = useCallback(async (event) => {
		if (window.Slideshow) {
			slideshowOpenRequest.current = window.Slideshow.willOpen(() => {
				if (isMounted.current) {
					setIsLoading(false)
				}
			})
		}
		await loadOnClick(event)
		if (slideshowOpenRequest.current) {
			if (slideshowOpenRequest.current.cancelled) {
				return
			}
		}
		if (attachment.spoiler) {
			setIsRevealed(true)
		}
		if (onClick) {
			onClick(event)
		}
	}, [attachment, loadOnClick, setIsRevealed, onClick])
	useEffect(() => {
		return () => {
			if (slideshowOpenRequest.current) {
				slideshowOpenRequest.current.cancel()
			}
		}
	}, [])
	return (
		<Picture
			border
			imageRef={thumbnailElement}
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
	fixAttachmentPictureSize: PropTypes.bool,
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

// `thumbnailElement` could be used in `Slideshow.OpenCloseTransition.js`.
function useLoadOnClick(
	attachment,
	fixAttachmentPictureSize,
	thumbnailElement
) {
	const isMounted = useRef()
	useEffect(() => {
		isMounted.current = true
		return () => isMounted.current = false
	}, [])
	const [isLoading, setIsLoading] = useState()
	const onClick = useCallback(async (event) => {
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
			// `lynxchan` doesn't provide `width` and `height`
			// neither for the picture not for the thumbnail
			// in `/catalog.json` API response (which is a bug).
			// http://lynxhub.com/lynxchan/res/722.html#q984
			if (fixAttachmentPictureSize) {
				await getOriginalPictureSizeAndUrl(attachment)
			}
			let openSlideshowPending
			try {
				await preloadPictureSlide(attachment)
				// For testing/styling.
				// await new Promise(_ => setTimeout(_, 3000))
			} catch (error) {
				console.error(error)
			} finally {
				if (isMounted.current) {
					setIsLoading(false)
				}
			}
		}
		return event
	}, [attachment, fixAttachmentPictureSize, thumbnailElement, setIsLoading])
	return [onClick, isLoading, setIsLoading, isMounted]
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

function getPicture(attachment) {
	switch (attachment.type) {
		case 'picture':
			return attachment.picture
		case 'video':
			return attachment.video.picture
	}
}