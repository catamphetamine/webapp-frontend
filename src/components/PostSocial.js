import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostAttachments from './PostAttachments'

import { social } from '../PropTypes'

import Instagram from '../../assets/images/icons/services/instagram.svg'
import Twitter from '../../assets/images/icons/services/twitter.svg'

import './PostSocial.css'

export default function PostSocial({
	social,
	locale,
	attachmentThumbnailSize,
	saveBandwidth,
	openSlideshow
}) {
	const ProviderLogo = getProviderLogoComponent(social.provider)
	const authorId = (
		<span className="post__social__author-id-element">
			{social.author.id}
		</span>
	)
	return (
		<article className="post__social post__quote-block post__quote-block__content">
			<div className="post__quote-block__marker"/>
			<header className="post__social__header">
				{social.author.picture &&
					<Link to={social.author.url}>
						<img
							title={social.author.name || social.author.id}
							src={social.author.picture.url}
							className="post__social__user-picture"/>
					</Link>
				}
				<div className="post__social__author-name-and-id">
					<div className="post__social__author-name">
						<Link
							to={social.author.url}
							textColor={false}
							className="post__social__author-name-inner">
							{!social.author.picture &&
								<ProviderLogo
									title={social.provider}
									className="post__social__provider-logo"/>
							}
							{social.author.name || authorId}
						</Link>
					</div>
					<div className="post__social__author-id">
						<Link to={social.author.url}>
							{social.author.name ? authorId : social.provider}
						</Link>
						{social.date && ', '}
						{social.date &&
							<Link to={social.url}>
								<time
									dateTime={social.date.toISOString()}
									className="post__social__date">
									{social.date.toLocaleString(locale, {
										year: 'numeric',
										month: 'short',
										day: 'numeric'
									})}
								</time>
							</Link>
						}
					</div>
				</div>
			</header>
			{social.content &&
				<blockquote
					cite={social.url || social.author.url || social.author.name || social.author.id}
					className="post__social__content">
					{/* `<Link/>` is placed inside `<blockquote/>` and `<p/>`
					    because `<a/>` can't contain block-level DOM elements.
					    `<blockquote/>` can be replaced with inline-level `<q/>`
					    (and `<p/>` can be removed while setting `line-height` on `<q/>`)
					    if required to be clickable as a whole. */}
					<p>
						<Link to={social.url}>
							{social.content}
						</Link>
					</p>
				</blockquote>
			}
			{social.attachments &&
				<PostAttachments
					attachmentThumbnailSize={attachmentThumbnailSize}
					saveBandwidth={saveBandwidth}
					openSlideshow={openSlideshow}>
					{social.attachments}
				</PostAttachments>
			}
		</article>
	)
}

PostSocial.propTypes = {
	social: social.isRequired,
	locale: PropTypes.string,
	attachmentThumbnailSize: PropTypes.number,
	saveBandwidth: PropTypes.bool,
	openSlideshow: PropTypes.func
}

function getProviderLogoComponent(provider) {
	switch (provider) {
		case 'Instagram':
			return Instagram
		case 'Twitter':
			return Twitter
	}
}

function Link({ inline, textColor, to, className, children }) {
	if (to) {
		return (
			<a
				target="_blank"
				href={to}
				className={classNames(className, {
					// 'post__social__content-link',
					'post__social__content-link--text-color': textColor,
					'post__social__content-link--block': !inline
				})}>
				{children}
			</a>
		)
	}
	if (className) {
		return (
			<span className={className}>
				{children}
			</span>
		)
	}
	return children
}

Link.propTypes = {
	to: PropTypes.string,
	inline: PropTypes.bool.isRequired,
	textColor: PropTypes.bool.isRequired,
	className: PropTypes.string,
	children: PropTypes.node.isRequired
}

Link.defaultProps = {
	inline: true,
	textColor: true
}