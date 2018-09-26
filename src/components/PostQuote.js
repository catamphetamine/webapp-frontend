import React from 'react'
import { postQuoteShape } from '../PropTypes'

import './PostQuote.css'

export default function PostQuote({ children: { quote } }) {
	return (
		<div className="post__quote">
			<blockquote
				cite={quote.url || quote.source}
				className="post__quote-text">
				{quote.text}
			</blockquote>
			{quote.source &&
				<div className="post__quote-source">
					{!quote.url && quote.source}
					{quote.url &&
						<a href={quote.url} target="_blank">
							{quote.source}
						</a>
					}
				</div>
			}
		</div>
	)
}

PostQuote.propTypes = {
	children: postQuoteShape.isRequired
}