import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { postShape, postBadge } from '../PropTypes'

import './PostFooter.css'

export default function PostFooter({ post, badges, locale }) {
	if (badges) {
		badges = badges.filter(_ => _.condition(post))
	}
	if (!badges || badges.length === 0) {
		return null
	}
	return (
		<footer className="post__footer">
			<div className="post__footer-badges">
				{/*
				// `title` doesn't work on SVGs for some reason
				// (perhaps because SVGs don't have background)
				// so I moved `title` to a `<div/>`.
				*/}
				{badges.map(({ name, icon: Icon, title, content, onClick }) => (
					<PostBadge
						key={name}
						onClick={onClick && (() => onClick(post))}
						title={title && title(post, locale)}
						className="post__footer-badge">
						<Icon className={`post__footer-badge-icon post__footer-badge-icon--${name}`}/>
						{content(post)}
					</PostBadge>
				))}
			</div>
		</footer>
	)
}

PostFooter.propTypes = {
	post: postShape.isRequired,
	badges: PropTypes.arrayOf(postBadge),
	locale: PropTypes.string
}

function PostBadge({ onClick, children, ...rest }) {
	if (onClick) {
		children = (
			<button
				type="button"
				onClick={onClick}
				className="post__badge-button rrui__button-reset">
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

PostBadge.propTypes = {
	onClick: PropTypes.func,
	children: PropTypes.node.isRequired
}