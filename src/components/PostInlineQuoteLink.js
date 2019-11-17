import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import PostQuoteBlock from './PostQuoteBlock'

import './PostInlineQuoteLink.css'

export default function PostInlineQuoteLink({
	url,
	children
}) {
	const className = classNames('post__inline-quote-link')
	if (url[0] === '/') {
		return (
			<Link
				to={url}
				className={className}>
				{children}
			</Link>
		)
	}
	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
			href={url}
			className={className}>
			{children}
		</a>
	)
}

PostInlineQuoteLink.propTypes = {
	url: PropTypes.string,
	children: PropTypes.node.isRequired
}