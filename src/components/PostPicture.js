import React from 'react'
import PropTypes from 'prop-types'

import { getAspectRatio } from './Picture'
import PostAttachmentThumbnail, { ATTACHMENT_THUMBNAIL_SIZE } from './PostAttachmentThumbnail'
import PostEmbeddedAttachmentTitle from './PostEmbeddedAttachmentTitle'
import { pictureAttachment } from '../PropTypes'

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
		<section className="PostPicture">
			<PostAttachmentThumbnail
				attachment={attachment}
				maxHeight={maxHeight}
				expand={expand}
				spoilerLabel={spoilerLabel}
				onClick={onClick}/>
			{picture.title &&
				<PostEmbeddedAttachmentTitle>
					{picture.title}
				</PostEmbeddedAttachmentTitle>
			}
		</section>
	)
}

PostPicture.propTypes = {
	attachment: pictureAttachment.isRequired,
	onClick: PropTypes.func,
	maxHeight: PropTypes.number.isRequired,
	expand: PropTypes.bool,
	spoilerLabel: PropTypes.string
}

PostPicture.defaultProps = {
	maxHeight: ATTACHMENT_THUMBNAIL_SIZE
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