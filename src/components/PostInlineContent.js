import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import getPicturesAndVideos from 'social-components/commonjs/utility/post/getPicturesAndVideos'
import { sortByThumbnailHeightDescending } from 'social-components/commonjs/utility/post/getSortedAttachments'

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
	onSocialClick: PropTypes.func,
	isSocialClickable: PropTypes.func,
	useSmallestThumbnailsForAttachments: PropTypes.bool,
	attachmentThumbnailSize: PropTypes.number,
	spoilerLabel: PropTypes.string,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	markFirstQuote: PropTypes.bool,
	expandPostLinkBlockQuotes: PropTypes.bool,
	postLinkQuoteMinimizedComponent: PropTypes.elementType,
	postLinkQuoteExpandTimeout: PropTypes.number,
	isPostLinkQuoteExpanded: PropTypes.func,
	onPostLinkQuoteExpand: PropTypes.func,
	onRenderedContentDidChange: PropTypes.func,
	children: postParagraph.isRequired
}

function PostInlineContentElement({
	children: content,
	...rest
}) {
	const {
		url,
		onReadMore,
		readMoreLabel,
		onAttachmentClick,
		onPostLinkClick,
		isPostLinkClickable,
		onSocialClick,
		isSocialClickable,
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
		onRenderedContentDidChange
	} = rest
	// If `onPostLinkClick()` is called as a result of clicking an inline link to a post,
	// then instead of navigating to that post, it could just display that post in a modal.
	// That would be the case when the post link links to a post that's in the same thread
	// as the currently displayed post. That's what the `content` argument is for — it's the
	// `postLink` argument, where an application could determine whether the `postLink` is
	// from the currently-being-viewed thread.
	const onPostLinkClickWithPostLinkArgument = useCallback((event) => {
		onPostLinkClick(event, content)
	}, [onPostLinkClick, content])
	// Sometimes there's an attachment thumbnail inside a post link's quote block.
	// In those cases, `<PostAttachmentThumbnailQuote/>` is rendered inside a `<PostQuoteLink/>`.
	// So, if an attachment is expanded on click, the enclosing post link shouldn't get clicked.
	// For that, `if (!event.defaultPrevented)` is added, and when a user clicks an
	// attachment thumbnail, `<PostAttachmentThumbnailQuote/>` calls `event.preventDefault()`.
	const onPostLinkClickCancellable = useCallback((event) => {
		if (!event.defaultPrevented) {
			onPostLinkClickWithPostLinkArgument(event)
		}
	}, [onPostLinkClickWithPostLinkArgument])
	if (content === '\n') {
		return <br/>
	} else if (typeof content === 'string') {
		return content
	} else if (Array.isArray(content)) {
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
	const contentElement = content.content && (
		<PostInlineContentElement {...rest}>
			{content.content}
		</PostInlineContentElement>
	)
	if (content.type === 'text') {
		return (
			<PostText style={content.style}>
				{contentElement}
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
					{contentElement}
				</PostQuoteBlock>
			)
		}
		return (
			<PostInlineQuote
				kind={content.kind}
				generated={content.generated}>
				{contentElement}
			</PostInlineQuote>
		)
	} else if (content.type === 'spoiler') {
		return (
			<PostInlineSpoiler
				censored={content.censored}
				content={content.content}>
				{contentElement}
			</PostInlineSpoiler>
		)
	} else if (content.type === 'post-link') {
		const disabled = isPostLinkClickable ? !isPostLinkClickable(content) : undefined
		if (Array.isArray(content.content) && content.content[0].type === 'quote') {
			const isBlockQuote = content.content[0].block
			let attachmentsRenderedAsQuoteContent
			if (isBlockQuote && content.attachments) {
				attachmentsRenderedAsQuoteContent = getPicturesAndVideos(content.attachments)
				sortByThumbnailHeightDescending(attachmentsRenderedAsQuoteContent)
			}
			const isGeneratedQuote = Array.isArray(content.content) && content.content[0].type === 'quote' && content.content[0].generated
			return (
				<PostQuoteLink
					first={markFirstQuote}
					block={isBlockQuote}
					minimized={isGeneratedQuote && isBlockQuote && expandPostLinkBlockQuotes === false}
					minimizedComponent={postLinkQuoteMinimizedComponent}
					expandTimeout={postLinkQuoteExpandTimeout}
					isExpanded={isPostLinkQuoteExpanded}
					onExpand={onPostLinkQuoteExpand}
					onDidExpand={onRenderedContentDidChange}
					onClick={onPostLinkClickCancellable}
					disabled={disabled}
					postLink={content}
					url={content.url}
					className={attachmentsRenderedAsQuoteContent ? 'PostQuoteLink--attachments' : undefined}>
					{attachmentsRenderedAsQuoteContent ?
						<PostAttachmentThumbnailQuote
							attachments={attachmentsRenderedAsQuoteContent}
							markFirstQuote={markFirstQuote}
							useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
							attachmentThumbnailSize={attachmentThumbnailSize}
							onAttachmentClick={onAttachmentClick}
							spoilerLabel={spoilerLabel}/> :
						contentElement
					}
				</PostQuoteLink>
			)
		}
		if (disabled) {
			return contentElement
		}
		return (
			<PostLink
				url={content.url}
				onClick={onPostLinkClickWithPostLinkArgument}>
				{contentElement}
			</PostLink>
		)
	} else if (content.type === 'link') {
		return (
			<PostLink
				url={content.url}
				contentGenerated={content.contentGenerated}
				attachment={content.attachment}
				service={content.service}
				onSocialClick={onSocialClick}
				isSocialClickable={isSocialClickable}
				onAttachmentClick={onAttachmentClick}
				serviceIcons={serviceIcons}>
				{contentElement}
			</PostLink>
		)
	} else if (content.type === 'code') {
		return (
			<PostCode
				inline
				language={content.language}>
				{contentElement}
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
		return contentElement || null
	}
}

PostInlineContentElement.propTypes = {
	...PostInlineContent.propTypes,
	children: postInlineElement.isRequired
}

function toArray(content) {
	return Array.isArray(content) ? content : [content]
}