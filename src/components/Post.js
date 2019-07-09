import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

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
		useSmallestThumbnailsForAttachments: PropTypes.bool,
		serviceIcons: PropTypes.objectOf(PropTypes.func),
		youTubeApiKey: PropTypes.string,
		maxAttachmentThumbnails: PropTypes.oneOfType([
			PropTypes.oneOf([false]),
			PropTypes.number
		]),
		attachmentThumbnailSize: PropTypes.number,
		onAttachmentClick: PropTypes.func,
		onReply: PropTypes.func,
		onVote: PropTypes.func,
		url: PropTypes.string,
		locale: PropTypes.string,
		onMoreActions: PropTypes.func,
		initialExpandContent: PropTypes.bool,
		onExpandContent: PropTypes.func,
		onContentDidChange: PropTypes.func,
		onPostContentChange: PropTypes.func,
		// `lynxchan` doesn't provide `width` and `height`
		// neither for the picture not for the thumbnail
		// in `/catalog.json` API response (which is a bug).
		// http://lynxhub.com/lynxchan/res/722.html#q984
		fixAttachmentThumbnailSizes: PropTypes.bool,
		messages: postMessages.isRequired,
		genericMessages: PropTypes.object,
		className: PropTypes.string
	}

	static defaultProps = {
		messages: {
			readMore: '...'
		}
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

	getPost() {
		const {
			post
		} = this.props
		const {
			showPreview,
			postWithLinksExpanded,
			postWithLinksExpandedForPost
		} = this.state
		return postWithLinksExpandedForPost === post ? postWithLinksExpanded : post
	}

	getNonEmbeddedAttachments() {
		const attachments = this.getPost().attachments || []
		const nonEmbeddedAttachments = attachments.filter((attachment) => {
			if (!attachment.id) {
				return true
			}
			return !getParagraphs(this.getPost().content).find((paragraph) => {
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

	componentDidMount() {
		this._isMounted = true
		const {
			post,
			youTubeApiKey,
			onContentDidChange,
			onPostContentChange,
			commentLengthLimit,
			genericMessages,
			fixAttachmentThumbnailSizes
		} = this.props
		loadResourceLinks(post, {
			youTubeApiKey,
			onPostContentChange,
			messages: genericMessages,
			commentLengthLimit,
			fixAttachmentThumbnailSizes,
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
			header,
			headerBadges,
			footerBadges,
			compact,
			url,
			locale,
			expandFirstPictureOrVideo,
			maxAttachmentThumbnails,
			attachmentThumbnailSize,
			useSmallestThumbnailsForAttachments,
			serviceIcons,
			onAttachmentClick,
			onReply,
			onVote,
			onMoreActions,
			messages,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		const post = this.getPost()

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
						{getParagraphs(postContent).map((content, i) => (
							<PostBlock
								key={i}
								url={url}
								onReadMore={this.onExpandContent}
								readMoreLabel={messages.readMore}
								attachments={attachments}
								attachmentThumbnailSize={attachmentThumbnailSize}
								spoilerLabel={messages.spoiler}
								onAttachmentClick={onAttachmentClick}
								serviceIcons={serviceIcons}
								locale={locale}>
								{content}
							</PostBlock>
						))}
					</div>
				}
				<PostAttachments
					expandFirstPictureOrVideo={expandFirstPictureOrVideo}
					useSmallestThumbnails={useSmallestThumbnailsForAttachments}
					maxAttachmentThumbnails={maxAttachmentThumbnails}
					attachmentThumbnailSize={attachmentThumbnailSize}
					spoilerLabel={messages.spoiler}
					onAttachmentClick={onAttachmentClick}>
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

function getParagraphs(content) {
	if (content === undefined || content === null) {
		return []
	}
	if (typeof content === 'string') {
		return [content]
	}
	return content
}