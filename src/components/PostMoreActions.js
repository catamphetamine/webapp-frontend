import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ExpandableMenu, List, Divider } from 'react-responsive-ui'

import Button from './Button'

import EllipsisIcon from '../../assets/images/icons/ellipsis.svg'

import './PostMoreActions.css'

export default function PostMoreActions({ title, children }) {
	const buttonProps = useMemo(() => ({ title }), [title])
	return (
		<ExpandableMenu
			alignment="right"
			button={MenuButton}
			buttonProps={buttonProps}
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

const MenuButton = React.forwardRef((props, ref) => (
	<button
		{...props}
		ref={ref}
		type="button"
		className="rrui__button-reset hover-button post__more-actions__toggler">
		<EllipsisIcon className="post__more-actions__toggler-icon"/>
	</button>
))