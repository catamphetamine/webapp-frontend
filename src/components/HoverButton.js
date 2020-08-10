import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Button from './Button'

import './HoverButton.css'

function HoverButton({
	component: Component,
	pushed,
	link,
	className,
	children,
	...rest
}, ref) {
	const isNativeButton = Component === 'button'
	return (
		<Component
			{...rest}
			ref={ref}
			className={classNames(className, 'HoverButton', {
				'HoverButton--link': link,
				'HoverButton--pushed': pushed
			})}>
			{children}
		</Component>
	)
}

HoverButton = React.forwardRef(HoverButton)

export default HoverButton

HoverButton.propTypes = {
	component: PropTypes.elementType.isRequired,
	pushed: PropTypes.bool,
	link: PropTypes.bool,
	className: PropTypes.string
}

HoverButton.defaultProps = {
	component: Button
}