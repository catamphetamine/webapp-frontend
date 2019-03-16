import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PostInlineSpoiler.css'

export default class PostInlineSpoiler extends React.Component {
	state = {}

	show = () => this.setState({ show: true })

	// Showing spoiler contents on click is also for
	// mobile devices which don't have "hover" event.
	onClick = (event) => {
		// "Prevent default" to disable click fall-through.
		// (for example, when links are placed inside spoilers).
		event.preventDefault()
		this.show()
	}

	render() {
		const {
			hidden,
			censored,
			content,
			children
		} = this.props

		const {
			show
		} = this.state

		return (
			<span
				data-hide={!show && hidden ? true : undefined}
				title={hidden && censored && typeof content === 'string' ? content : undefined}
				onClick={this.onClick}
				className={classNames('post__inline-spoiler', {
					'post__inline-spoiler--hidden': !show && hidden,
					'post__inline-spoiler--censored': censored
				})}>
				<span className="post__inline-spoiler-contents">
					{children}
				</span>
			</span>
		)
	}
}

PostInlineSpoiler.propTypes = {
	hidden: PropTypes.bool.isRequired,
	censored: PropTypes.bool,
	content: PropTypes.any,
	children: PropTypes.node.isRequired
}

PostInlineSpoiler.defaultProps = {
	hidden: true
}