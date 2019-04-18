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
	openSlideshow,
	serviceIcons,
	saveBandwidth,
	spoilerLabel,
	locale,
	children: content
}) {
	if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostParagraph>
				<PostInlineContent
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}
					openSlideshow={openSlideshow}
					serviceIcons={serviceIcons}>
					{content}
				</PostInlineContent>
			</PostParagraph>
		)
	} else if (content.type === 'heading') {
		return (
			<PostSubheading>
				<PostInlineContent
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}
					openSlideshow={openSlideshow}
					serviceIcons={serviceIcons}>
					{content}
				</PostInlineContent>
			</PostSubheading>
		)
	} else if (content.type === 'list') {
		return <PostList>{content.items}</PostList>
	} else if (content.type === 'quote') {
		return <PostQuote>{content}</PostQuote>
	} else if (content.type === 'monospace') {
		return (
			<PostMonospace>
				<PostInlineContent
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}
					openSlideshow={openSlideshow}
					serviceIcons={serviceIcons}>
					{content.content}
				</PostInlineContent>
			</PostMonospace>
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
						attachment={attachment}
						saveBandwidth={saveBandwidth}
						spoilerLabel={spoilerLabel}
						maxHeight={attachmentThumbnailSize}
						onClick={openSlideshow ?
							(event) => {
								event.preventDefault()
								openSlideshow([attachment])
							} :
							undefined
						}/>
				)
			case 'video':
				return (
					<PostVideo
						attachment={attachment}
						saveBandwidth={saveBandwidth}
						spoilerLabel={spoilerLabel}
						maxHeight={attachmentThumbnailSize}
						onClick={openSlideshow ?
							(event) => {
								event.preventDefault()
								openSlideshow([attachment])
							} :
							undefined
						}/>
				)
			case 'audio':
				return <PostAudio>{attachment}</PostAudio>
			case 'social':
				return (
					<PostSocial
						social={attachment.social}
						locale={locale}
						attachmentThumbnailSize={attachmentThumbnailSize}
						saveBandwidth={saveBandwidth}
						openSlideshow={openSlideshow}/>
				)
			default:
				console.error(`Unknown embedded attachment type: "${attachment.type}"\n`, attachment)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return (
			<PostParagraph>
				<PostInlineContent
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}
					openSlideshow={openSlideshow}
					serviceIcons={serviceIcons}>
					{(Array.isArray(content.content) || content.content) ? content.content : JSON.stringify(content.content)}
				</PostInlineContent>
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
	openSlideshow: PropTypes.func,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	saveBandwidth: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	locale: PropTypes.string,
	children: postBlock.isRequired
}