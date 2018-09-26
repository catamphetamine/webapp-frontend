import React from 'react'
import { pictureAttachmentShape } from '../PropTypes'

import Picture from './Picture'

import './PostPicture.css'

export default function PostPicture({ children: { picture } }) {
	return (
		<Picture
			sizes={picture.sizes}
			className="post__picture"/>
	)
}

PostPicture.propTypes = {
	children: pictureAttachmentShape.isRequired
}