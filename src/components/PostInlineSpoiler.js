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
			children
		} = this.props

		const {
			peek,
			show
		} = this.state

		return (
			<span
				onClick={this.onClick}
				onMouseEnter={this.peek}
				onMouseLeave={this.unpeek}
				onTouchStart={this.peek}
				onTouchEnd={this.unpeek}
				onTouchCancel={this.unpeek}
				className={classNames('post__inline-spoiler', {
					'post__inline-spoiler--hidden': !show && !peek && hidden
				})}>
				<span
					className={classNames('post__inline-spoiler-contents', {
						'post__inline-spoiler-contents--hidden': !show && !peek && hidden
					})}>
					{children}
				</span>
			</span>
		)
	}
}

PostInlineSpoiler.propTypes = {
	hidden: PropTypes.bool.isRequired,
	children: PropTypes.node.isRequired
}

PostInlineSpoiler.defaultProps = {
	hidden: true
}