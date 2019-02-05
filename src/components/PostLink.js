import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

import './PostLink.css'

import YouTubeVideoIcon from '../../assets/images/icons/youtube-video.svg'

export default class PostLink extends React.Component {
	onClick = (event) => {
		const { attachment, openSlideshow } = this.props
		if (attachment && attachment.type === 'video') {
			event.preventDefault()
			openSlideshow([attachment.video])
		}
	}

	render() {
		const {
			url,
			attachment,
			className,
			children
		} = this.props

		if (url[0] === '/') {
			return (
				<Link
					to={url}
					className={classNames('post__link', className)}>
					{children}
				</Link>
			)
		}

		return (
			<a
				target={url[0] === '#' ? undefined : '_blank'}
				href={url}
				onClick={this.onClick}
				className={classNames(className, 'post__link', {
					'post__link--icon': attachment && attachment.type === 'video'
				})}>
				{attachment && attachment.type === 'video' &&
					<YouTubeVideoIcon className="post__link-icon post__link-icon--youtube"/>
				}
				{children}
			</a>
		)
	}
}

PostLink.propTypes = {
	url: PropTypes.string.isRequired,
	attachment: PropTypes.shape({
		type: PropTypes.oneOf(['video']).isRequired
	}),
	openSlideshow: PropTypes.func.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}