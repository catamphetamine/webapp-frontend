import React from 'react'
import PropTypes from 'prop-types'
import { postParagraph } from '../PropTypes'

import './PostParagraph.css'

export default function PostParagraph({ children }) {
	return (
		<p className="post__paragraph">
			{children}
		</p>
	)
}

PostParagraph.propTypes = {
	children: PropTypes.oneOfType([
		postParagraph,
		PropTypes.node
	]).isRequired
}