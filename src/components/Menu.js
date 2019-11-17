import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Link } from 'react-pages'
import classNames from 'classnames'

import Button from './Button'

import './Menu.css'

export default function Menu({
	className,
	children
}) {
	const pathname = useSelector(({ found }) => found.resolvedMatch.location.pathname)
	return (
		<ul className={classNames('menu', className)}>
			{children.map((properties, i) => (
				<MenuItem key={i} {...properties} pathname={pathname}/>
			))}
		</ul>
	)
}

const menuItemShape = {
	url: PropTypes.string.isRequired,
	title: PropTypes.string.isRequired,
	size: PropTypes.string,
	onClick: PropTypes.func,
	isSelected: PropTypes.bool,
	icon: PropTypes.func.isRequired,
	iconActive: PropTypes.func
}

Menu.propTypes = {
	pathname: PropTypes.string.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape(menuItemShape)).isRequired
}

class MenuItem extends React.Component {
	render() {
		let {
			isSelected
		} = this.props
		const {
			onClick,
			url,
			title,
			icon,
			iconActive,
			size,
			pathname
		} = this.props
		const OutlineIcon = icon
		const FillIcon = iconActive
		if (url) {
			isSelected = (isSelected === undefined ? true : isSelected) && pathname === url
		}
		// activeClassName={isSelected ? 'menu-item--selected' : undefined}
		const className = classNames(
			'menu-item',
			size && `menu-item--${size}`,
			isSelected && 'menu-item--selected',
			iconActive && 'menu-item--fill',
			!iconActive && 'menu-item--outline'
		)
		const children = (
			<React.Fragment>
				{FillIcon && <FillIcon className="menu-item__icon menu-item__icon--fill"/>}
				<OutlineIcon className="menu-item__icon menu-item__icon--outline"/>
			</React.Fragment>
		)
		return (
			<li>
				{onClick &&
					<Button
						title={title}
						onClick={onClick}
						className={classNames('menu-item__button', className)}>
						{children}
					</Button>
				}
				{url &&
					<Link
						to={url}
						title={title}
						className={className}>
						{children}
					</Link>
				}
			</li>
		)
	}
}

MenuItem.propTypes = menuItemShape