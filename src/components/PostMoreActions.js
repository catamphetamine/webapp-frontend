import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import { ExpandableMenu, List, Divider } from 'react-responsive-ui'
import classNames from 'classnames'

import HoverButton from './HoverButton'

import EllipsisIcon from '../../assets/images/icons/ellipsis-light.svg'

import './PostMoreActions.css'

export default function PostMoreActions({
	upward,
	alignment,
	title,
	toggleComponent: ToggleComponent,
	className,
	buttonClassName,
	children
}) {
	const toggleElement = useMemo(() => (
		<ToggleComponent/>
	), [ToggleComponent])
	return (
		<ExpandableMenu
			upward={upward}
			alignment={alignment}
      aria-label={title}
      buttonTitle={title}
			toggleElement={toggleElement}
			button={HoverButton}
			buttonClassName={classNames(buttonClassName, 'PostMoreActions-toggler', {
				'PostMoreActions-toggler--right': alignment === 'right'
			})}
			className={classNames(className, 'PostMoreActions-menu', {
				'PostMoreActions-menu--right': alignment === 'right'
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
	upward: PropTypes.bool,
	alignment: PropTypes.oneOf(['right']),
	toggleComponent: PropTypes.elementType.isRequired,
	className: PropTypes.string,
	buttonClassName: PropTypes.string,
	children: moreActionsType
}

PostMoreActions.defaultProps = {
	toggleComponent: Toggle
}

function Toggle() {
	return <EllipsisIcon className="PostMoreActions-togglerIcon"/>
}