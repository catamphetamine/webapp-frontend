import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'

import { postCode } from '../PropTypes'

import './PostCode.css'

// Reset the styles on `<pre/>`.
// https://github.com/conorhastings/react-syntax-highlighter/issues/199
const PRE_STYLE_FIX = {
	display: undefined,
	overflowX: undefined,
	overflowY: undefined,
	padding: undefined,
	color: undefined,
	backgroundColor: undefined,
	fontFamily: undefined,
	textShadow: undefined,
	margin: undefined,
	borderRadius: undefined
}

/**
 * Renders some code.
 * Could also highlight the syntax:
 * https://github.com/catamphetamine/captchan/issues/4#issuecomment-513475218
 */
export default function PostCode({
	inline,
	language,
	className: _className,
	children
}) {
	const codeTagProps = useMemo(() => ({
		className: `language-${language}`
	}), [language])
	const className = classNames(
		_className,
		'post__code',
		// Add `.post__block` CSS class to reduce `margin-top` in cases
		// when `<PostCode/>` block comes after a `<PostParagraph/>`.
		!inline && 'post__block',
		inline && 'post__code--inline',
		inline && language && `language-${language}`
	)
	// `SyntaxHighlighter` seems to only support block-level code.
	// https://github.com/conorhastings/react-syntax-highlighter/issues/201
	if (!inline && language && typeof children === 'string') {
		if (SyntaxHighlighter.supportedLanguages.includes(language)) {
			return (
				<SyntaxHighlighter
					PreTag={Pre}
					useInlineStyles={false}
					language={language}
					realClassName={classNames(className, 'post__code--highlighted')}
					codeTagProps={codeTagProps}>
					{children}
				</SyntaxHighlighter>
			)
		}
	}
	if (inline) {
		return (
			<code className={className}>
				{children}
			</code>
		)
	}
	// It's only semantially valid to place code in a `<code/>` element,
	// therefore adding a nested `<code/>` inside `<pre/>` for code.
	// https://html.spec.whatwg.org/multipage/grouping-content.html#the-pre-element
	return (
		<pre className={className}>
			{language &&
				<code className={`language-${language}`}>
					{children}
				</code>
			}
			{!language && children}
		</pre>
	)
}

PostCode.propTypes = {
	inline: PropTypes.bool,
	language: PropTypes.string,
	className: PropTypes.string,
	children: postCode.isRequired
}

// Fixes `className` bug.
// https://github.com/conorhastings/react-syntax-highlighter/issues/200
function Pre({ realClassName, children }) {
	return (
		<pre className={realClassName}>
			{children}
		</pre>
	)
}