import React, { useRef, useState, useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PopIconButton.css'

function PopIconButton({
	buttonComponent: Button,
	onIcon,
	offIcon,
	value,
	onClick,
	iconClassName,
	...rest
}, ref) {
	// Don't animate on initial render.
	const initial = useRef(true)
	const initialValue = useRef(value)
	if (value !== initialValue.current) {
		initial.current = false
	}
	// Store latest `value` to roll back if a change errors.
	const latestValue = useRef(value)
	// `value` should change immediately on click,
	// so it's stored in `state`.
	const [isActive, setIsActive] = useState(value)
	useEffect(() => setIsActive(value), [value])
	const Icon = isActive ? onIcon : offIcon
	// Modify `onClick()` so that it sets `isActive` "prematurely",
	// and then tracks whether `onClick()` did finish or error.
	const onClick_ = useCallback(() => {
		const result = onClick(!isActive)
		if (result && typeof result.then === 'function') {
			result.then(
				() => {
					// Change finished.
					// Icon status is consistent with the `value` property.
					// `value` property can still be stale at this point:
					// for example, when using Redux and `useSelector()`,
					// there could be a small delay.
					// That's the reason why the icon state isn't reset here:
					// setIsActive(latestValue.current)
				},
				() => {
					// Change errored.
					// Reset the icon status.
					setIsActive(latestValue.current)
				}
			)
		}
		// Show icon status as "change finished"
		// even before the change is actually finished
		// because otherwise the pop animation would feel awkward.
		// If `onChange()` did throw then this line of code
		// won't be executed. If `onChange()` return a `Promise`
		// and it errors then the icon status is reset.
		setIsActive(!isActive)
	}, [onClick])
	return (
		<Button
			{...rest}
			ref={ref}
			onClick={onClick_}>
			<Icon
				{...rest}
				className={classNames(iconClassName, {
					'PopIcon--animate': !initial.current && isActive
				})}/>
		</Button>
	)
}

PopIconButton = React.forwardRef(PopIconButton)

PopIconButton.propTypes = {
	buttonComponent: PropTypes.elementType.isRequired,
	onIcon: PropTypes.elementType.isRequired,
	offIcon: PropTypes.elementType.isRequired,
	value: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	iconClassName: PropTypes.string
}

export default PopIconButton