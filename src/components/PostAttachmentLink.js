import React from 'react'
import { linkAttachmentShape } from '../PropTypes'

import './PostAttachmentLink.css'

export default function PostAttachmentLink({ children: { link } }) {
	return (
		<a
			href={link.url}
			target="_blank"
			className="post__link-attachment">
			{link.picture &&
				<Picture
					sizes={link.picture.sizes}
					className="post__link-picture"/>
			}
			<div className="post__link-title-and-description">
				<h2 className="post__link-title">
					{link.title}
				</h2>
				<p className="post__link-description">
					{link.description}
				</p>
			</div>
		</a>
	)
}

PostAttachmentLink.propTypes = {
	children: linkAttachmentShape.isRequired
}