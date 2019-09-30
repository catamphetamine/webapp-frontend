import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostQuoteBlock from './PostQuoteBlock'
import { postInlineQuote } from '../PropTypes'

import './PostInlineQuote.css'

export default function PostInlineQuote({ generated, kind, children }) {
	return (
		<span className={classNames('post__inline-quote', kind && `post__inline-quote--${kind}`, {
			'post__inline-quote--generated': generated
		})}>
			<PostQuoteBlock
				inline
				generated={generated}>
				{children}
			</PostQuoteBlock>
		</span>
	)
}

PostInlineQuote.propTypes = {
	generated: PropTypes.bool,
	// `kohlchan.net` and `8ch.net` have regular quotes and "inverse" quotes.
	kind: PropTypes.string,
	children: PropTypes.node.isRequired
}
