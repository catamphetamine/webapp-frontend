import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FadeInOut, ActivityIndicator } from 'react-responsive-ui'

import { getViewportWidth } from '../utility/dom'
import SlideshowPicture from './Slideshow.Picture'
import ButtonOrLink from './ButtonOrLink'
import Picture, { getAspectRatio } from './Picture'

import {
	VideoDuration,
	getUrl as getVideoUrl
} from './Video'

import {
	pictureAttachment,
	videoAttachment
} from '../PropTypes'

import './PostAttachment.css'

export default class PostAttachment extends React.Component {
	static propTypes = {
		attachment: PropTypes.oneOfType([
			pictureAttachment,
			videoAttachment
		]).isRequired,
		onClick: PropTypes.func,
		spoilerLabel: PropTypes.string,
		maxSize: PropTypes.number,
		exactSize: PropTypes.bool,
		saveBandwidth: PropTypes.bool,
		moreAttachmentsCount: PropTypes.number,
		className: PropTypes.string
	}

	state = {
		isRevealed: this.props.attachment.spoiler ? false : true
	}

	onClick = (event) => {
		const {
			attachment,
			onClick
		} = this.props
		if (attachment.spoiler) {
			this.setState({
				isRevealed: true
			})
		}
		if (onClick) {
			onClick(event)
		}
	}

	render() {
		const {
			onClick,
			attachment,
			spoilerLabel,
			maxSize,
			exactSize,
			saveBandwidth,
			moreAttachmentsCount,
			className
		} = this.props
		const {
			isRevealed
		} = this.state
		return (
			<AttachmentButton
				attachment={attachment}
				title={isRevealed ? attachment.title : spoilerLabel}
				onClick={this.onClick}
				style={!exactSize && maxSize ? { width: '100%', maxWidth: getMaxWidth(attachment, maxSize) + 'px' } : undefined}
				className={classNames('post__attachment-thumbnail__clickable', className)}>
				<AttachmentThumbnail
					attachment={attachment}
					saveBandwidth={saveBandwidth}
					spoilerLabel={spoilerLabel}
					isRevealed={isRevealed}
					maxSize={maxSize}
					exactSize={exactSize}
					moreAttachmentsCount={moreAttachmentsCount}/>
			</AttachmentButton>
		)
	}
}

class AttachmentButton extends React.Component {
	static propTypes = {
		attachment: PropTypes.object.isRequired,
		onClick: PropTypes.func.isRequired,
		title: PropTypes.string,
		style: PropTypes.object,
		className: PropTypes.string,
		children: PropTypes.node.isRequired
	}

	state = {
		isLoading: false
	}

	constructor() {
		super()
		this.onClick = this.onClick.bind(this)
	}

	async onClick(event) {
		const {
			attachment,
			onClick
		} = this.props
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		// Prevent hyperlink click.
		event.preventDefault()
		if (attachment.type === 'picture') {
			// Preload the picture.
			this.setState({
				isLoading: true
			})
			await SlideshowPicture.preload(attachment, getViewportWidth())
			// For testing/styling.
			// await new Promise(_ => setTimeout(_, 30000000))
			this.setState({
				isLoading: false
			})
		}
		onClick({
			// Simulate `event` argument.
			// Otherwise React would compain about not calling `event.persist()`.
			preventDefault() {
				this.defaultPrevented = true
			},
			stopPropagation() {}
		})
	}

	render() {
		const {
			attachment,
			title,
			style,
			className,
			children
		} = this.props
		const {
			isLoading
		} = this.state

		// <button
		// 	type="button"
		// 	className={classNames('rrui__button-reset', className)}>

		return (
			<ButtonOrLink
				url={getAttachmentUrl(attachment)}
				title={title}
				onClick={this.onClick}
				style={style}
				className={className}>
				{isLoading &&
					<FadeInOut show fadeInInitially fadeInDuration={3000} fadeOutDuration={0}>
						<div className="post__attachment-thumbnail__loading">
							<ActivityIndicator className="post__attachment-thumbnail__loading-indicator"/>
						</div>
					</FadeInOut>
				}
				{children}
			</ButtonOrLink>
		)
	}
}

const DEFAULT_FONT_SIZE = 16
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE_HEIGHT_FACTOR = 0.85

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

const BLUR_FACTOR = 0.1

function AttachmentThumbnail({
	attachment,
	isRevealed,
	maxSize,
	exactSize,
	saveBandwidth,
	spoilerLabel,
	moreAttachmentsCount
}) {
	const picture = attachment.type === 'video' ? attachment.video.picture : attachment.picture
	const isLandscape = picture.width >= picture.height
	let width
	let height
	if (exactSize) {
		const aspectRatio = getAspectRatio(picture)
		if (aspectRatio >= 1) {
			width = maxSize
			height = width / aspectRatio
		} else {
			height = maxSize
			width = height * aspectRatio
		}
	}
	return (
		<React.Fragment>
			<Picture
				preview
				picture={picture}
				width={width}
				height={height}
				maxWidth={!exactSize && isLandscape ? maxSize : undefined}
				maxHeight={!exactSize && !isLandscape ? maxSize : undefined}
				maxWidthWrapper={false}
				saveBandwidth={saveBandwidth}
				blur={attachment.spoiler && !isRevealed ? BLUR_FACTOR : undefined}
				className={classNames('post__attachment-thumbnail__picture', {
					// 'post__attachment-thumbnail__picture--spoiler': attachment.spoiler && !isRevealed
				})}/>
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
		</React.Fragment>
	)
}

AttachmentThumbnail.propTypes = {
	attachment: postAttachment.isRequired,
	isRevealed: PropTypes.bool,
	maxSize: PropTypes.number.isRequired,
	exactSize: PropTypes.bool,
	saveBandwidth: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	moreAttachmentsCount: PropTypes.number
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

function getMaxWidth(attachment, maxSize) {
	const picture = attachment.type === 'video' ? attachment.video.picture : attachment.picture
	const size = attachment.type === 'video' ? attachment.video : attachment.picture
	const aspectRatio = getAspectRatio(picture)
	return aspectRatio >= 1 ? Math.min(maxSize, size.width) : Math.min(maxSize, size.height) / aspectRatio
}