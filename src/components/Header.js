import React from 'react'
import MenuButtonIconLinesCloseAnimated from 'react-responsive-ui/modules/MenuButtonIconLinesCloseAnimated'

import Menu, { MenuLink } from './Menu'

import HomeIcon  from '../../assets/images/home.svg'
import UsersIcon from '../../assets/images/users.svg'

import './Header.css'

export default function Header() {
	return (
		<nav className="webpage__header">
			<div className="container">
				<div className="webpage__header__row">
					<Menu>
						<MenuLink to="/" exact>
							<HomeIcon className="menu-item__icon menu-item__icon--home"/>
							Home
						</MenuLink>
						<MenuLink to="/users">
							<UsersIcon className="menu-item__icon menu-item__icon--users"/>
							Users
						</MenuLink>
					</Menu>

					<MenuButtonIconLinesCloseAnimated
						className="menu-button"/>
				</div>
			</div>
		</nav>
	)
}