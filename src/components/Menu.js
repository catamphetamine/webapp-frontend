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

Menu.propTypes = {
	pathname: PropTypes.string.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape({
		url: PropTypes.string.isRequired,
		action: PropTypes.func,
		isActive: PropTypes.bool,
		title: PropTypes.string.isRequired,
		outlineIcon: PropTypes.func.isRequired,
		fillIcon: PropTypes.func.isRequired
	}))
}

class MenuItem extends React.Component {
	render() {
		let {
			isActive
		} = this.props
		const {
			action,
			url,
			title,
			outlineIcon: OutlineIcon,
			fillIcon: FillIcon,
			pathname
		} = this.props
		if (url) {
			isActive = (isActive === undefined ? true : isActive) && pathname === url
		}
		// activeClassName={isActive ? 'menu-item--selected' : undefined}
		return (
			<li className="menu-item-container">
				{action &&
					<button
						type="button"
						title={title}
						onClick={action}
						className={classNames('rrui__button-reset', 'menu-item', isActive && 'menu-item--selected')}>
						<FillIcon className="menu-item__icon menu-item__icon--fill"/>
						<OutlineIcon className="menu-item__icon menu-item__icon--outline"/>
					</button>
				}
				{url &&
					<Link
						to={url}
						title={title}
						className={classNames('menu-item', {
							'menu-item--selected': isActive
						})}>
						<FillIcon className="menu-item__icon menu-item__icon--fill"/>
						<OutlineIcon className="menu-item__icon menu-item__icon--outline"/>
					</Link>
				}
			</li>
		)
	}
}

MenuItem.propTypes = {
	url: PropTypes.string.isRequired,
	action: PropTypes.func,
	isActive: PropTypes.bool,
	title: PropTypes.string.isRequired,
	outlineIcon: PropTypes.func.isRequired,
	fillIcon: PropTypes.func.isRequired,
	pathname: PropTypes.string.isRequired
}