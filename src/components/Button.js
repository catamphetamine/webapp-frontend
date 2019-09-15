import React, { useState, useCallback } from 'react'
import { Button as RRUIButton } from 'react-responsive-ui'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './Button.css'

// export default function Button({
// 	disabled,
// 	onClick,
// 	className,
// 	children,
// 	...rest
// }) {
// 	const [wait, setWait] = useState()
// 	const _onClick = useCallback(() => {
// 		const result = onClick()
// 		if (result && typeof result.then === 'function') {
// 			setWait(true)
// 			result.then(
// 				() => setWait(false),
// 				() => setWait(false)
// 			)
// 		}
// 	}, [onClick])
// 	return (
// 		<button
// 			{...rest}
// 			disabled={disabled || wait}
// 			type="button"
// 			className={classNames('rrui__button-reset', className)}>
// 			{children}
// 		</button>
// 	)
// }

// Button.propTypes = {
// 	disabled: PropTypes.bool,
// 	onClick: PropTypes.func.isRequired,
// 	className: PropTypes.string,
// 	children: PropTypes.node.isRequired
// }

export default function Button(props) {
	return (
		<RRUIButton {...props}/>
	)
}