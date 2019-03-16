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

export const EXAMPLE = {
	type: 'image/jpeg',
	title: 'Google',
	description: 'Google search engine logo',
	date: new Date(2013, 2, 1), // March 1st, 2013.
	sizes: [{
		width: 272,
		height: 92,
		url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
	}]
}