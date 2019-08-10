import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

// import { postInlineQuote } from '../PropTypes'
import PostQuoteBlock from './PostQuoteBlock'

import './PostInlineQuoteLink.css'

export default function PostInlineQuoteLink({
	url,
	autogenerated,
	children
}) {
	const className = classNames('post__inline-quote-link', 'post__quote-blocks')
	const quotes = children.map((quote, i) => (
		<PostQuoteBlock
			key={i}
			inline={false}
			autogenerated={autogenerated}
			kind={quote.kind}>
			{quote.content}
		</PostQuoteBlock>
	))
	if (url[0] === '/') {
		return (
			<Link
				to={url}
				className={className}>
				{quotes}
			</Link>
		)
	}
	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
			href={url}
			className={className}>
			{quotes}
		</a>
	)
}

PostInlineQuoteLink.propTypes = {
	url: PropTypes.string,
	autogenerated: PropTypes.bool,
	// `children`'s elements have `content` already pre-rendered,
	// so not using `postInlineQuote` property type here.
	children: PropTypes.arrayOf(PropTypes.object).isRequired
}