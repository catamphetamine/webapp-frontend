import React from 'react'
import { postHeadingShape } from '../PropTypes'

import './PostHeading.css'

export default function PostHeading({ children: { heading } }) {
	return (
		<h2 className="post__heading">
			{heading.text}
		</h2>
	)
}

PostHeading.propTypes = {
	children: postHeadingShape.isRequired
}