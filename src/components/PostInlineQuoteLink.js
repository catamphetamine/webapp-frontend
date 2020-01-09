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
	disabled,
	block,
	children
}) {
	const _onClick = useCallback((event) => {
		onClick(event, postLink)
	}, [onClick, postLink])
	const className = classNames('post__inline-quote-link', {
		'post__inline-quote-link--disabled': disabled,
		'post__inline-quote-link--block': block
	})
	if (disabled) {
		return (
			<span className={className}>
				{children}
			</span>
		)
	}
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
	disabled: PropTypes.bool,
	postLink: PropTypes.object,
	// `block: true` emulates block appearance while staying inline.
	block: PropTypes.bool,
	children: PropTypes.node.isRequired
}