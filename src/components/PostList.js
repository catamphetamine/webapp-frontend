import React from 'react'
import PropTypes from 'prop-types'
import { postInlineContent } from '../PropTypes'

import PostInlineContent from './PostInlineContent'

import './PostList.css'

export default function PostList({ children }) {
	return (
		<ul className="post__list">
			{children.map((item, i) => (
				<li key={i} className="post__list-item">
					<PostInlineContent>
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