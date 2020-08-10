import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PostQuoteBorderLeft from './PostQuoteBorderLeft'
import PostAttachments from './PostAttachments'

import { social } from '../PropTypes'

import Instagram from '../../assets/images/icons/services/instagram.svg'
import Twitter from '../../assets/images/icons/services/twitter.svg'

import './PostSocial.css'
import './PostQuoteBlock.css'

export default function PostSocial({
	social,
	locale,
	attachmentThumbnailSize,
	expandAttachments,
	onAttachmentClick
}) {
	const ProviderLogo = getProviderLogoComponent(social.provider)
	const authorId = (
		<span className="PostSocial-authorIdElement">
			{social.author.id}
		</span>
	)
	return (
		<article className="PostSocial">
			<PostQuoteBorderLeft/>
			<header className="PostSocial-header">
				{social.author.picture &&
					<Link to={social.author.url}>
						<img
							title={social.author.name || social.author.id}
							src={social.author.picture.url}
							className="PostSocial-authorPicture"/>
					</Link>
				}
				<div className="PostSocial-authorNameAndId">
					<div className="PostSocial-authorName">
						<Link
							to={social.author.url}
							textColor={false}
							className="PostSocial-authorNameInner">
							{!social.author.picture &&
								<ProviderLogo
									title={social.provider}
									className="PostSocial-providerLogo"/>
							}
							{social.author.name || authorId}
						</Link>
					</div>
					<div className="PostSocial-authorId">
						<Link to={social.author.url}>
							{social.author.name ? authorId : social.provider}
						</Link>
						{social.date && ', '}
						{social.date &&
							<Link to={social.url}>
								<time
									dateTime={social.date.toISOString()}
									className="PostSocial-date">
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
					className="PostSocial-content">
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
					expandAttachments={expandAttachments}
					attachmentThumbnailSize={attachmentThumbnailSize}
					onAttachmentClick={onAttachmentClick}>
					{social.attachments}
				</PostAttachments>
			}
		</article>
	)
}

PostSocial.propTypes = {
	social: social.isRequired,
	locale: PropTypes.string,
	expandAttachments: PropTypes.bool,
	attachmentThumbnailSize: PropTypes.number,
	onAttachmentClick: PropTypes.func
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
					// 'PostSocial-content-link',
					'PostSocial-content-link--text-color': textColor,
					'PostSocial-content-link--block': !inline
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