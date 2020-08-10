import React, { useState, useRef, useCallback, useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FadeInOut, ActivityIndicator } from 'react-responsive-ui'

import ButtonOrLink from './ButtonOrLink'
import { preloadPictureSlide } from './Slideshow.Picture'
import SlideshowSize from './Slideshow.Size'
import Picture from './Picture'
import PictureBadge from './PictureBadge'
import { getOriginalPictureSizeAndUrl } from '../utility/fixPictureSize'

import {
	VideoDuration,
	getUrl as getVideoUrl
} from './Video'

import {
	pictureAttachment,
	videoAttachment
} from '../PropTypes'

import './PostAttachmentThumbnail.css'

export default function PostAttachmentThumbnail({
	onClick,
	component,
	componentProps,
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
	// This `onClick(event)` function is not `async`
	// because an `async` function results in a React warning
	// telling that a "synthetic event" has been reused.
	const onPictureClick = useCallback((event) => {
		if (window.Slideshow) {
			slideshowOpenRequest.current = window.Slideshow.willOpen(() => {
				if (isMounted.current) {
					setIsLoading(false)
				}
			})
		}
		const finish = () => {
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
		}
		const promise = loadOnClick(event)
		if (promise) {
			promise.then(finish)
		} else {
			finish()
		}
	}, [attachment, loadOnClick, setIsRevealed, onClick])
	useEffect(() => {
		return () => {
			if (slideshowOpenRequest.current) {
				slideshowOpenRequest.current.cancel()
			}
		}
	}, [])
	// Could set some default `title` here. For example, to some
	// `contentTypeLabels.picture` or `contentTypeLabels.video`,
	// but that would result in a "Picture" / "Video" tooltip
	// being shown in a web browser on mouse over, which would be
	// redundant, pointless and distracting to a user.
	return (
		<Picture
			border
			imageRef={thumbnailElement}
			component={component}
			componentProps={componentProps}
			url={getAttachmentUrl(attachment)}
			title={isRevealed ? attachment.title : spoilerLabel}
			onClick={onClick ? onPictureClick : undefined}
			picture={picture}
			width={expand ? undefined : width}
			height={expand ? undefined : height}
			maxWidth={expand ? picture.width : maxWidth || (maxSize && isLandscape ? maxSize : undefined)}
			maxHeight={expand ? undefined : maxHeight || (maxSize && !isLandscape ? maxSize : undefined)}
			useSmallestSize={expand ? undefined : useSmallestThumbnail}
			blur={attachment.spoiler && !isRevealed ? BLUR_FACTOR : undefined}
			className={classNames(
				className,
				'PostAttachmentThumbnail', {
					// 'rrui__picture-border': !(attachment.type === 'picture' && attachment.picture.transparentBackground)
					// 'PostAttachmentThumbnail--spoiler': attachment.spoiler && !isRevealed
					'PostAttachmentThumbnail--transparent': picture.transparentBackground
				}
			)}>
			{isLoading &&
				<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={0}>
					{/* `<span/>` is used instead of a `<div/>`
					    because a `<div/>` isn't supposed to be inside a `<button/>`. */}
					<span className="PostAttachmentThumbnail__loading">
						<ActivityIndicator className="PostAttachmentThumbnail__loading-indicator"/>
					</span>
				</FadeInOut>
			}
			{attachment.spoiler && !isRevealed && spoilerLabel &&
				<AttachmentSpoilerBar width={width} height={height}>
					{spoilerLabel}
				</AttachmentSpoilerBar>
			}
			{attachment.type === 'picture' && attachment.picture.type === 'image/gif' &&
				<PictureBadge placement="bottom-right">
					gif
				</PictureBadge>
			}
			{attachment.type === 'video' &&
				<VideoDuration duration={attachment.video.duration}/>
			}
			{moreAttachmentsCount > 0 &&
				<span className="PostAttachmentThumbnail__more-count">
					{/* `<span/>` is used instead of a `<div/>`
					    because a `<div/>` isn't supposed to be inside a `<button/>`. */}
					+{moreAttachmentsCount + 1}
				</span>
			}
		</Picture>
	)
}

PostAttachmentThumbnail.propTypes = {
	attachment: PropTypes.oneOfType([
		pictureAttachment,
		videoAttachment
	]).isRequired,
	component: PropTypes.elementType.isRequired,
	componentProps: PropTypes.object,
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

PostAttachmentThumbnail.defaultProps = {
	component: ButtonOrLink
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
			className="PostAttachmentThumbnail-spoiler">
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
	// This `onClick(event)` function is not `async`
	// because an `async` function results in a React warning
	// telling that a "synthetic event" has been reused.
	const onClick = useCallback((event) => {
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
			const finish = () => {
				if (isMounted.current) {
					setIsLoading(false)
				}
			}
			return preloadPicture(attachment, { fixAttachmentPictureSize }).then(
				finish,
				(error) => {
					console.error(error)
					finish()
				}
			)
		}
	}, [
		attachment,
		fixAttachmentPictureSize,
		thumbnailElement,
		setIsLoading
	])
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

async function preloadPicture(attachment, { fixAttachmentPictureSize }) {
	// `lynxchan` doesn't provide `width` and `height`
	// neither for the picture not for the thumbnail
	// in `/catalog.json` API response (which is a bug).
	// http://lynxhub.com/lynxchan/res/722.html#q984
	if (fixAttachmentPictureSize) {
		await getOriginalPictureSizeAndUrl(attachment)
	}
	await preloadPictureSlide(attachment)
	// For testing/styling.
	// await new Promise(_ => setTimeout(_, 3000))
}