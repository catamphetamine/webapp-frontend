import React from 'react'
import PropTypes from 'prop-types'
// import { connect } from 'react-redux'
import classNames from 'classnames'

import { postShape, postBadge } from '../PropTypes'

import Slideshow from './Slideshow'
import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments, { sortPostAttachments } from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'

import loadYouTubeLinks from '../utility/post/loadYouTubeLinks'
import loadTwitterLinks from '../utility/post/loadTwitterLinks'
import expandStandaloneAttachmentLinks from '../utility/post/expandStandaloneAttachmentLinks'
import generatePostPreview from '../utility/post/generatePostPreview'

// import { openSlideshow } from '../redux/slideshow'

import './Post.css'

// Passing `openSlideshow` as an explicit property instead
// to avoid having a lot of `@connect()`s executing on pages
// with a lot of posts (for example, `chanchan` imageboard client).
// @connect(() => ({}), {
// 	openSlideshow
// })
export default class Post extends React.PureComponent {
	static propTypes = {
		post: postShape.isRequired,
		thread: PropTypes.object,
		header: PropTypes.func,
		headerBadges: PropTypes.arrayOf(postBadge),
		footerBadges: PropTypes.arrayOf(postBadge),
		replies: PropTypes.arrayOf(oneOfType([
			PropTypes.string,
			PropTypes.number
		])),
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
		moreActionsLabel: PropTypes.string,
		readMoreLabel: PropTypes.string,
		spoilerLabel: PropTypes.string,
		replyLabel: PropTypes.string,
		className: PropTypes.string
	}

	state = {
		showPreview: true
	}

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
			thread,
			header,
			headerBadges,
			footerBadges,
			replies,
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
			moreActionsLabel,
			readMoreLabel,
			replyLabel,
			spoilerLabel,
			className
		} = this.props

		const { showPreview } = this.state

		const attachments = post.attachments || []
		const postContent = showPreview && post.contentPreview ? post.contentPreview : post.content

		return (
			<article className={classNames(className, 'post', {
				'post--titled': post.title,
				'post--starts-with-text': post.content && (typeof post.content === 'string' || typeof post.content[0] === 'string' || Array.isArray(post.content[0])),
				'post--anonymous': !post.account,
				'post--empty': !post.content,
				'post--compact': compact
			})}>
				<PostHeader
					post={post}
					thread={thread}
					url={url}
					locale={locale}
					header={header}
					badges={headerBadges}
					onMoreActions={onMoreActions}
					moreActionsLabel={moreActionsLabel}
					replyLabel={replyLabel}
					onReply={onReply}
					onVote={onVote}/>
				{postContent &&
					<div className="post__content">
						{postContent.map((content, i) => (
							<PostBlock
								key={i}
								url={url}
								onReadMore={this.expandContent}
								readMoreLabel={readMoreLabel}
								attachments={attachments}
								attachmentThumbnailSize={attachmentThumbnailSize}
								saveBandwidth={saveBandwidth}
								spoilerLabel={spoilerLabel}
								openSlideshow={openSlideshow}
								serviceIcons={serviceIcons}>
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
					spoilerLabel={spoilerLabel}
					openSlideshow={openSlideshow && this.openSlideshowForAttachments}>
					{this.getNonEmbeddedAttachments()}
				</PostAttachments>
				<PostFooter
					post={post}
					badges={footerBadges}
					locale={locale}/>
			</article>
		);
	}
}

function toArray(object) {
	return Array.isArray(object) ? object : [object]
}