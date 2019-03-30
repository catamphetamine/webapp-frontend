import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-website'
import classNames from 'classnames'

import './PostLink.css'

import GoogleIcon from '../../assets/images/icons/services/google.svg'
import YandexIcon from '../../assets/images/icons/services/yandex.svg'
import YouTubeIcon from '../../assets/images/icons/services/youtube.svg'
import VimeoIcon from '../../assets/images/icons/services/vimeo.svg'
import FacebookIcon from '../../assets/images/icons/services/facebook.svg'
import InstagramIcon from '../../assets/images/icons/services/instagram.svg'
import VKIcon from '../../assets/images/icons/services/vk.svg'
import DiscordIcon from '../../assets/images/icons/services/discord.svg'
import TelegramIcon from '../../assets/images/icons/services/telegram.svg'
import TwitterIcon from '../../assets/images/icons/services/twitter.svg'
import TwitchIcon from '../../assets/images/icons/services/twitch.svg'
import SteamIcon from '../../assets/images/icons/services/steam.svg'
import GitHubIcon from '../../assets/images/icons/services/github.svg'

import getHumanReadableLinkAddress from '../utility/post/getHumanReadableLinkAddress'

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
			service,
			serviceIcons,
			autogenerated,
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

		const serviceIcon = service && (serviceIcons[service] || SERVICE_ICONS[service])

		return (
			<a
				target={url[0] === '#' ? undefined : '_blank'}
				href={url}
				onClick={this.onClick}
				className={classNames(className, 'post__link', {
					'post__link--icon': attachment && attachment.type === 'video'
				})}>
				{/* attachment && attachment.type === 'video' &&  attachment.video.source.provider === 'YouTube' && */}
				{service && serviceIcon &&
					React.createElement(serviceIcon, {
						title: service,
						className: `post__link-icon post__link-icon--${service}`
					})
				}
				{autogenerated && service && serviceIcon && children}
				{autogenerated && !(service && serviceIcon) && getHumanReadableLinkAddress(url)}
				{!autogenerated && children}
			</a>
		)
	}
}

PostLink.propTypes = {
	url: PropTypes.string.isRequired,
	service: PropTypes.string,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	autogenerated: PropTypes.bool,
	attachment: PropTypes.shape({
		type: PropTypes.oneOf(['video']).isRequired
	}),
	openSlideshow: PropTypes.func.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

PostLink.defaultProps = {
	serviceIcons: {}
}

const SERVICE_ICONS = {
	'youtube': YouTubeIcon,
	'vimeo': VimeoIcon,
	'facebook': FacebookIcon,
	'instagram': InstagramIcon,
	'vk': VKIcon,
	'discord': DiscordIcon,
	'twitter': TwitterIcon,
	'telegram': TelegramIcon,
	'github': GitHubIcon,
	'google': GoogleIcon,
	'yandex': YandexIcon,
	'twitch': TwitchIcon,
	'steam': SteamIcon
}