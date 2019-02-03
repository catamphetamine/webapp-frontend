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

import PostHeading from './PostHeading'
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
		commentsCount: PropTypes.number,
		expandFirstPictureOrVideo: PropTypes.bool,
		saveBandwidth: PropTypes.bool,
		attachmentThumbnailHeight: PropTypes.number,
		openSlideshow: PropTypes.func.isRequired,
		url: PropTypes.string,
		locale: PropTypes.string
	}

	openSlideshowForAttachments = (i) => {
		const { post, openSlideshow } = this.props
		const attachments = post.attachments || []

		const embeddedAttachments = toArray(post.content || [])
			.filter(_ => _.type === 'attachment')
			.map(content => attachments.filter(_ => _.id === content.attachmentId)[0])
			.filter(attachment => attachment.type === 'picture')

		const picturesAndVideos = attachments
			.filter(_ => (_.type === 'picture' || _.type === 'video') && embeddedAttachments.indexOf(_) < 0)
			.map(_ => _.type === 'picture' ? _.picture : _.video)

		openSlideshow(picturesAndVideos, i)
	}

	render() {
		const {
			post,
			url,
			locale,
			commentsCount,
			expandFirstPictureOrVideo,
			attachmentThumbnailHeight,
			saveBandwidth,
			openSlideshow
		} = this.props

		const attachments = post.attachments || []
		const embeddedAttachmentIds = []
		// const embeddedPictures = []

		return (
			<article className={classNames('post', {
				'post--anonymous': !post.account,
				'post--empty': !post.content
			})}>
				<header className="post__summary">
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
				</header>
				{post.content && toArray(post.content).map((content, i) => (
					<PostBlock
						key={i}
						attachments={attachments}
						embeddedAttachmentIds={embeddedAttachmentIds}
						openSlideshow={openSlideshow}>
						{content}
					</PostBlock>
				))}
				<PostAttachments
					expandFirstPictureOrVideo={expandFirstPictureOrVideo}
					saveBandwidth={saveBandwidth}
					attachmentThumbnailHeight={attachmentThumbnailHeight}
					openSlideshow={this.openSlideshowForAttachments}>
					{attachments.filter(_ => !_.id || !embeddedAttachmentIds.includes(_.id))}
				</PostAttachments>
				<PostFooter post={post}/>
			</article>
		);
	}
}

function toArray(object) {
	return Array.isArray(object) ? object : [object]
}

function PostBlock({ attachments, embeddedAttachmentIds, openSlideshow, children: content }) {
	if (Array.isArray(content)) {
		return (
			<PostParagraph>
				<PostInlineContent>{content}</PostInlineContent>
			</PostParagraph>
		)
	} else if (typeof content === 'string') {
		return <PostParagraph>{content}</PostParagraph>
	} else if (content.type === 'heading') {
		return <PostHeading>{content}</PostHeading>
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
		embeddedAttachmentIds.push(content.attachmentId)
		switch (attachment.type) {
			case 'picture':
				// embeddedPictures.push(attachment.picture)
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

function PostInlineContent({ children }) {
	return children.map((content, i) => (
		<PostInlineContentElement key={i}>
			{content}
		</PostInlineContentElement>
	))
}

export function PostInlineContentElement({ children: content }) {
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
			<PostLink className="post__link--post" url={content.url}>
				{_content}
			</PostLink>
		)
	} else if (content.type === 'link') {
		return (
			<PostLink url={content.url}>
				{_content}
			</PostLink>
		)
	} else {
		console.error(`Unsupported post inline content:\n`, content)
		return null
	}
}