import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'

export default class PostReadMore extends React.Component {
	onClick = (event) => {
		event.preventDefault()
		const { onReadMore } = this.props
		onReadMore()
	}

	render() {
		const {
			url,
			readMoreLabel
		} = this.props

		if (url) {
			return (
				<Link to={url} onClick={this.onClick}>
					{readMoreLabel}
				</Link>
			)
		}
		return (
			<button type="button" onClick={this.onClick} className="rrui__button-reset">
				{readMoreLabel}
			</button>
		)
	}
}

PostReadMore.propTypes = {
	url: PropTypes.string,
	onReadMore: PropTypes.func.isRequired,
	readMoreLabel: PropTypes.string.isRequired
}