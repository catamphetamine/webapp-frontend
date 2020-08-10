import React from 'react'
import PropTypes from 'prop-types'
import ReactTimeAgo from 'react-time-ago'
// `/copy-text` was just for copying
// import ReactTimeAgo from 'react-time-ago/copy-text'
// import ReactTimeAgo from 'react-time-ago/tooltip'
import { Link } from 'react-pages'
import classNames from 'classnames'

import PostSelfLink from './PostSelfLink'

import './PostDate.css'
import './Padding.css'

export default function PostDate({
	date,
	url,
	urlBasePath,
	onClick,
	locale,
	className
}) {
	// tooltipClassName="PostDate-tooltip"
	const dateElement = (
		<ReactTimeAgo
			date={date}
			locale={locale}
			className="PostDate-date"/>
	)
	if (url) {
		return (
			<PostSelfLink
				url={url}
				baseUrl={urlBasePath}
				onClick={onClick}
				className={classNames('Padding', className)}>
				{dateElement}
			</PostSelfLink>
		)
	}
	return (
		<span className={classNames('PostDate', className)}>
			{dateElement}
		</span>
	)
}

PostDate.propTypes = {
	date: PropTypes.instanceOf(Date).isRequired,
	url: PropTypes.string,
	urlBasePath: PropTypes.string,
	locale: PropTypes.string,
	onClick: PropTypes.func,
	className: PropTypes.string
}