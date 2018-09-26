import React from 'react'
import { postTextShape } from '../PropTypes'

import './PostText.css'

export default function PostText({ children: text }) {
	return (
		<span>
			{text}
		</span>
	)
}

PostText.propTypes = {
	children: postTextShape.isRequired
}