import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { post } from '../PropTypes'

import PostInlineContent from './PostInlineContent'

import './PostTitle.css'

export default function PostTitle({
	post,
	compact
}) {
	if (!post.title) {
		return null
	}
	return (
		<h1 className={classNames('PostTitle', {
			'PostTitle--compact': compact
		})}>
			{post.titleCensoredContent &&
				<PostInlineContent>
					{post.titleCensoredContent}
				</PostInlineContent>
			}
			{!post.titleCensoredContent && post.title}
		</h1>
	)
}

PostTitle.propTypes = {
	post: post.isRequired,
	compact: PropTypes.bool
}