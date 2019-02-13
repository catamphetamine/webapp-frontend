import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Link } from 'react-website'
import classNames from 'classnames'

import { postShape } from '../PropTypes'
import { accountLink } from './AccountLink'
import AccountPicture from './AccountPicture'
import Picture from './Picture'
import Slideshow from './Slideshow'

import PostSubheading from './PostSubheading'
import PostDate from './PostDate'
import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostQuote from './PostQuote'
import PostInlineSpoiler from './PostInlineSpoiler'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'
import PostAttachments from './PostAttachments'
import PostFooter from './PostFooter'

import PostText from './PostText'
import PostLink from './PostLink'

// import PostAttachmentPicture from './PostAttachmentPicture'
// import PostAttachmentVideo from './PostAttachmentVideo'
// import PostAttachmentAudio from './PostAttachmentAudio'
// import PostAttachmentLink from './PostAttachmentLink'

import { openSlideshow } from '../redux/slideshow'

import './Post.css'

@connect(() => ({}), {
	openSlideshow
})
export default class Post extends React.Component
{
	static propTypes = {
		post: postShape.isRequired,
		compact: PropTypes.bool,
		commentsCount: PropTypes.number,
		attachmentsCount: PropTypes.number,
		expandFirstPictureOrVideo: PropTypes.bool,
		saveBandwidth: PropTypes.bool,
		attachmentThumbnailHeight: PropTypes.number,
		openSlideshow: PropTypes.func.isRequired,
		url: PropTypes.string,
		locale: PropTypes.string
	}

	getNonEmbeddedAttachments() {
		const { post } = this.props

		const postContent = post.content && toArray(post.content)
		const attachments = post.attachments || []

		return attachments.filter((attachment) => {
			if (!attachment.id) {
				return true
			}
			return !postContent.find((paragraph) => {
				return typeof paragraph === 'object' &&
					paragraph.type === 'attachment' &&
					paragraph.attachmentId === attachment.id
			})
		})
	}

	openSlideshowForAttachments = (i) => {
		const { post, openSlideshow } = this.props
		const attachments = this.getNonEmbeddedAttachments()

		const picturesAndVideos = attachments
			.filter(_ => _.type === 'picture' || _.type === 'video')
			.map(_ => _.type === 'picture' ? _.picture : _.video)

		openSlideshow(picturesAndVideos, i)
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
			attachmentThumbnailHeight,
			saveBandwidth,
			openSlideshow
		} = this.props

		const attachments = post.attachments || []
		const postContent = post.content && toArray(post.content)

		return (
			<article className={classNames('post', {
				'post--anonymous': !post.account,
				'post--empty': !post.content,
				'post--compact': compact
			})}>
				<header className={classNames('post__header', {
					'post__header--with-heading': post.heading
				})}>
					<div className="post__summary">
						{post.account &&
							<React.Fragment>
								<Link to={accountLink(post.account)}>
									<AccountPicture
										account={post.account}
										className="post__account-picture"/>
								</Link>
								<div className="post__name-and-date">
									<Link
										to={accountLink(post.account)}
										rel="author"
										className="post__name">
										{post.account.name}
									</Link>
									<PostDate
										date={post.createdAt}
										link={url}
										locale={locale}/>
								</div>
							</React.Fragment>
						}
						{!post.account &&
							<PostDate
								date={post.createdAt}
								link={url}
								locale={locale}/>
						}
					</div>
					{post.heading &&
						<h1 className="post__heading">
							{post.heading}
						</h1>
					}
				</header>
				{post.content &&
					<div className="post__content">
						{postContent.map((content, i) => (
							<PostBlock
								key={i}
								attachments={attachments}
								attachmentThumbnailHeight={attachmentThumbnailHeight}
								openSlideshow={openSlideshow}>
								{content}
							</PostBlock>
						))}
					</div>
				}
				<PostAttachments
					expandFirstPictureOrVideo={expandFirstPictureOrVideo}
					saveBandwidth={saveBandwidth}
					attachmentThumbnailHeight={attachmentThumbnailHeight}
					openSlideshow={this.openSlideshowForAttachments}>
					{this.getNonEmbeddedAttachments()}
				</PostAttachments>
				<PostFooter post={post}/>
			</article>
		);
	}
}

function toArray(object) {
	return Array.isArray(object) ? object : [object]
}

function PostBlock({ attachments, attachmentThumbnailHeight, openSlideshow, children: content }) {
	if (Array.isArray(content)) {
		return (
			<PostParagraph>
				<PostInlineContent openSlideshow={openSlideshow}>
					{content}
				</PostInlineContent>
			</PostParagraph>
		)
	} else if (typeof content === 'string') {
		return <PostParagraph>{content}</PostParagraph>
	} else if (content.type === 'heading') {
		return <PostSubheading>{content}</PostSubheading>
	} else if (content.type === 'list') {
		return <PostList>{content}</PostList>
	} else if (content.type === 'quote') {
		return <PostQuote>{content}</PostQuote>
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
				return (
					<PostVideo
						height={content.fit === 'height' ? attachmentThumbnailHeight : undefined}
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
				console.error(`Unknown embedded attachment type: ${attachment.type}`)
				return null
		}
	} else {
		console.error(`Unsupported post content:\n`, content)
		return null
	}
}

function PostInlineContent({ openSlideshow, children }) {
	return children.map((content, i) => (
		<PostInlineContentElement
			key={i}
			openSlideshow={openSlideshow}>
			{content}
		</PostInlineContentElement>
	))
}

export function PostInlineContentElement({ openSlideshow, children: content }) {
	if (Array.isArray(content)) {
		return <PostInlineContent>{content}</PostInlineContent>
	} else if (content === '\n') {
		return <br/>
	} else if (typeof content === 'string') {
		return content
	}
	const _content = content.content && (
		<PostInlineContentElement>
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
			<q
				className={classNames('post__inline-quote', {
					'post__inline-quote--autogenerated': content.autogenerated
				})}>
				{_content}
			</q>
		)
	} else if (content.type === 'spoiler') {
		return (
			<PostInlineSpoiler>
				{_content}
			</PostInlineSpoiler>
		)
	} else if (content.type === 'post-link') {
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
				openSlideshow={openSlideshow}>
				{_content}
			</PostLink>
		)
	} else {
		console.error(`Unsupported post inline content:\n`, content)
		return null
	}
}