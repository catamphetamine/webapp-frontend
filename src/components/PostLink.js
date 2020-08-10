import React, { useCallback, useState } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-pages'
import classNames from 'classnames'

import ServiceIcon, { hasIcon } from './ServiceIcon'

import './PostLink.css'

import LinkIcon from '../../assets/images/icons/external.svg'

import getHumanReadableLinkAddress from 'social-components/commonjs/utility/post/getHumanReadableLinkAddress'

export default function PostLink({
	url,
	service,
	serviceIcons,
	contentGenerated,
	onClick,
	attachment,
	onAttachmentClick,
	className,
	children
}) {
	const onClick_ = useCallback((event) => {
		if (onClick) {
			onClick(event)
		}
		// // Re-fetch "Not Found" resource links on click.
		// // For example, if a YouTube video is marked as private,
		// // then it's shown as "Not Found", and may be unmarked
		// // as private some time later.
		// if (notFound) {
		// 	const Resource = RESOURCES[service]
		// 	if (Resource) {
		// 		loadResourceLink(link, Resource, options).then(forceUpdate)
		// }
		if (!event.defaultPrevented) {
			if (attachment && attachment.type === 'video') {
				event.preventDefault()
				onAttachmentClick(attachment)
			}
		}
	}, [
		onClick,
		onAttachmentClick,
		attachment
	])

	if (url[0] === '/') {
		return (
			<Link
				to={url}
				onClick={onClick_}
				className={classNames('PostLink', className)}>
				{children}
			</Link>
		)
	}

	// `.PostLink-iconWrapFix` is a fix for preventing the link icon
	// from staying on the previous line while the link text being placed
	// on the next line due to wrapping in case of long unbreakable links.
	// https://snook.ca/archives/html_and_css/icon-wrap-after-text

	const hasServiceIcon = service && hasIcon(service, serviceIcons)

	return (
		<a
			target={url[0] === '#' ? undefined : '_blank'}
			href={url}
			onClick={onClick_}
			className={classNames(className, 'PostLink', {
				'PostLink--icon': attachment && attachment.type === 'video'
			})}>
			{/* attachment && attachment.type === 'video' &&  attachment.video.provider === 'YouTube' && */}
			{hasServiceIcon &&
				<span className="PostLink-iconWrapFix">
					<ServiceIcon
						service={service}
						icons={serviceIcons}
						className="PostLink-icon"/>
					&nbsp;
				</span>
			}
			{contentGenerated && hasServiceIcon && children}
			{contentGenerated && !hasServiceIcon &&
				<span className="PostLink-iconWrapFix">
					<LinkIcon className="PostLink-icon"/>
					&nbsp;
				</span>
			}
			{contentGenerated && !hasServiceIcon && getHumanReadableLinkAddress(url)}
			{!contentGenerated && children}
		</a>
	)
}

PostLink.propTypes = {
	url: PropTypes.string.isRequired,
	service: PropTypes.string,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	contentGenerated: PropTypes.bool,
	attachment: PropTypes.shape({
		type: PropTypes.oneOf(['video']).isRequired
	}),
	onClick: PropTypes.func,
	onAttachmentClick: PropTypes.func.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}