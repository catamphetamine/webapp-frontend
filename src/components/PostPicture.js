import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { getAspectRatio } from './Picture'
import PostAttachmentThumbnail from './PostAttachmentThumbnail'
import PostEmbeddedAttachmentTitle from './PostEmbeddedAttachmentTitle'
import { pictureAttachment } from '../PropTypes'

import './PostPicture.css'

export default function PostPicture({
	attachment,
	maxHeight,
	expand,
	expandToTheFullest,
	align,
	border,
	spoilerLabel,
	link,
	onClick,
	className
}) {
	const picture = attachment.picture
	const aspectRatio = getAspectRatio(picture)
	return (
		<section
			className={classNames(className, 'PostPicture', {
				'PostPicture--alignLeft': align === 'left',
				'PostPicture--alignCenter': align === 'center',
				'PostPicture--alignRight': align === 'right'
			})}>
			<PostAttachmentThumbnail
				attachment={attachment}
				maxHeight={maxHeight}
				expand={expand}
				expandToTheFullest={expandToTheFullest}
				spoilerLabel={spoilerLabel}
				url={link}
				border={border}
				onClick={link ? undefined : onClick}/>
			{picture.title &&
				<PostEmbeddedAttachmentTitle link={link || picture.url}>
					{picture.title}
				</PostEmbeddedAttachmentTitle>
			}
		</section>
	)
}

PostPicture.propTypes = {
	attachment: pictureAttachment.isRequired,
	link: PropTypes.string,
	onClick: PropTypes.func,
	maxHeight: PropTypes.number,
	expand: PropTypes.bool,
	expandToTheFullest: PropTypes.bool,
	align: PropTypes.oneOf(['left', 'center', 'right']),
	border: PropTypes.bool,
	spoilerLabel: PropTypes.string,
	className: PropTypes.string
}

PostPicture.defaultProps = {
	align: 'center'
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