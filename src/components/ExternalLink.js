import React from 'react'
import PropTypes from 'prop-types'

function ExternalLink({
	to,
	...rest
}, ref) {
	return (
		<a {...rest} ref={ref} href={to} />
	)
}

ExternalLink = React.forwardRef(ExternalLink)

ExternalLink.propTypes = {
	to: PropTypes.string.isRequired
}

export default ExternalLink