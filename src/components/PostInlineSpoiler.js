import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import './PostInlineSpoiler.css'

export default class PostInlineSpoiler extends React.Component {
	state = {}

	show = () => this.setState({ show: true })
	peek = () => this.setState({ peek: true })
	unpeek = () => this.setState({ peek: false })

	onClick = (event) => {
		// event.preventDefault()
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
			peek,
			show
		} = this.state

		return (
			<span
				data-hide={!show && hidden ? true : undefined}
				title={hidden && censored && typeof content === 'string' ? content : undefined}
				onClick={this.onClick}
				onPointerEnter={censored ? undefined : this.peek}
				onPointerLeave={censored ? undefined : this.unpeek}
				onTouchStart={this.peek}
				onTouchEnd={this.unpeek}
				onTouchCancel={this.unpeek}
				className={classNames('post__inline-spoiler', {
					'post__inline-spoiler--hidden': !show && !peek && hidden,
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