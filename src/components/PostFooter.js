import React from 'react'

import { postShape } from '../PropTypes'

import CommentsIcon from '../../assets/images/icons/menu/message-outline.svg'
import AttachmentsIcon from '../../assets/images/icons/picture.svg'
import ReplyIcon from '../../assets/images/icons/reply.svg'

import './PostFooter.css'

export default function PostFooter({ post, replies }) {
	return (
		<footer className="post__footer">
			{post.commentsCount > 0 &&
				<div className="post__footer__count">
					<CommentsIcon className="post__footer__icon post__footer__icon--comments-count"/>
					{post.commentsCount}
				</div>
			}
			{post.attachmentsCount > 0 &&
				<div className="post__footer__count">
					<AttachmentsIcon className="post__footer__icon post__footer__icon--attachments-count"/>
					{post.attachmentsCount}
				</div>
			}
			{replies && replies.length > 0 &&
				<div className="post__footer__count">
					<ReplyIcon className="post__footer__icon post__footer__icon--replies-count"/>
					{replies.length}
				</div>
			}
		</footer>
	)
}

PostFooter.propTypes = {
	post: postShape.isRequired
}

export function hasFooter(post) {
	return post.commentsCount > 0 ||
		post.attachmentsCount > 0 ||
		(post.replies && post.replies.length > 0)
}