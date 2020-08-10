import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import Close from '../../assets/images/icons/close-thicker.svg'

import PostBlock from './PostBlock'
import { Button } from './Button'

import './Announcement.css'

export default function Announcement({
	onClose,
	closeLabel,
	onClick,
	buttonLabel,
	announcement,
	children
}) {
	return (
		<div className={classNames('announcement', {
			'announcement--button': onClick
		})}>
			<div className="announcement__content">
				<PostBlock className="announcement__content">
					{announcement ? announcement.content : children}
				</PostBlock>
			</div>

			{onClose &&
				<Button
					onClick={onClose}
					title={closeLabel}
					className="announcement__close">
					<Close className="announcement__close-icon"/>
				</Button>
			}

			{onClick &&
				<Button
					onClick={onClick}
					className="rrui__button--background">
					{buttonLabel}
				</Button>
			}
		</div>
	)
}

Announcement.propTypes = {
	onClose: PropTypes.func,
	closeLabel: PropTypes.string,
	onClick: PropTypes.func,
	buttonLabel: PropTypes.string,
	announcement: announcementPropType,
	children: contentPropType
}

const contentPropType = PropTypes.oneOfType([
	PropTypes.arrayOf(PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.object
	])),
	PropTypes.string
])

export const announcementPropType = PropTypes.shape({
	date: PropTypes.string.isRequired,
	content: contentPropType.isRequired
})