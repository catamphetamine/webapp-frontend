import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

import Slideshow from './Slideshow'
import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments, { sortPostAttachments } from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'

import loadYouTubeLinks from '../utility/post/loadYouTubeLinks'
import loadTwitterLinks from '../utility/post/loadTwitterLinks'
import expandStandaloneAttachmentLinks from '../utility/post/expandStandaloneAttachmentLinks'
import generatePostPreview from '../utility/post/generatePostPreview'

import './Post.css'
import './PostQuoteBlock.css'

export default class Post extends React.PureComponent {
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
		messages: postMessages.isRequired,
		className: PropTypes.string
	}

	state = {
		showPreview: true
	}

	node = React.createRef()

	getNode = () => this.node.current

	expandContent = () => this.setState({ showPreview: false })

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

	openSlideshowForAttachments = (i) => {
		const { post, openSlideshow } = this.props
		const attachments = this.getNonEmbeddedAttachments()

		let picturesAndVideos = attachments.filter(_ => _.type === 'picture' || _.type === 'video')
		sortPostAttachments(picturesAndVideos)
		picturesAndVideos = picturesAndVideos.map(_ => _.type === 'picture' ? _.picture : _.video)

		openSlideshow(picturesAndVideos, i)
	}

	componentDidMount() {
		const {
			post,
			youTubeApiKey
		} = this.props
		const promises = [
			loadTwitterLinks(post, {
				// Replace these with proper `messages` when this is moved to `chanchan` repo maybe.
				messages: {
					link: 'Link',
					media: 'Media'
				}
			})
		]
		if (youTubeApiKey) {
			promises.push(
				loadYouTubeLinks(post, { youTubeApiKey })
			)
		}
		Promise.all(promises).then((results) => {
			const foundSomething = results.find(_ => _)
			if (foundSomething && this._isMounted) {
				expandStandaloneAttachmentLinks(post)
				post.contentPreview = generatePostPreview(post, { limit: 500 })
				this.forceUpdate()
			}
		})
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	render() {
		const {
			post,
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

		const { showPreview } = this.state

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
								onReadMore={this.expandContent}
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