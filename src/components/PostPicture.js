import React from 'react'
import PropTypes from 'prop-types'

import { pictureAttachment } from '../PropTypes'

import Picture from './Picture'

import PostAttachment from './PostAttachment'

import './PostPicture.css'

export default function PostPicture({
	attachment,
	saveBandwidth,
	maxSize,
	spoilerLabel,
	onClick
}) {
	return (
		<PostAttachment
			attachment={attachment}
			saveBandwidth={saveBandwidth}
			maxSize={attachmentThumbnailSize}
			spoilerLabel={spoilerLabel}
			onClick={onClick}
			className="post__picture"/>
	)
}

PostPicture.propTypes = {
	attachment: pictureAttachment.isRequired,
	onClick: PropTypes.func,
	saveBandwidth: PropTypes.bool,
	maxSize: PropTypes.number,
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