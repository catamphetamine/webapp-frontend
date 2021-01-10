import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getEmbeddedAttachment from 'social-components/commonjs/utility/post/getEmbeddedAttachment'

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

import { getAttachmentThumbnailSize } from './PostAttachmentThumbnail'

import { postBlock, postAttachment } from '../PropTypes'

import './PostContentBlock.css'

export default function PostContentBlock({
	compact,
	url,
	onReadMore,
	readMoreLabel,
	attachments,
	attachmentThumbnailSize,
	useSmallestThumbnailsForAttachments,
	onAttachmentClick,
	onPostLinkClick,
	isPostLinkClickable,
	serviceIcons,
	expandAttachments,
	first,
	markFirstQuote,
	expandPostLinkBlockQuotes,
	postLinkQuoteMinimizedComponent,
	postLinkQuoteExpandTimeout,
	isPostLinkQuoteExpanded,
	onPostLinkQuoteExpand,
	onRenderedContentDidChange,
	isSocialClickable,
	onSocialClick,
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
				onPostLinkClick={onPostLinkClick}
				isPostLinkClickable={isPostLinkClickable}
				onRenderedContentDidChange={onRenderedContentDidChange}
				onSocialClick={onSocialClick}
				isSocialClickable={isSocialClickable}
				useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
				attachmentThumbnailSize={attachmentThumbnailSize}
				spoilerLabel={spoilerLabel}
				serviceIcons={serviceIcons}
				markFirstQuote={first && markFirstQuote}
				expandPostLinkBlockQuotes={expandPostLinkBlockQuotes}
				postLinkQuoteMinimizedComponent={postLinkQuoteMinimizedComponent}
				postLinkQuoteExpandTimeout={postLinkQuoteExpandTimeout}
				isPostLinkQuoteExpanded={isPostLinkQuoteExpanded}
				onPostLinkQuoteExpand={onPostLinkQuoteExpand}>
				{content}
			</PostInlineContent>
		)
	}
	if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostParagraph first={first}>
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
			<PostList
				onSocialClick={onSocialClick}
				isSocialClickable={isSocialClickable}
				onAttachmentClick={onAttachmentClick}
				serviceIcons={serviceIcons}>
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
			<PostParagraph first={first}>
				<PostReadMore
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}/>
			</PostParagraph>
		)
	} else if (content.type === 'attachment') {
		const attachment = getEmbeddedAttachment(content, attachments)
		if (!attachment) {
			console.error(`Attachment not found: ${content.attachmentId}`)
			return null
		}
		const className = 'PostContentBlock'
		// const className = classNames({
		// 	'PostContentBlock--marginLarge': content.margin === 'large',
		// 	'PostContentBlock--marginMedium': content.margin === 'medium' || !content.margin,
		// 	'PostContentBlock--marginSmall': content.margin === 'small'
		// })
		// Max recommended height for a picture or a video.
		const maxHeight = content.maxHeight === 'none'
			? undefined
			: content.maxHeight || (
				compact
					? getAttachmentThumbnailSize(attachmentThumbnailSize)
					: undefined
			)
		const align = compact ? 'left' : 'center'
		switch (attachment.type) {
			case 'picture':
				return (
					<PostPicture
						expand={expandAttachments || maxHeight === undefined}
						expandToTheFullest={content.expand}
						align={align}
						border={content.border}
						attachment={attachment}
						spoilerLabel={spoilerLabel}
						maxHeight={maxHeight}
						link={content.link}
						onClick={onAttachmentClick ?
							(event) => {
								event.preventDefault()
								onAttachmentClick(attachment, { imageElement: event.target })
							} :
							undefined
						}
						className={className}/>
				)
			case 'video':
				return (
					<PostVideo
						expand={expandAttachments || maxHeight === undefined}
						expandToTheFullest={content.expand}
						align={align}
						border={content.border}
						attachment={attachment}
						spoilerLabel={spoilerLabel}
						maxHeight={maxHeight}
						onClick={onAttachmentClick ?
							(event) => {
								event.preventDefault()
								onAttachmentClick(attachment, { imageElement: event.target })
							} :
							undefined
						}
						className={className}/>
				)
			case 'audio':
				return (
					<PostAudio
						align={align}
						className={className}>
						{attachment}
					</PostAudio>
				)
			case 'social':
				return (
					<PostSocial
						expandAttachments={expandAttachments}
						social={attachment.social}
						locale={locale}
						attachmentThumbnailSize={attachmentThumbnailSize}
						onAttachmentClick={onAttachmentClick}
						isClickable={isSocialClickable}
						onClick={onSocialClick}
						className={className}/>
				)
			default:
				console.error(`Unknown embedded attachment type: "${attachment.type}"\n`, attachment)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return (
			<PostParagraph first={first}>
				{renderContent(
					(Array.isArray(content.content) || content.content) ?
						content.content :
						JSON.stringify(content.content)
				)}
			</PostParagraph>
		)
	}
}

PostContentBlock.propTypes = {
	compact: PropTypes.bool,
	url: PropTypes.string,
	onReadMore: PropTypes.func.isRequired,
	readMoreLabel: PropTypes.string,
	// `attachments` property isn't passed when just
	// rendering `<Content/>` from `PostContent.js`.
	attachments: PropTypes.arrayOf(postAttachment),
	attachmentThumbnailSize: PropTypes.number,
	onAttachmentClick: PropTypes.func,
	onPostLinkClick: PropTypes.func,
	isPostLinkClickable: PropTypes.func,
	useSmallestThumbnailsForAttachments: PropTypes.bool,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	expandAttachments: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	first: PropTypes.bool,
	markFirstQuote: PropTypes.bool,
	expandPostLinkBlockQuotes: PropTypes.bool,
	postLinkQuoteMinimizedComponent: PropTypes.elementType,
	postLinkQuoteExpandTimeout: PropTypes.number,
	isPostLinkQuoteExpanded: PropTypes.func,
	onPostLinkQuoteExpand: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	isSocialClickable: PropTypes.func,
	onSocialClick: PropTypes.func,
	locale: PropTypes.string,
	children: postBlock.isRequired
}