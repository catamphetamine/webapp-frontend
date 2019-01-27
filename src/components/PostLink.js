import React from 'react'
import PropTypes from 'prop-types'

import './PostLink.css'

export default function PostLink({ url, children }) {
	return (
		<a
			target="_blank"
			href={url}
			className="post__post-link">
			{children}
		</a>
	)
}

PostLink.propTypes = {
	url: PropTypes.string.isRequired,
	children: PropTypes.node.isRequired
}