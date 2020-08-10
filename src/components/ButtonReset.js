import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ButtonReset.css'

function ButtonReset() {
	return (
		<button
			{...rest}
			ref={ref}
			type="button"
			className={classNames('ButtonReset', className)}>
			{children}
		</button>
	)
}

ButtonReset = React.forwardRef(ButtonReset)

ButtonReset.propTypes = {
	children: PropTypes.node.isRequired
}

export default ButtonReset