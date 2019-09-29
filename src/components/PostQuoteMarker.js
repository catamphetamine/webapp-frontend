import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PostQuoteMarker.css'

export default function PostQuoteMarker({ className }) {
	// `<span/>` is used here instead of a `<div/>`
	// because `<PostQuoteMarker/>` is also used for
	// `<PostInlineQuote/>`s and `<PostInlineQuoteLink/>`s.
	return (
		<span className={classNames(className, 'post__quote-marker')}/>
	)
}

PostQuoteMarker.propTypes = {
	className: PropTypes.string
}