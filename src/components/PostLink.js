import React from 'react'
import { postLinkShape } from '../PropTypes'

import './PostLink.css'

export default function PostLink({ children: { link } }) {
	return (
		<a
			target="_blank"
			href={link.url}>
			{link.text}
		</a>
	)
}

PostLink.propTypes = {
	children: postLinkShape.isRequired
}