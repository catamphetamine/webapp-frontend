import React from 'react'
import PropTypes from 'prop-types'
import { ExpandableMenu, List, Divider } from 'react-responsive-ui'
import classNames from 'classnames'

import Button from './Button'

import EllipsisIcon from '../../assets/images/icons/ellipsis.svg'

import './PostMoreActions.css'

export default function PostMoreActions({ alignment, title, children }) {
	return (
		<ExpandableMenu
			alignment={alignment}
      aria-label={title}
      buttonTitle={title}
			toggleElement={TOGGLE_ELEMENT}
			buttonClassName="hover-button post__more-actions__toggler"
			className={classNames('post__more-actions__menu', {
				'post__more-actions__menu--right': alignment === 'right'
			})}>
			{children.map(({ divider, onClick, label }, i) => (
				<List.Item key={i} onClick={onClick}>
					{divider ? <Divider/> : label}
				</List.Item>
			))}
		</ExpandableMenu>
	)
}

export const moreActionsType = PropTypes.arrayOf(PropTypes.oneOfType([
	PropTypes.shape({
		label: PropTypes.string.isRequired,
		onClick: PropTypes.func.isRequired
	}),
	PropTypes.shape({
		divider: PropTypes.bool.isRequired
	})
]))

PostMoreActions.propTypes = {
	title: PropTypes.string,
	alignment: PropTypes.oneOf(['right']),
	children: moreActionsType
}

const TOGGLE_ELEMENT = <EllipsisIcon className="post__more-actions__toggler-icon"/>