import React from 'react'
import { postList } from '../PropTypes'

import './PostList.css'

export default function PostList({ children: list }) {
	return (
		<ul className="post__list">
			{list.items.map((item, i) => (
				<li key={i} className="post__list-item">
					{item}
				</li>
			))}
		</ul>
	)
}

PostList.propTypes = {
	children: postList.isRequired
}