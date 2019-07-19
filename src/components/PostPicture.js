import React from 'react'
import PropTypes from 'prop-types'

import { pictureAttachment } from '../PropTypes'

import { getAspectRatio } from './Picture'

import PostAttachment from './PostAttachment'

import './PostPicture.css'

export default function PostPicture({
	attachment,
	maxHeight,
	expand,
	spoilerLabel,
	onClick
}) {
	const picture = attachment.picture
	const aspectRatio = getAspectRatio(picture)
	return (
		<PostAttachment
			attachment={attachment}
			maxHeight={maxHeight}
			expand={expand}
			spoilerLabel={spoilerLabel}
			onClick={onClick}
			className="post__picture"/>
	)
}

PostPicture.propTypes = {
	attachment: pictureAttachment.isRequired,
	onClick: PropTypes.func,
	maxHeight: PropTypes.number,
	expand: PropTypes.bool,
	spoilerLabel: PropTypes.string
}

export const EXAMPLE = {
	type: 'image/png',
	title: 'Google',
	description: 'Google search engine logo',
	date: new Date(2013, 2, 1), // March 1st, 2013.
	size: 45 * 1024, // in bytes.
	width: 272,
	height: 92,
	url: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
}