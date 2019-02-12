import React from 'react'
import { postHeading } from '../PropTypes'

import './PostSubheading.css'

export default function PostSubheading({ children: heading }) {
	return (
		<h2 className="post__subheading">
			{heading.text}
		</h2>
	)
}

PostSubheading.propTypes = {
	children: postHeading.isRequired
}