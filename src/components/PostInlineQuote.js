import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

import { postInlineQuote } from '../PropTypes'

import './PostInlineQuote.css'

export default function PostInlineQuote({ url, autogenerated, children }) {
	if (url) {
		if (url[0] === '/') {
			return (
				<Link
					to={url}
					className="post__inline-quote post__inline-quote--link">
					<Quote autogenerated={autogenerated}>
						{children}
					</Quote>
				</Link>
			)
		}
		return (
			<a
				target={url[0] === '#' ? undefined : '_blank'}
				href={url}
				className="post__inline-quote post__inline-quote--link">
				<Quote autogenerated={autogenerated}>
					{children}
				</Quote>
			</a>
		)
	}
	return (
		<span className="post__inline-quote">
			<Quote autogenerated={autogenerated}>
				{children}
			</Quote>
		</span>
	)
}

PostInlineQuote.propTypes = {
	url: PropTypes.string,
	autogenerated: PropTypes.bool,
	content: PropTypes.node.isRequired
}

function Quote({ autogenerated, children }) {
	return (
		<span className="post__inline-quote-text-wrapper">
			<span className="post__inline-quote-marker"/>
			{/* Set the content to "> " for copy-pasting quotes. */}
			{/* It won't be visible due to `font-size: 0`. */}
			<span className="post__inline-quote-prefix">
				{'> '}
			</span>
			<q
				className={classNames('post__inline-quote-text', {
					'post__inline-quote-text--autogenerated': autogenerated
				})}>
				{children}
			</q>
		</span>
	)
}

Quote.propTypes = {
	autogenerated: PropTypes.bool,
	content: PropTypes.node.isRequired
}