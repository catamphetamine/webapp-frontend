import React from 'react'
import PropTypes from 'prop-types'
import { postMonospace } from '../PropTypes'

import './PostMonospace.css'

export default function PostMonospace({ inline, children }) {
	if (inline) {
		return (
			<code className="post__monospace post__monospace--inline">
				{children}
			</code>
		)
	}
	return (
		<pre className="post__monospace post__block">
			{children}
		</pre>
	)
}

PostMonospace.propTypes = {
	inline: PropTypes.bool,
	children: postMonospace.isRequired
}