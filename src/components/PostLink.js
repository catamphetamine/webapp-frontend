import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PostLink.css'

export default function PostLink({ url, className, children }) {
	return (
		<a
			target="_blank"
			href={url}
			className={classNames('post__link', className)}>
			{children}
		</a>
	)
}

PostLink.propTypes = {
	url: PropTypes.string.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}