import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

// import { postInlineQuote } from '../PropTypes'

import './PostInlineQuote.css'

export default function PostInlineQuote({
	generated,
	children
}) {
	return (
		<span className={classNames('post__inline-quote', {
			'post__inline-quote--generated': generated
		})}>
			{children}
		</span>
	)
}

PostInlineQuote.propTypes = {
	generated: PropTypes.bool,
	children: PropTypes.node.isRequired
}
