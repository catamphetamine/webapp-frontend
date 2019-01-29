import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago/tooltip'
import { Link } from 'react-website'

import './PostDate.css'

export default function PostDate({ date, link }) {
	const dateElement = (
		<ReactTimeAgo
			date={date}
			tooltipClassName="post__date-tooltip"
			className="post__date"/>
	)
	if (link) {
		if (link[0] === '/') {
			return (
				<Link to={link} className="post__date-link">
					{dateElement}
				</Link>
			)
		}
		return (
			<a href={link} target="_blank" className="post__date-link">
				{dateElement}
			</a>
		)
	}
	return dateElement
}

PostDate.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	link: PropTypes.string
}