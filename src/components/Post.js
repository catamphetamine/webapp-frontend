import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import classNames from 'classnames'

import { postShape } from '../PropTypes'
import Picture from './Picture'
import Slideshow from './Slideshow'

import PostHeader from './PostHeader'
import PostSubheading from './PostSubheading'
import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostMonospace from './PostMonospace'
import PostQuote from './PostQuote'
import PostInlineQuote from './PostInlineQuote'
import PostInlineSpoiler from './PostInlineSpoiler'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'
import PostAttachments, { sortByAspectRatioAscending } from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'

import PostText from './PostText'
import PostLink from './PostLink'

import loadYouTubeLinks from '../utility/post/loadYouTubeLinks'
import expandStandaloneAttachmentLinks from '../utility/post/expandStandaloneAttachmentLinks'

import { openSlideshow } from '../redux/slideshow'

import './Post.css'

@connect(() => ({}), {
	openSlideshow
})
export default class Post extends React.Component {
	static propTypes = {
		post: postShape.isRequired,
		compact: PropTypes.bool,
		commentsCount: PropTypes.number,
		attachmentsCount: PropTypes.number,
		expandFirstPictureOrVideo: PropTypes.bool,
		saveBandwidth: PropTypes.bool,
		serviceIcons: PropTypes.objectOf(PropTypes.func),
		youTubeApiKey: PropTypes.string,
		maxAttachmentThumbnails: PropTypes.oneOfType([
			PropTypes.oneOf([false]),
			PropTypes.number
		]),
		attachmentThumbnailSize: PropTypes.number,
		openSlideshow: PropTypes.func.isRequired,
		url: PropTypes.string,
		locale: PropTypes.string,
		className: PropTypes.string
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

	openSlideshowForAttachments = (i) => {
		const { post, openSlideshow } = this.props
		const attachments = this.getNonEmbeddedAttachments()

		let picturesAndVideos = attachments.filter(_ => _.type === 'picture' || _.type === 'video')
		sortByAspectRatioAscending(picturesAndVideos)
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
			compact,
			url,
			locale,
			commentsCount,
			attachmentsCount,
			expandFirstPictureOrVideo,
			maxAttachmentThumbnails,
			attachmentThumbnailSize,
			saveBandwidth,
			serviceIcons,
			openSlideshow,
			className
		} = this.props

		const attachments = post.attachments || []
		const postContent = post.content && toArray(post.content)

		return (
			<article className={classNames( className, 'post', {
				'post--titled': post.title,
				'post--starts-with-text': post.content && (typeof post.content === 'string' || typeof post.content[0] === 'string' || Array.isArray(post.content[0])),
				'post--anonymous': !post.account,
				'post--empty': !post.content,
				'post--compact': compact
			})}>
				<PostHeader
					post={post}
					url={url}
					locale={locale}/>
				{post.content &&
					<div className="post__content">
						{postContent.map((content, i) => (
							<PostBlock
								key={i}
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
					openSlideshow={this.openSlideshowForAttachments}>
					{this.getNonEmbeddedAttachments()}
				</PostAttachments>
				{hasFooter(post) &&
					<PostFooter post={post}/>
				}
			</article>
		);
	}
}

function toArray(object) {
	return Array.isArray(object) ? object : [object]
}

export function PostBlock({ attachments, attachmentThumbnailSize, openSlideshow, serviceIcons, children: content }) {
	if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostParagraph>
				<PostInlineContent openSlideshow={openSlideshow} serviceIcons={serviceIcons}>
					{content}
				</PostInlineContent>
			</PostParagraph>
		)
	} else if (content.type === 'heading') {
		return <PostSubheading>{content}</PostSubheading>
	} else if (content.type === 'list') {
		return <PostList>{content}</PostList>
	} else if (content.type === 'quote') {
		return <PostQuote>{content}</PostQuote>
	} else if (content.type === 'monospace') {
		return <PostMonospace>{content.content}</PostMonospace>
	} else if (content.type === 'attachment') {
		const attachment = attachments.filter(_ => _.id === content.attachmentId)[0]
		if (!attachment) {
			console.error(`Attachment not found: ${content.attachmentId}`)
			return null
		}
		switch (attachment.type) {
			case 'picture':
				return (
					<PostPicture
						onClick={(event) => {
							event.preventDefault()
							openSlideshow([attachment.picture])
						}}>
						{attachment}
					</PostPicture>
				)
			case 'video':
				const maxHeight = attachment.video.height ? Math.min(attachment.video.height, attachmentThumbnailSize) : attachmentThumbnailSize
				return (
					<PostVideo
						height={content.fit === 'height' ? maxHeight : undefined}
						onClick={(event) => {
							event.preventDefault()
							openSlideshow([attachment.video])
						}}>
						{attachment}
					</PostVideo>
				)
			case 'audio':
				return <PostAudio>{attachment}</PostAudio>
			default:
				console.error(`Unknown embedded attachment type: "${attachment.type}"\n`, attachment)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return (
			<PostParagraph>
				<PostInlineContent openSlideshow={openSlideshow} serviceIcons={serviceIcons}>
					{(Array.isArray(content.content) || content.content) ? content.content : JSON.stringify(content.content)}
				</PostInlineContent>
			</PostParagraph>
		)
	}
}

function PostInlineContent({ openSlideshow, serviceIcons, children }) {
	if (typeof children === 'string') {
		return children
	}
	return children.map((content, i) => (
		<PostInlineContentElement
			key={i}
			openSlideshow={openSlideshow}
			serviceIcons={serviceIcons}>
			{content}
		</PostInlineContentElement>
	))
}

export function PostInlineContentElement({ children: content, ...rest }) {
	const { openSlideshow, serviceIcons } = rest
	if (content === '\n') {
		return <br/>
	} else if (Array.isArray(content) || typeof content === 'string') {
		return (
			<PostInlineContent openSlideshow={openSlideshow} serviceIcons={serviceIcons}>
				{content}
			</PostInlineContent>
		)
	}
	const _content = content.content && (
		<PostInlineContentElement {...rest}>
			{content.content}
		</PostInlineContentElement>
	)
	if (content.type === 'text') {
		return (
			<PostText style={content.style}>
				{_content}
			</PostText>
		)
	} else if (content.type === 'inline-quote') {
		return (
			<PostInlineQuote autogenerated={content.autogenerated}>
				{_content}
			</PostInlineQuote>
		)
	} else if (content.type === 'spoiler') {
		return (
			<PostInlineSpoiler>
				{_content}
			</PostInlineSpoiler>
		)
	} else if (content.type === 'post-link') {
		if (content.quote) {
			return (
				<PostInlineQuote url={content.url} autogenerated={content.quoteAutogenerated}>
					<PostInlineContentElement {...rest}>
						{content.quote}
					</PostInlineContentElement>
				</PostInlineQuote>
			)
		}
		return (
			<PostLink
				url={content.url}
				className="post__link--post">
				{_content}
			</PostLink>
		)
	} else if (content.type === 'link') {
		return (
			<PostLink
				url={content.url}
				autogenerated={content.autogenerated}
				attachment={content.attachment}
				service={content.service}
				openSlideshow={openSlideshow}
				serviceIcons={serviceIcons}>
				{_content}
			</PostLink>
		)
	} else if (content.type === 'monospace') {
		return (
			<PostMonospace inline>
				{_content}
			</PostMonospace>
		)
	} else {
		console.error(`Unsupported post inline content:\n`, content)
		return null
	}
}