import React, { useState, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Button.css'

function _Button({
	className,
	children,
	...rest
}, ref) {
	return (
		<button
			{...rest}
			ref={ref}
			type="button"
			className={classNames('Button', className)}>
			{children}
		</button>
	)
}

export const Button = React.forwardRef(_Button)

Button.propTypes = {
	className: PropTypes.string,
	// Sometimes there can be empty buttons:
	// for example, round buttons styled via CSS.
	children: PropTypes.node //.isRequired
}

function Button_({
	disabled,
	onClick,
	className,
	children,
	...rest
}, ref) {
	const [wait, setWait] = useState()
	const isMounted = useRef()
	const _onClick = useCallback((...args) => {
		const result = onClick.apply(this, args)
		if (result && typeof result.then === 'function') {
			setWait(true)
			const onEnded = () => {
				if (isMounted.current) {
					setWait(false)
				}
			}
			result.then(
				onEnded,
				onEnded
			)
		}
	}, [
		onClick,
		setWait
	])
	useEffect(() => {
		isMounted.current = true
		return () => {
			isMounted.current = false
		}
	})
	return (
		<Button
			{...rest}
			ref={ref}
			onClick={_onClick}
			disabled={disabled || wait}
			type="button"
			className={classNames(className, {
				'Button--wait': wait
			})}>
			{children}
		</Button>
	)
}

Button_ = React.forwardRef(Button_)

Button_.propTypes = {
	disabled: PropTypes.bool,
	onClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	// Sometimes there can be empty buttons:
	// for example, round buttons styled via CSS.
	children: PropTypes.node //.isRequired
}

export default Button_