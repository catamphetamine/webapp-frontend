import React from 'react'
import PropTypes from 'prop-types'

import PostSubheading from './PostSubheading'
import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostMonospace from './PostMonospace'
import PostQuote from './PostQuote'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import PostInlineContent from './PostInlineContent'

import { postBlock, postAttachment } from '../PropTypes'

export default function PostBlock({
	attachments,
	attachmentThumbnailSize,
	openSlideshow,
	serviceIcons,
	children: content
}) {
	if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostParagraph>
				<PostInlineContent openSlideshow={openSlideshow} serviceIcons={serviceIcons}>
					{content}
				</PostInlineContent>
			</PostParagraph>
		)
	} else if (content.type === 'heading') {
		return <PostSubheading>{content}</PostSubheading>
	} else if (content.type === 'list') {
		return <PostList>{content}</PostList>
	} else if (content.type === 'quote') {
		return <PostQuote>{content}</PostQuote>
	} else if (content.type === 'monospace') {
		return <PostMonospace>{content.content}</PostMonospace>
	} else if (content.type === 'attachment') {
		const attachment = attachments.filter(_ => _.id === content.attachmentId)[0]
		if (!attachment) {
			console.error(`Attachment not found: ${content.attachmentId}`)
			return null
		}
		switch (attachment.type) {
			case 'picture':
				return (
					<PostPicture
						onClick={openSlideshow ?
							(event) => {
								event.preventDefault()
								openSlideshow([attachment.picture])
							} :
							undefined
						}>
						{attachment}
					</PostPicture>
				)
			case 'video':
				const maxHeight = attachment.video.height ? Math.min(attachment.video.height, attachmentThumbnailSize) : attachmentThumbnailSize
				return (
					<PostVideo
						height={content.fit === 'height' ? maxHeight : undefined}
						onClick={openSlideshow ?
							(event) => {
								event.preventDefault()
								openSlideshow([attachment.video])
							} :
							undefined
						}>
						{attachment}
					</PostVideo>
				)
			case 'audio':
				return <PostAudio>{attachment}</PostAudio>
			default:
				console.error(`Unknown embedded attachment type: "${attachment.type}"\n`, attachment)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return (
			<PostParagraph>
				<PostInlineContent openSlideshow={openSlideshow} serviceIcons={serviceIcons}>
					{(Array.isArray(content.content) || content.content) ? content.content : JSON.stringify(content.content)}
				</PostInlineContent>
			</PostParagraph>
		)
	}
}

PostBlock.propTypes = {
	attachments: PropTypes.arrayOf(postAttachment).isRequired,
	attachmentThumbnailSize: PropTypes.number,
	openSlideshow: PropTypes.func,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	children: postBlock.isRequired
}