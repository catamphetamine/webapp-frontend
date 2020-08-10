import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import HoverButton from './HoverButton'

import LeftArrowIcon from '../../assets/images/icons/left-arrow-minimal.svg'

import { post } from '../PropTypes'

import './PostVotes.css'
import './Padding.css'

export default function PostVotes({
	post,
	vote,
	onVote,
	messages
}) {
	const onUpVote = useCallback(() => onVote(true), [onVote])
	const onDownVote = useCallback(() => onVote(false), [onVote])
	return (
		<div className="PostVotes">
			<HoverButton
				title={vote !== undefined ? messages.alreadyVoted : messages.downvote}
				disabled={vote !== undefined}
				onClick={onDownVote}
				className={classNames('Padding', 'PostVote', 'PostVote--down', {
					'PostVote--voted': vote !== undefined,
					'PostVote--downvoted': vote === false
				})}>
				<LeftArrowIcon className="PostVote-icon PostVote-icon--down"/>
			</HoverButton>
			<div className={classNames('PostVotes-count', {
				'PostVotes-count--neutral': post.upvotes === post.downvotes,
				'PostVotes-count--positive': post.upvotes > post.downvotes,
				'PostVotes-count--negative': post.upvotes < post.downvotes
			})}>
				{(post.downvotes > post.upvotes) && '−'}
				{Math.abs(post.upvotes - post.downvotes)}
			</div>
			<HoverButton
				title={vote !== undefined ? messages.alreadyVoted : messages.upvote}
				disabled={vote !== undefined}
				onClick={onUpVote}
				className={classNames('Padding', 'PostVote', 'PostVote--up', {
					'PostVote--voted': vote !== undefined,
					'PostVote--upvoted': vote === true
				})}>
				<LeftArrowIcon className="PostVote-icon PostVote-icon--up"/>
			</HoverButton>
		</div>
	)
}

PostVotes.propTypes = {
	post: post.isRequired,
	vote: PropTypes.bool,
	onVote: PropTypes.func.isRequired,
	messages: PropTypes.object.isRequired
}