import React from 'react'

import { postShape } from '../PropTypes'

import CommentsIcon from '../../assets/images/icons/menu/message-outline.svg'

import './PostFooter.css'

export default function PostFooter({ post }) {
	if (!post.commentsCount) {
		return null
	}
	return (
		<footer className="post__footer">
			{post.commentsCount &&
				<div className="post__footer__comments-count">
					<CommentsIcon className="post__footer__comments-count-icon"/>
					{post.commentsCount}
				</div>
			}
		</footer>
	)
}

PostFooter.propTypes = {
	post: postShape.isRequired
}