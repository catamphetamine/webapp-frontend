import React from 'react'
import PropTypes from 'prop-types'
import { ExpandableMenu, List, Divider } from 'react-responsive-ui'

import Button from './Button'

import EllipsisIcon from '../../assets/images/icons/ellipsis.svg'

import './PostMoreActions.css'

export default function PostMoreActions({ title, children }) {
	return (
		<ExpandableMenu
			alignment="right"
			togglerElement={(
				<EllipsisIcon className="post__more-actions__toggler-icon"/>
			)}
			togglerClassName="rrui__button-reset hover-button post__more-actions__toggler"
			togglerButtonProps={{ title }}
			className="post__more-actions__menu">
			{children.map(({ divider, onClick, label }, i) => (
				<List.Item key={i} onClick={onClick}>
					{divider ? <Divider/> : label}
				</List.Item>
			))}
		</ExpandableMenu>
	)
}

export const moreActionsType = PropTypes.arrayOf(PropTypes.shape({
	divider: PropTypes.bool,
	label: PropTypes.string,
	onClick: PropTypes.func
}))

PostMoreActions.propTypes = {
	title: PropTypes.string,
	children: moreActionsType
}