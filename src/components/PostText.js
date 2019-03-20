import React from 'react'
import PropTypes from 'prop-types'
import { postText } from '../PropTypes'

import './PostText.css'

export default function PostText({ style, children }) {
	const Tag = getTagForStyle(style)
	if (Tag) {
		return (
			<Tag>
				{children}
			</Tag>
		)
	}
	return (
		<span className={`post__text--${style}`}>
			{children}
		</span>
	)
	return children
}

PostText.propTypes = {
	style: PropTypes.oneOfType([
		PropTypes.oneOf([
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'subscript',
			'superscript'
		]),
		PropTypes.string
	]).isRequired,
	children: PropTypes.oneOfType([
		postText,
		PropTypes.node
	]).isRequired
}

function getTagForStyle(style) {
	switch (style) {
		case 'bold':
			return 'strong'
		case 'italic':
			return 'em'
		case 'strikethrough':
			return 'del'
		case 'superscript':
			return 'sup'
		case 'subscript':
			return 'sub'
	}
}