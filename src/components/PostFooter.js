import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge } from '../PropTypes'

import './PostFooter.css'

export default function PostFooter({
	post,
	badges,
	locale,
	messages
}) {
	if (badges) {
		badges = badges.filter(_ => _.condition(post))
	}
	const hasBadges = badges && badges.length > 0
	if (!hasBadges) {
		return null
	}
	return (
		<footer className="post__footer">
			{hasBadges &&
				<div className="post__footer-badges">
					{/*
					// `title` doesn't work on SVGs for some reason
					// (perhaps because SVGs don't have background)
					// so I moved `title` to a `<div/>`.
					*/}
					{badges.map(({ ref, name, icon: Icon, title, content, onClick, isPushed }) => (
						<PostBadge
							buttonRef={ref}
							key={name}
							onClick={onClick && (() => onClick(post))}
							isPushed={isPushed}
							title={title && title(post, locale, messages)}
							className="post__footer-badge">
							<Icon className={`post__footer-badge-icon post__footer-badge-icon--${name}`}/>
							{content(post)}
						</PostBadge>
					))}
				</div>
			}
		</footer>
	)
}

PostFooter.propTypes = {
	post: post.isRequired,
	badges: PropTypes.arrayOf(postBadge),
	locale: PropTypes.string,
	messages: PropTypes.object
}

class PostBadge extends React.Component {
	render() {
		let {
			buttonRef,
			onClick,
			isPushed,
			children,
			...rest
		} = this.props
		if (onClick) {
			children = (
				<button
					ref={buttonRef}
					type="button"
					onClick={onClick}
					className={classNames('post__badge-button', 'hover-button', 'rrui__button-reset', {
						'hover-button--pushed': isPushed
					})}>
					{children}
				</button>
			)
		}
		return (
			<div {...rest}>
				{children}
			</div>
		)
	}
}

PostBadge.propTypes = {
	buttonRef: PropTypes.any,
	onClick: PropTypes.func,
	isPushed: PropTypes.bool,
	children: PropTypes.node.isRequired
}