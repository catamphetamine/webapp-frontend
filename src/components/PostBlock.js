import React from 'react'
import PropTypes from 'prop-types'

import PostSubheading from './PostSubheading'
import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostCode from './PostCode'
import PostQuote from './PostQuote'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'
import PostSocial from './PostSocial'
import PostReadMore from './PostReadMore'

import PostInlineContent from './PostInlineContent'

import { postBlock, postAttachment } from '../PropTypes'

export default function PostBlock({
	url,
	onReadMore,
	readMoreLabel,
	attachments,
	attachmentThumbnailSize,
	onAttachmentClick,
	serviceIcons,
	expandAttachments,
	spoilerLabel,
	locale,
	children: content
}) {
	function renderContent(content) {
		if (typeof content === 'string') {
			return content
		}
		return (
			<PostInlineContent
				url={url}
				onReadMore={onReadMore}
				readMoreLabel={readMoreLabel}
				onAttachmentClick={onAttachmentClick}
				serviceIcons={serviceIcons}>
				{content}
			</PostInlineContent>
		)
	}
	if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostParagraph>
				{renderContent(content)}
			</PostParagraph>
		)
	} else if (content.type === 'heading') {
		return (
			<PostSubheading>
				{renderContent(content.content)}
			</PostSubheading>
		)
	} else if (content.type === 'list') {
		return (
			<PostList>
				{content.items}
			</PostList>
		)
	} else if (content.type === 'quote') {
		return (
			<PostQuote>
				{content}
			</PostQuote>
		)
	} else if (content.type === 'code') {
		return (
			<PostCode
				language={content.language}>
				{renderContent(content.content)}
			</PostCode>
		)
	} else if (content.type === 'read-more') {
		return (
			<PostParagraph>
				<PostReadMore
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}/>
			</PostParagraph>
		)
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
						expand={expandAttachments}
						attachment={attachment}
						spoilerLabel={spoilerLabel}
						maxHeight={attachmentThumbnailSize}
						onClick={onAttachmentClick ?
							(event) => {
								event.preventDefault()
								onAttachmentClick(attachment, 0, [attachment])
							} :
							undefined
						}/>
				)
			case 'video':
				return (
					<PostVideo
						expand={expandAttachments}
						attachment={attachment}
						spoilerLabel={spoilerLabel}
						maxHeight={attachmentThumbnailSize}
						onClick={onAttachmentClick ?
							(event) => {
								event.preventDefault()
								onAttachmentClick(attachment, 0, [attachment])
							} :
							undefined
						}/>
				)
			case 'audio':
				return <PostAudio>{attachment}</PostAudio>
			case 'social':
				return (
					<PostSocial
						expandAttachments={expandAttachments}
						social={attachment.social}
						locale={locale}
						attachmentThumbnailSize={attachmentThumbnailSize}
						onAttachmentClick={onAttachmentClick}/>
				)
			default:
				console.error(`Unknown embedded attachment type: "${attachment.type}"\n`, attachment)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return (
			<PostParagraph>
				{renderContent(
					(Array.isArray(content.content) || content.content) ?
						content.content :
						JSON.stringify(content.content)
				)}
			</PostParagraph>
		)
	}
}

PostBlock.propTypes = {
	url: PropTypes.string,
	onReadMore: PropTypes.func.isRequired,
	readMoreLabel: PropTypes.string,
	attachments: PropTypes.arrayOf(postAttachment).isRequired,
	attachmentThumbnailSize: PropTypes.number,
	onAttachmentClick: PropTypes.func,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	expandAttachments: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	locale: PropTypes.string,
	children: postBlock.isRequired
}