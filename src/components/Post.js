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
import expandStandaloneAttachmentLinks from '../utility/post/expandStandaloneAttachmentLinks'

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
		url: PropTypes.string,
		locale: PropTypes.string,
		readMoreLabel: PropTypes.string,
		className: PropTypes.string
	}

	state = {
		showingPreview: this.props.post.contentPreview !== undefined
	}

	expandContent = () => this.setState({ showingPreview: false })

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
		if (youTubeApiKey) {
			loadYouTubeLinks(post, { youTubeApiKey }).then((found) => {
				if (found && this._isMounted) {
					expandStandaloneAttachmentLinks(post)
					this.forceUpdate()
				}
			})
		}
		this._isMounted = true
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	render() {
		const {
			post,
			thread,
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
			readMoreLabel,
			className
		} = this.props

		const { showingPreview } = this.state

		const attachments = post.attachments || []
		const postContent = showingPreview ? post.contentPreview : post.content

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
					badges={headerBadges}
					locale={locale}/>
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