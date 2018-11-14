import React from 'react'
import PropTypes from 'prop-types'

import { pictureAttachmentShape } from '../PropTypes'

import Picture from './Picture'

import './PostPicture.css'

export default function PostPicture({ onClick, children: { picture } }) {
	return (
		<Picture
			picture={picture}
			onClick={onClick}
			className="post__picture"/>
	)
}

PostPicture.propTypes = {
	onClick: PropTypes.func,
	children: pictureAttachmentShape.isRequired
}