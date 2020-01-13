import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostCode from './PostCode'
import PostInlineQuoteLink from './PostInlineQuoteLink'
import PostInlineQuote from './PostInlineQuote'
import PostQuoteBlock from './PostQuoteBlock'
import PostInlineSpoiler from './PostInlineSpoiler'
import PostText from './PostText'
import PostLink from './PostLink'
import PostEmoji from './PostEmoji'
import PostReadMore from './PostReadMore'
import PostAttachment from './PostAttachment'

import { postParagraph, postInlineElement } from '../PropTypes'

export default function PostInlineContent({
	children,
	...rest
}) {
	if (typeof children === 'string') {
		return children
	}
	return toArray(children).map((content, i) => (
		<PostInlineContentElement
			key={i}
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
		serviceIcons
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
			// When `post-link` quote text was generated from an untitled attachment
			// then such `post-link` is supposed to have the corresponding `attachment` set
			// so that it could be displayed instead of a generic "Picture"/"Video" placeholder.
			function renderAttachmentQuote(content) {
				return (
					<PostQuoteBlock
						inline
						kind={content.kind}
						generated>
						<PostAttachment
							attachment={content.attachment}
							component={PostQuoteAttachment}
							useSmallestThumbnail={useSmallestThumbnailsForAttachments}
							maxSize={attachmentThumbnailSize}
							spoilerLabel={spoilerLabel}/>
					</PostQuoteBlock>
				)
			}
			return (
				<PostInlineQuoteLink
					block={block}
					onClick={onPostLinkClick}
					disabled={disabled}
					postLink={content}
					url={content.url}>
					{block && content.attachment ? renderAttachmentQuote(content) : renderContent(content.content)}
				</PostInlineQuoteLink>
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

function PostQuoteAttachment({ className, ...rest }, ref) {
	return (
		<span
			{...rest}
			ref={ref}
			className={classNames(className, 'post__quote-block__attachment')}/>
	)
}

PostQuoteAttachment = React.forwardRef(PostQuoteAttachment)

PostQuoteAttachment.propTypes = {
	className: PropTypes.string
}