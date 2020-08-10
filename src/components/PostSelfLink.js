import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import HoverButton from './HoverButton'

import { replacePageUrl } from '../utility/history'

import './PostSelfLink.css'
import './Padding.css'

export default function PostSelfLink({
	url,
	baseUrl,
	onClick,
	className,
	children
}) {
	className = classNames('PostSelfLink', 'Padding', className)
	const _onClick = useCallback((event) => {
		if (onClick) {
			onClick(event)
		}
		if (!event.defaultPrevented) {
			event.preventDefault()
			replacePageUrl((baseUrl || '') + url)
		}
	}, [url, baseUrl, onClick])
	let props
	if (url[0] === '/') {
		props = {
			component: Link,
			to: url,
			onClick: _onClick
		}
	} else {
		props = {
			component: 'a',
			href: url,
			target: '_blank'
		}
	}
	return (
		<HoverButton
			{...props}
			link
			className={className}>
			{children}
		</HoverButton>
	)
}

PostSelfLink.propTypes = {
	url: PropTypes.string,
	baseUrl: PropTypes.string,
	onClick: PropTypes.func,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}