import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import PostQuoteBlock from './PostQuoteBlock'

import './PostInlineQuoteLink.css'

export default function PostInlineQuoteLink({
	url,
	postLink,
	onClick,
	children
}) {
	const _onClick = useCallback((event) => {
		onClick(event, postLink)
	}, [onClick, postLink])
	const className = classNames('post__inline-quote-link')
	if (url[0] === '/') {
		return (
			<Link
				to={url}
				onClick={onClick && _onClick}
				className={className}>
				{children}
			</Link>
		)
	}
	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
			href={url}
			onClick={onClick && _onClick}
			className={className}>
			{children}
		</a>
	)
}

PostInlineQuoteLink.propTypes = {
	url: PropTypes.string,
	onClick: PropTypes.func,
	postLink: PropTypes.object,
	children: PropTypes.node.isRequired
}