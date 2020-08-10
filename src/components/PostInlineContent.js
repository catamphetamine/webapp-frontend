import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostCode from './PostCode'
import PostQuoteLink from './PostQuoteLink'
import PostInlineQuote from './PostInlineQuote'
import PostQuoteBlock from './PostQuoteBlock'
import PostInlineSpoiler from './PostInlineSpoiler'
import PostText from './PostText'
import PostLink from './PostLink'
import PostEmoji from './PostEmoji'
import PostReadMore from './PostReadMore'
import PostAttachmentThumbnailQuote from './PostAttachmentThumbnailQuote'

import { postParagraph, postInlineElement } from '../PropTypes'

export default function PostInlineContent({
	children,
	markFirstQuote,
	...rest
}) {
	if (typeof children === 'string') {
		return children
	}
	return toArray(children).map((content, i) => (
		<PostInlineContentElement
			key={i}
			markFirstQuote={markFirstQuote && i === 0}
			{...rest}>
			{content}
		</PostInlineContentElement>
	))
}

PostInlineContent.propTypes = {
	url: PropTypes.string,
	onReadMore: PropTypes.func.isRequired,
	readMoreLabel: PropTypes.string,
	onAttachmentClick: PropTypes.func,
	onPostLinkClick: PropTypes.func,
	isPostLinkClickable: PropTypes.func,
	useSmallestThumbnailsForAttachments: PropTypes.bool,
	attachmentThumbnailSize: PropTypes.number.isRequired,
	spoilerLabel: PropTypes.string,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	markFirstQuote: PropTypes.bool,
	expandPostLinkBlockQuotes: PropTypes.bool,
	postLinkQuoteMinimizedComponent: PropTypes.elementType,
	postLinkQuoteExpandTimeout: PropTypes.number,
	isPostLinkQuoteExpanded: PropTypes.func,
	onPostLinkQuoteExpand: PropTypes.func,
	onContentDidChange: PropTypes.func,
	children: postParagraph.isRequired
}

function PostInlineContentElement({ children: content, ...rest }) {
	const {
		url,
		onReadMore,
		readMoreLabel,
		onAttachmentClick,
		onPostLinkClick,
		isPostLinkClickable,
		useSmallestThumbnailsForAttachments,
		attachmentThumbnailSize,
		spoilerLabel,
		serviceIcons,
		markFirstQuote,
		expandPostLinkBlockQuotes,
		postLinkQuoteMinimizedComponent,
		postLinkQuoteExpandTimeout,
		isPostLinkQuoteExpanded,
		onPostLinkQuoteExpand,
		onContentDidChange
	} = rest
	const onPostLinkClick_ = useCallback((event) => {
		onPostLinkClick(event, content)
	}, [onPostLinkClick, content])
	if (content === '\n') {
		return <br/>
	} else if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostInlineContent {...rest}>
				{content}
			</PostInlineContent>
		)
	} else if (content.type === 'emoji') {
		return (
			<PostEmoji>
				{content}
			</PostEmoji>
		)
	}
	function renderContent(content) {
		if (typeof content === 'string') {
			return content
		}
		return (
			<PostInlineContentElement {...rest}>
				{content}
			</PostInlineContentElement>
		)
	}
	if (content.type === 'text') {
		return (
			<PostText style={content.style}>
				{renderContent(content.content)}
			</PostText>
		)
	} else if (content.type === 'quote') {
		if (content.block) {
			return (
				<PostQuoteBlock
					inline
					first={markFirstQuote}
					kind={content.kind}
					generated={content.generated}>
					{renderContent(content.content)}
				</PostQuoteBlock>
			)
		}
		return (
			<PostInlineQuote
				kind={content.kind}
				generated={content.generated}>
				{renderContent(content.content)}
			</PostInlineQuote>
		)
	} else if (content.type === 'spoiler') {
		return (
			<PostInlineSpoiler
				censored={content.censored}
				content={content.content}>
				{renderContent(content.content)}
			</PostInlineSpoiler>
		)
	} else if (content.type === 'post-link') {
		const disabled = isPostLinkClickable ? !isPostLinkClickable(content) : undefined
		if (Array.isArray(content.content) && content.content[0].type === 'quote') {
			const block = content.content[0].block
			const shouldRenderAttachment = block && content.attachment &&
				(content.attachment.type === 'picture' || content.attachment.type === 'video')
			const isGeneratedQuote = Array.isArray(content.content) && content.content[0].type === 'quote' && content.content[0].generated
			return (
				<PostQuoteLink
					first={markFirstQuote}
					block={block}
					minimized={isGeneratedQuote && block && expandPostLinkBlockQuotes === false}
					minimizedComponent={postLinkQuoteMinimizedComponent}
					expandTimeout={postLinkQuoteExpandTimeout}
					isExpanded={isPostLinkQuoteExpanded}
					onExpand={onPostLinkQuoteExpand}
					onDidExpand={onContentDidChange}
					onClick={onPostLinkClick}
					disabled={disabled}
					postLink={content}
					url={content.url}
					className={shouldRenderAttachment ? 'PostQuoteLink--attachment' : undefined}>
					{shouldRenderAttachment ?
						<PostAttachmentThumbnailQuote
							postLink={content}
							markFirstQuote={markFirstQuote}
							useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
							attachmentThumbnailSize={attachmentThumbnailSize}
							spoilerLabel={spoilerLabel}/> :
						renderContent(content.content)
					}
				</PostQuoteLink>
			)
		}
		if (disabled) {
			return renderContent(content.content)
		}
		return (
			<PostLink
				url={content.url}
				onClick={onPostLinkClick_}>
				{renderContent(content.content)}
			</PostLink>
		)
	} else if (content.type === 'link') {
		return (
			<PostLink
				url={content.url}
				contentGenerated={content.contentGenerated}
				attachment={content.attachment}
				service={content.service}
				onAttachmentClick={onAttachmentClick}
				serviceIcons={serviceIcons}>
				{renderContent(content.content)}
			</PostLink>
		)
	} else if (content.type === 'code') {
		return (
			<PostCode
				inline
				language={content.language}>
				{renderContent(content.content)}
			</PostCode>
		)
	} else if (content.type === 'read-more') {
		return (
			<React.Fragment>
				{' '}
				<PostReadMore
					url={url}
					onReadMore={onReadMore}
					readMoreLabel={readMoreLabel}/>
			</React.Fragment>
		)
	} else {
		console.error(`Unsupported post inline content:\n`, content)
		return null
	}
}

PostInlineContentElement.propTypes = {
	...PostInlineContent.propTypes,
	children: postInlineElement.isRequired
}

function toArray(content) {
	return Array.isArray(content) ? content : [content]
}