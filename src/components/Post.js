import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import cloneDeep from 'lodash/cloneDeep'

import { post, postBadge, postMessages } from '../PropTypes'

import Slideshow from './Slideshow'
import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'

import loadYouTubeLinks from '../utility/post/loadYouTubeLinks'
import loadTwitterLinks from '../utility/post/loadTwitterLinks'
import expandStandaloneAttachmentLinks from '../utility/post/expandStandaloneAttachmentLinks'
import generatePostPreview from '../utility/post/generatePostPreview'
import resolvePromises from '../utility/resolvePromises'

import './Post.css'
import './PostQuoteBlock.css'

export default class Post extends React.Component {
	static propTypes = {
		post: post.isRequired,
		header: PropTypes.func,
		headerBadges: PropTypes.arrayOf(postBadge),
		footerBadges: PropTypes.arrayOf(postBadge),
		compact: PropTypes.bool,
		expandFirstPictureOrVideo: PropTypes.bool,
		saveBandwidth: PropTypes.bool,
		serviceIcons: PropTypes.objectOf(PropTypes.func),
		youTubeApiKey: PropTypes.string,
		maxAttachmentThumbnails: PropTypes.oneOfType([
			PropTypes.oneOf([false]),
			PropTypes.number
		]),
		attachmentThumbnailSize: PropTypes.number,
		openSlideshow: PropTypes.func,
		onReply: PropTypes.func,
		onVote: PropTypes.func,
		url: PropTypes.string,
		locale: PropTypes.string,
		onMoreActions: PropTypes.func,
		initialExpandContent: PropTypes.bool,
		onExpandContent: PropTypes.func,
		onContentDidChange: PropTypes.func,
		messages: postMessages.isRequired,
		className: PropTypes.string
	}

	state = {
		showPreview: this.props.initialExpandContent ? false : true
	}

	node = React.createRef()

	getNode = () => this.node.current

	onExpandContent = () => {
		const {
			onExpandContent,
			onContentDidChange
		} = this.props
		if (onExpandContent) {
			onExpandContent()
		}
		this.setState({
			showPreview: false
		}, onContentDidChange)
	}

	getNonEmbeddedAttachments() {
		const { post } = this.props
		const postContent = post.content && toArray(post.content)
		const attachments = post.attachments || []
		const nonEmbeddedAttachments = attachments.filter((attachment) => {
			if (!attachment.id) {
				return true
			}
			return !postContent.find((paragraph) => {
				return typeof paragraph === 'object' &&
					paragraph.type === 'attachment' &&
					paragraph.attachmentId === attachment.id
			})
		})
		if (nonEmbeddedAttachments.length === attachments.length) {
			return attachments
		}
		return nonEmbeddedAttachments
	}

	openSlideshowForAttachments = (picturesAndVideos, i) => {
		const { openSlideshow } = this.props
		openSlideshow(picturesAndVideos, i)
	}

	componentDidMount() {
		const {
			post,
			youTubeApiKey,
			onContentDidChange
		} = this.props
		this._isMounted = true
		// Clone the post so that the original `post` is only
		// changed after the modified post has rendered.
		const postWithLinksExpanded = cloneDeep(post)
		const promises = [
			loadTwitterLinks(postWithLinksExpanded, {
				// Replace these with proper `messages` when this is moved to `chanchan` repo maybe.
				messages: {
					link: 'Link',
					media: 'Media'
				}
			})
		]
		if (youTubeApiKey) {
			promises.push(
				loadYouTubeLinks(postWithLinksExpanded, {
					youTubeApiKey,
					messages: undefined
				})
			)
		}
		function updatePostInState(newPost) {
			post.content = newPost.content
			post.contentPreview = newPost.contentPreview
			post.attachments = newPost.attachments
		}
		// `this._isMounted` and `this.props.post` are used inside.
		const updatePost = (post) => {
			// Clone the post because it's being updated as links are being loaded.
			post = cloneDeep(post)
			// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
			// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
			// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
			expandStandaloneAttachmentLinks(post)
			// Re-generate post content preview (because post content has changed).
			post.contentPreview = generatePostPreview(post, { limit: 500 })
			if (this._isMounted) {
				// Re-render the post and update it in state.
				this.setState({
					postWithLinksExpanded: post,
					postWithLinksExpandedForPost: this.props.post
				}, () => {
					// The post could shrink in height due to the re-generated preview.
					if (onContentDidChange) {
						onContentDidChange()
					}
					// Update the post in state.
					updatePostInState(post)
				})
			} else {
				// Update the post in state.
				updatePostInState(post)
			}
		}
		// Perhaps loading "service" links could be paralleled.
		// For example, if YouTube links load first then render them first.
		// Then, twitter links load, and render them too.
		resolvePromises(promises, (foundSomething) => {
			// Intermediary updates.
			if (foundSomething) {
				updatePost(postWithLinksExpanded)
			}
		})
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	shouldComponentUpdate(nextProps, nextState) {
		if (nextState !== this.state) {
			return true
		}
		return nextProps.post !== this.props.post
	}

	render() {
		const {
			post: postProperty,
			header,
			headerBadges,
			footerBadges,
			compact,
			url,
			locale,
			expandFirstPictureOrVideo,
			maxAttachmentThumbnails,
			attachmentThumbnailSize,
			saveBandwidth,
			serviceIcons,
			openSlideshow,
			onReply,
			onVote,
			onMoreActions,
			messages,
			className
		} = this.props

		const {
			showPreview,
			postWithLinksExpanded,
			postWithLinksExpandedForPost
		} = this.state

		const post = postWithLinksExpandedForPost === postProperty ? postWithLinksExpanded : postProperty

		const attachments = post.attachments || []
		const postContent = showPreview && post.contentPreview ? post.contentPreview : post.content

		return (
			<article
				ref={this.node}
				className={classNames(className, 'post', {
					'post--titled': post.title,
					'post--starts-with-text': post.content && (typeof post.content === 'string' || typeof post.content[0] === 'string' || Array.isArray(post.content[0])),
					'post--anonymous': !post.account,
					'post--empty': !post.content,
					'post--compact': compact
				})}>
				<PostHeader
					post={post}
					url={url}
					locale={locale}
					header={header}
					badges={headerBadges}
					onMoreActions={onMoreActions}
					moreActionsLabel={messages.moreActions}
					replyLabel={messages.reply}
					onReply={onReply}
					onVote={onVote}/>
				{postContent &&
					<div className="post__content">
						{postContent.map((content, i) => (
							<PostBlock
								key={i}
								url={url}
								onReadMore={this.onExpandContent}
								readMoreLabel={messages.readMore}
								attachments={attachments}
								attachmentThumbnailSize={attachmentThumbnailSize}
								saveBandwidth={saveBandwidth}
								spoilerLabel={messages.spoiler}
								openSlideshow={openSlideshow}
								serviceIcons={serviceIcons}
								locale={locale}>
								{content}
							</PostBlock>
						))}
					</div>
				}
				<PostAttachments
					expandFirstPictureOrVideo={expandFirstPictureOrVideo}
					saveBandwidth={saveBandwidth}
					maxAttachmentThumbnails={maxAttachmentThumbnails}
					attachmentThumbnailSize={attachmentThumbnailSize}
					spoilerLabel={messages.spoiler}
					openSlideshow={openSlideshow && this.openSlideshowForAttachments}>
					{this.getNonEmbeddedAttachments()}
				</PostAttachments>
				<PostFooter
					post={post}
					badges={footerBadges}
					locale={locale}
					messages={messages}/>
			</article>
		);
	}
}

function toArray(object) {
	return Array.isArray(object) ? object : [object]
}