import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import './Menu.css'

@connect(({ found }) => ({
  location: found.resolvedMatch.location
}))
export default class Menu extends React.Component {
	render() {
		const {
			location,
			className,
			children
		} = this.props

		return (
			<ul className={classNames('menu', className)}>
				{children.map(({ isActive, action, link, title, outlineIcon, fillIcon }, i) => {
					if (link) {
						isActive = isActive && location.pathname === link
					}
					const icon = React.createElement(
						isActive ? fillIcon : outlineIcon,
						{ className: 'menu-item__icon' }
					)
					return (
						<li
							key={i}
							className="menu-list-item">
							{action &&
								<button
									type="button"
									title={title}
									onClick={action}
									className={classNames('rrui__button-reset', 'menu-item', isActive && 'menu-item--selected')}>
									{icon}
								</button>
							}
							{link &&
								<Link
									to={link}
									title={title}
									activeClassName="menu-item--selected"
									className="menu-item">
									{icon}
								</Link>
							}
						</li>
					)
				})}
			</ul>
		)
	}
}

Menu.propTypes = {
	location: PropTypes.object.isRequired,
	children: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string.isRequired,
		action: PropTypes.func,
		isActive: PropTypes.bool,
		title: PropTypes.string.isRequired,
		outlineIcon: PropTypes.func.isRequired,
		fillIcon: PropTypes.func.isRequired
	}))
}