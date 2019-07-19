import React from 'react'
import PropTypes from 'prop-types'

import PostMonospace from './PostMonospace'
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
	const _content = content.content && (
		<PostInlineContentElement {...rest}>
			{content.content}
		</PostInlineContentElement>
	)
	if (content.type === 'text') {
		return (
			<PostText style={content.style}>
				{_content}
			</PostText>
		)
	} else if (content.type === 'quote') {
		return (
			<PostInlineQuote
				kind={content.kind}
				autogenerated={content.autogenerated}>
				{_content}
			</PostInlineQuote>
		)
	} else if (content.type === 'spoiler') {
		return (
			<PostInlineSpoiler
				censored={content.censored}
				content={content.content}>
				{_content}
			</PostInlineSpoiler>
		)
	} else if (content.type === 'post-link') {
		if (Array.isArray(content.content) && content.content[0].type === 'quote') {
			return content.content.map((quote, i) => (
				<PostInlineQuote
					key={i}
					url={content.url}
					kind={quote.kind}
					autogenerated={content.quoteAutogenerated}>
					<PostInlineContent {...rest}>
						{quote.content}
					</PostInlineContent>
				</PostInlineQuote>
			))
		}
		return (
			<PostLink
				url={content.url}
				className="post__link--post">
				{_content}
			</PostLink>
		)
	} else if (content.type === 'link') {
		return (
			<PostLink
				url={content.url}
				autogenerated={content.autogenerated}
				attachment={content.attachment}
				service={content.service}
				onAttachmentClick={onAttachmentClick}
				serviceIcons={serviceIcons}>
				{_content}
			</PostLink>
		)
	} else if (content.type === 'monospace') {
		return (
			<PostMonospace inline>
				{_content}
			</PostMonospace>
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