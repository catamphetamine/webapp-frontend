import React, { useMemo } from 'react'
import PropTypes from 'prop-types'

import PostAttachmentThumbnail from './PostAttachmentThumbnail'
import PictureStack from './PictureStack'
// import PictureBadge from './PictureBadge'
import PostQuoteBlock from './PostQuoteBlock'

import { postPostLinkShape } from '../PropTypes'

import './PostAttachmentThumbnailQuote.css'

// When `post-link` quote text was generated from an untitled attachment
// then such `post-link` is supposed to have the corresponding `attachment` set
// so that it could be displayed instead of a generic "Picture"/"Video" placeholder.
export default function PostAttachmentThumbnailQuote({
	postLink,
	markFirstQuote,
	useSmallestThumbnailsForAttachments,
	attachmentThumbnailSize,
	spoilerLabel
}) {
	const postAttachmentThumbnailComponentProps = useMemo(() => ({
		count: postLink.attachment ? postLink.attachmentsCount : undefined
	}), [postLink])
	return (
		<PostQuoteBlock
			inline
			generated
			first={markFirstQuote}
			className="PostQuoteBlock--attachment">
			<PictureStack
				inline
				count={postLink.attachmentsCount}
				className="PostQuoteBlock-attachment">
				<PostAttachmentThumbnail
					attachment={postLink.attachment}
					component={PostAttachmentThumbnailComponent}
					componentProps={postAttachmentThumbnailComponentProps}
					useSmallestThumbnail={useSmallestThumbnailsForAttachments}
					maxSize={attachmentThumbnailSize}
					spoilerLabel={spoilerLabel}/>
			</PictureStack>
		</PostQuoteBlock>
	)
}

PostAttachmentThumbnail.propTypes = {
	postLink: postPostLinkShape.isRequired,
	markFirstQuote: PropTypes.bool,
	useSmallestThumbnailsForAttachments: PropTypes.bool,
	attachmentThumbnailSize: PropTypes.number,
	spoilerLabel: PropTypes.string
}

/* Wraps the picture (`<img/>`) in a `<span/>` instead of a `<div/>`. */
function PostAttachmentThumbnailComponent({
	// count,
	style,
	className,
	children,
	// ...rest
}, ref) {
	return (
		<span
			ref={ref}
			style={style}
			className={className}>
			{children}
		</span>
	)
	// return (
	// 	<span
	// 		ref={ref}
	// 		style={style}
	// 		className={classNames(className, 'PostQuoteBlock-attachment')}>
	// 		{children}
	// 		{count > 1 &&
	// 			<PictureBadge
	// 				placement="top-right"
	// 				className="PostQuoteBlock-attachmentMoreCount">
	// 				+{count - 1}
	// 			</PictureBadge>
	// 		}
	// 	</span>
	// )
}

PostAttachmentThumbnailComponent = React.forwardRef(PostAttachmentThumbnailComponent)

PostAttachmentThumbnailComponent.propTypes = {
	// count: PropTypes.number.isRequired,
	style: PropTypes.object,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}