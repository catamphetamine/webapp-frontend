import React from 'react'
import PropTypes from 'prop-types'
import { postText } from '../PropTypes'

import './PostText.css'

export default function PostText({ style, children }) {
	const tag = getTagForStyle(style)
	if (tag) {
		return React.createElement(tag, null, children)
	}
	const classNameModifier = getClassNameModifierForStyle(style)
	if (classNameModifier) {
		return React.createElement('span', {
			className: `post__text--${classNameModifier}`
		}, children)
	}
	return children
}

PostText.propTypes = {
	style: PropTypes.oneOf([
		'bold',
		'italic',
		'underline',
		'strikethrough',
		'subscript',
		'superscript'
	]),
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

function getClassNameModifierForStyle(style) {
	switch (style) {
		case 'underline':
			return 'underline'
	}
}