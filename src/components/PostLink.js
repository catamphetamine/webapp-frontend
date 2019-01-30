import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

import './PostLink.css'

export default function PostLink({ url, className, children }) {
	if (url[0] === '/') {
		return (
			<Link
				to={url}
				className={classNames('post__link', className)}>
				{children}
			</Link>
		)
	}
	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
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