import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { postMonospace } from '../PropTypes'

import './PostMonospace.css'

/**
 * Renders some code.
 * Could also highlight the syntax:
 * https://github.com/catamphetamine/captchan/issues/4#issuecomment-513475218
 */
export default function PostMonospace({
	inline,
	language,
	className,
	children
}) {
	const _className = classNames(
		className,
		'post__monospace'
	)
	if (inline) {
		return (
			<code className={classNames(
				_className,
				'post__monospace--inline',
				language && `language-${language}`
			)}>
				{children}
			</code>
		)
	}
	// It's only semantially valid to place code in a `<code/>` element,
	// therefore adding a nested `<code/>` inside `<pre/>` for code.
	// https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
	return (
		<pre className={classNames(
			_className,
			// Add `.post__block` CSS class to reduce `margin-top` in cases
			// when `<PostCode/>` block comes after a `<PostParagraph/>`.
			'post__block'
		)}>
			{language &&
				<code className={`language-${language}`}>
					{children}
				</code>
			}
			{!language && children}
		</pre>
	)
}

PostMonospace.propTypes = {
	inline: PropTypes.bool,
	language: PropTypes.string,
	className: PropTypes.string,
	children: postMonospace.isRequired
}