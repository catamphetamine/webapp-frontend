import React from 'react'
import PropTypes from 'prop-types'

import PostCode from './PostCode'
import PostInlineQuoteLink from './PostInlineQuoteLink'
import PostInlineQuote from './PostInlineQuote'
import PostInlineSpoiler from './PostInlineSpoiler'
import PostText from './PostText'
import PostLink from './PostLink'
import PostEmoji from './PostEmoji'
import PostReadMore from './PostReadMore'

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
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	children: postParagraph.isRequired
}

function PostInlineContentElement({ children: content, ...rest }) {
	const {
		url,
		onReadMore,
		readMoreLabel,
		onAttachmentClick,
		serviceIcons
	} = rest
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
		if (Array.isArray(content.content) && content.content[0].type === 'quote') {
			return (
				<PostInlineQuoteLink
					url={content.url}>
					{renderContent(content.content)}
				</PostInlineQuoteLink>
			)
		}
		return (
			<PostLink
				url={content.url}
				className="post__link--post">
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