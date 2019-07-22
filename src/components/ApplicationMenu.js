import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

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

export default function ApplicationMenu({ className }) {
	const menuItems = [{
		title: 'Feed',
		url: '/feed',
		icon: FeedIconOutline,
		iconActive: FeedIconFill
	}, {
		title: 'Discover',
		url: '/discover',
		icon: SearchIconOutline,
		iconActive: SearchIconFill
	}, {
		title: 'Post',
		url: '/post',
		icon: AddIconOutline,
		iconActive: AddIconFill
	}, {
		title: 'Messages',
		url: '/messages',
		icon: MessageIconOutline,
		iconActive: MessageIconFill
	}, {
		title: 'Profile',
		url: '/profile',
		icon: PersonIconOutline,
		iconActive: PersonIconFill
	}]
	return (
		<Menu className={classNames(className, 'application-menu')}>
			{menuItems}
		</Menu>
	)
}

ApplicationMenu.propTypes = {
	className: PropTypes.string
}