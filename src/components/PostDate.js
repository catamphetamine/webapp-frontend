import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago'
// `/copy-text` was just for copying
// import ReactTimeAgo from 'react-time-ago/copy-text'
// import ReactTimeAgo from 'react-time-ago/tooltip'
import { Link } from 'react-pages'
import classNames from 'classnames'

import './PostDate.css'

export default function PostDate({ date, link, locale, className }) {
	className = classNames('post__date-link', 'post__summary-button', 'hover-button--link', className)
	// tooltipClassName="post__date-tooltip"
	const dateElement = (
		<ReactTimeAgo
			date={date}
			locale={locale}
			className="post__date"/>
	)
	if (link) {
		if (link[0] === '/') {
			return (
				<Link to={link} className={className}>
					{dateElement}
				</Link>
			)
		}
		return (
			<a href={link} target="_blank" className={className}>
				{dateElement}
			</a>
		)
	}
	return dateElement
}

PostDate.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	link: PropTypes.string,
	className: PropTypes.string
}