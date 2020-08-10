import React from 'react'
import { post } from '../PropTypes'

import PostInlineContent from './PostInlineContent'

import './PostTitle.css'

export default function PostTitle({ post }) {
	if (!post.title) {
		return null
	}
	return (
		<h1 className="PostTitle">
			{post.titleCensored &&
				<PostInlineContent>
					{post.titleCensored}
				</PostInlineContent>
			}
			{!post.titleCensored && post.title}
		</h1>
	)
}

PostTitle.propTypes = {
	post: post.isRequired
}