import React from 'react'
import { postInlineContent } from '../PropTypes'

import './PostSubheading.css'

export default function PostSubheading({ children: content }) {
	return (
		<h2 className="post__subheading">
			{content}
		</h2>
	)
}

PostSubheading.propTypes = {
	children: postInlineContent.isRequired
}