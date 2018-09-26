import React from 'react'
import { audioAttachmentShape } from '../PropTypes'

import './PostAudio.css'

export default function PostAudio({ children: { audio } }) {
	return (
		<div className="post__audio">
			{audio.author} — {audio.title}
		</div>
	)
}

PostAudio.propTypes = {
	children: audioAttachmentShape.isRequired
}