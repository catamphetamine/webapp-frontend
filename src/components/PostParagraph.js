import React from 'react'
import { postParagraphShape } from '../PropTypes'

import './PostParagraph.css'

export default function PostParagraph({ children: text }) {
	return (
		<p>
			{text}
		</p>
	)
}

PostParagraph.propTypes = {
	children: postParagraphShape.isRequired
}