import React from 'react'

import { postShape } from '../PropTypes'

import CommentsIcon from '../../assets/images/icons/menu/message-outline.svg'
import AttachmentsIcon from '../../assets/images/icons/picture.svg'

import './PostFooter.css'

export default function PostFooter({ post }) {
	if (!post.commentsCount) {
		return (
			<footer className="post__footer post__footer--empty"/>
		)
	}
	return (
		<footer className="post__footer">
			{post.commentsCount > 0 &&
				<div className="post__footer__comments-count">
					<CommentsIcon className="post__footer__icon post__footer__icon--comments-count"/>
					{post.commentsCount}
				</div>
			}
			{post.attachmentsCount > 0 &&
				<div className="post__footer__attachments-count">
					<AttachmentsIcon className="post__footer__icon post__footer__icon--attachments-count"/>
					{post.attachmentsCount}
				</div>
			}
		</footer>
	)
}

PostFooter.propTypes = {
	post: postShape.isRequired
}