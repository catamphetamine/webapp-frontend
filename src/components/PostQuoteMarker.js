import React from 'react'

import './PostQuoteMarker.css'

export default function PostQuoteMarker() {
	// `<span/>` is used here instead of a `<div/>`
	// because `<PostQuoteMarker/>` is also used for
	// `<PostInlineQuote/>`s and `<PostInlineQuoteLink/>`s.
	return (
		<span className="post__quote-marker"/>
	)
}