import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

import Slideshow from './Slideshow'
import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'

import loadResourceLinks from '../utility/post/loadResourceLinks'

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
		onPostContentChange: PropTypes.func,
		messages: postMessages.isRequired,
		genericMessages: PropTypes.object,
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
		this._isMounted = true
		const {
			post,
			youTubeApiKey,
			onContentDidChange,
			onPostContentChange,
			commentLengthLimit,
			genericMessages
		} = this.props
		loadResourceLinks(post, {
			youTubeApiKey,
			onPostContentChange,
			messages: genericMessages,
			commentLengthLimit,
			onUpdatePost: (post, callback) => {
				if (this._isMounted) {
					// Re-render the post and update it in state.
					this.setState({
						postWithLinksExpanded: post,
						postWithLinksExpandedForPost: this.props.post
					}, () => {
						// The post could shrink in height due to the re-generated preview.
						// `onContentDidChange()` could be `virtual-scroller`'s `onItemHeightChange()`.
						if (onContentDidChange) {
							onContentDidChange()
						}
						callback()
					})
				} else {
					callback()
				}
			}
		})
	}

	componentWillUnmount() {
		this._isMounted = false
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