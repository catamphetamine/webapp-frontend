import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

export function ContentSection({ className, padding, background, children, ...rest })
{
	// Margin collapse won't work for cases
	// where content section siblings are flex columns
	// therefore disabling margin collapse for all cases
	// to rule out the confusion.
	return (
		<div {...rest} className={classNames(className, 'content-section', {
			// 'content-section--no-padding': !padding,
			'content-section--background': background
		})}>
			{children}
		</div>
	)
}

ContentSection.propTypes = {
	className: PropTypes.string,
	padding: PropTypes.bool.isRequired,
	background: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired
}

ContentSection.defaultProps = {
	padding: true,
	background: false
}

export function ContentSectionHeader({ children }) {
	return (
		<h2 className="content-section__header">
			{children}
		</h2>
	)
}

ContentSectionHeader.propTypes = {
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}