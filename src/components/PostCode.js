import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'

import { postCode } from '../PropTypes'

import './PostCode.css'

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
		'PostCode',
		// // Add `.PostBlock` CSS class to reduce `margin-top` in cases
		// // when `<PostCode/>` block comes after a `<PostParagraph/>`.
		// !inline && 'PostBlock',
		!inline && 'PostCode--block',
		inline && 'PostCode--inline',
		inline && language && `language-${language}`
	)
	if (language && typeof children === 'string') {
		if (SyntaxHighlighter.supportedLanguages.includes(language)) {
			return (
				<SyntaxHighlighter
					inline={inline}
					PreTag={Pre}
					useInlineStyles={false}
					language={language}
					realClassName={classNames(className, 'PostCode--highlighted')}
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
// Fixes "`<pre/>` is always rendered" issue.
// https://github.com/conorhastings/react-syntax-highlighter/issues/201
function Pre({ inline, realClassName, children }) {
	const Component = inline ? 'span' : 'pre'
	return (
		<Component className={realClassName}>
			{children}
		</Component>
	)
}

Pre.propTypes = {
	inline: PropTypes.bool,
	realClassName: PropTypes.string,
	children: PropTypes.node.isRequired
}