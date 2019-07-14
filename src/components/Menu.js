import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import './Menu.css'

@connect(({ found }) => ({
  pathname: found.resolvedMatch.location.pathname
}))
export default class Menu extends React.Component {
	render() {
		const {
			pathname,
			className,
			children
		} = this.props
		return (
			<ul className={classNames('menu', className)}>
				{children.map((properties, i) => (
					<MenuItem key={i} {...properties} pathname={pathname}/>
				))}
			</ul>
		)
	}
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
					<button
						type="button"
						title={title}
						onClick={onClick}
						className={classNames('rrui__button-reset', className)}>
						{children}
					</button>
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