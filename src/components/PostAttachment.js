import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { FadeInOut, ActivityIndicator } from 'react-responsive-ui'

import { getViewportWidth } from './Slideshow'
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

export default class PostAttachment extends React.Component {
	static propTypes = {
		attachment: PropTypes.oneOfType([
			pictureAttachment,
			videoAttachment
		]).isRequired,
		onClick: PropTypes.func,
		spoilerLabel: PropTypes.string,
		maxSize: PropTypes.number,
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
				className={classNames('post__attachment-thumbnail__clickable', className)}>
				<AttachmentThumbnail
					attachment={attachment}
					saveBandwidth={saveBandwidth}
					spoilerLabel={spoilerLabel}
					isRevealed={isRevealed}
					maxSize={maxSize}
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
			const picture = attachment.picture
			// Preload the picture.
			this.setState({
				isLoading: true
			})
			await SlideshowPicture.preload(attachment.picture, getViewportWidth())
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

function AttachmentSpoilerBar({ width, height, children: spoilerLabel, ...rest }) {
	let fontSize = Math.floor(width / spoilerLabel.length)
	if (fontSize > height) {
		if (height > 20) {
			fontSize = 16
		} else {
			return null
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
	width: PropTypes.number.isRequired,
	height: PropTypes.number.isRequired,
	children: PropTypes.string.isRequired
}

const BLUR_FACTOR = 0.1

function AttachmentThumbnail({
	attachment,
	isRevealed,
	maxSize,
	saveBandwidth,
	spoilerLabel,
	moreAttachmentsCount
}) {
	const picture = attachment.type === 'video' ? attachment.video.picture : attachment.picture
	const width = picture.sizes ? picture.sizes[0].width : picture.width
	const height = picture.sizes ? picture.sizes[0].height : picture.height
	return (
		<React.Fragment>
			<Picture
				preview
				picture={picture}
				width={width}
				height={height}
				saveBandwidth={saveBandwidth}
				blur={attachment.spoiler && !isRevealed ? Math.min(width, height) * BLUR_FACTOR : undefined}
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