import React from 'react'
import PropTypes from 'prop-types'
import { postInlineContent } from '../PropTypes'

import PostInlineContent from './PostInlineContent'

import './PostList.css'

export default function PostList({
	children,
	...rest
}) {
	return (
		<ul className="PostList">
			{children.map((item, i) => (
				<li key={i} className="PostList-item">
					<PostInlineContent {...rest}>
						{item}
					</PostInlineContent>
				</li>
			))}
		</ul>
	)
}

PostList.propTypes = {
	children: PropTypes.arrayOf(postInlineContent).isRequired
}