import React from 'react'

import Menu from './Menu'

import FeedIconOutline from '../../assets/images/icons/menu/feed-outline.svg'
import FeedIconFill from '../../assets/images/icons/menu/feed-fill.svg'

import SearchIconOutline from '../../assets/images/icons/menu/search-outline.svg'
import SearchIconFill from '../../assets/images/icons/menu/search-fill.svg'

import AddIconOutline from '../../assets/images/icons/menu/add-outline.svg'
import AddIconFill from '../../assets/images/icons/menu/add-fill.svg'

import MessageIconOutline from '../../assets/images/icons/menu/message-outline.svg'
import MessageIconFill from '../../assets/images/icons/menu/message-fill.svg'

import PersonIconOutline from '../../assets/images/icons/menu/person-outline.svg'
import PersonIconFill from '../../assets/images/icons/menu/person-fill.svg'

import './ApplicationMenu.css'

export default class ApplicationMenu extends React.Component {
	getMenuItems() {
		return [{
			title: 'Feed',
			link: '/feed',
			outlineIcon: FeedIconOutline,
			fillIcon: FeedIconFill
		}, {
			title: 'Discover',
			link: '/discover',
			outlineIcon: SearchIconOutline,
			fillIcon: SearchIconFill
		}, {
			title: 'Post',
			link: '/post',
			outlineIcon: AddIconOutline,
			fillIcon: AddIconFill
		}, {
			title: 'Messages',
			link: '/messages',
			outlineIcon: MessageIconOutline,
			fillIcon: MessageIconFill
		}, {
			title: 'Profile',
			link: '/profile',
			outlineIcon: PersonIconOutline,
			fillIcon: PersonIconFill
		}]
	}

	render() {
		return (
			<Menu className="application-menu">
				{this.getMenuItems()}
			</Menu>
		)
	}
}