import React from 'react'
import { postListShape } from '../PropTypes'

import './PostList.css'

export default function PostList({ children: list }) {
	return (
		<ul className="post__list">
			{list.items.map((item, i) => (
				<li key={i}>
					{item}
				</li>
			))}
		</ul>
	)
}

PostList.propTypes = {
	children: postListShape.isRequired
}