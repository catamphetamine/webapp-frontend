import React from 'react'
import { Button as RRUIButton } from 'react-responsive-ui'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './ButtonWithLoadingIndicator.css'

function Button(props, ref) {
	return (
		<RRUIButton {...props} ref={ref}/>
	)
}

Button = React.forwardRef(Button)

export default Button