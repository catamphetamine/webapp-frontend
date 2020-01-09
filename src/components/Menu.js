import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import Button from './Button'
import PopIconButton from './PopIconButton'

import './Menu.css'

export default function Menu({
	className,
	children
}) {
	const pathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	return (
		<div className={classNames('menu', className)}>
			{children.map((properties, i) => (
				<MenuItem key={i} {...properties} pathname={pathname}/>
			))}
		</div>
	)
}

const menuItemShape = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	size: PropTypes.string,
	onClick: PropTypes.func,
	isSelected: PropTypes.bool,
	icon: PropTypes.func.isRequired,
	iconActive: PropTypes.func,
	pop: PropTypes.bool
}

Menu.propTypes = {
	pathname: PropTypes.string.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape(menuItemShape)).isRequired
}

function MenuItem({
	onClick,
	url,
	title,
	icon,
	iconActive,
	pop,
	size,
	pathname,
	isSelected,
	className
}) {
	const OutlineIcon = icon
	const FillIcon = iconActive || icon
	if (url) {
		// `url` may contain query parameters.
		isSelected = (isSelected === undefined ? true : isSelected) && pathname === getPathname(url)
	}
	// activeClassName={isSelected ? 'menu-item--selected' : undefined}
	className = classNames(
		className,
		'menu-item',
		size && `menu-item--${size}`,
		isSelected && 'menu-item--selected',
		iconActive && 'menu-item--fill',
		!iconActive && 'menu-item--outline'
	)
	if (pop) {
		return (
			<PopIconButton
				value={isSelected}
				onIcon={iconActive}
				offIcon={icon}
				title={title}
				buttonComponent={Button}
				onClick={onClick}
				className={className}
				iconClassName="menu-item__icon menu-item__icon--pop"/>
		)
	}
	const children = (
		<React.Fragment>
			{FillIcon && <FillIcon className="menu-item__icon menu-item__icon--fill"/>}
			<OutlineIcon className="menu-item__icon menu-item__icon--outline"/>
		</React.Fragment>
	)
	if (onClick) {
		return (
			<Button
				title={title}
				onClick={onClick}
				className={className}>
				{children}
			</Button>
		)
	}
	if (url) {
		return (
			<Link
				to={url}
				title={title}
				className={className}>
				{children}
			</Link>
		)
	}
	return (
		<div
			aria-label={title}
			className={className}>
			{children}
		</div>
	)
}

MenuItem.propTypes = menuItemShape

function getPathname(url) {
	let urlPathname = url
	const queryIndex = urlPathname.indexOf('?')
	if (queryIndex >= 0) {
		urlPathname = urlPathname.slice(0, queryIndex)
	}
	const hashIndex = urlPathname.indexOf('#')
	if (hashIndex >= 0) {
		urlPathname = urlPathname.slice(0, hashIndex)
	}
	return urlPathname
}