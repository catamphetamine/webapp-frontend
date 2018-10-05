import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-website'

import { postShape } from '../PropTypes'
import { accountLink } from './AccountLink'
import AccountPicture from './AccountPicture'
import Picture from './Picture'
import Slideshow from './Slideshow'

import PostHeading from './PostHeading'
import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostQuote from './PostQuote'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'
import PostAttachments from './PostAttachments'

import PostText from './PostText'
import PostLink from './PostLink'

// import PostAttachmentPicture from './PostAttachmentPicture'
// import PostAttachmentVideo from './PostAttachmentVideo'
// import PostAttachmentAudio from './PostAttachmentAudio'
import PostAttachmentLink from './PostAttachmentLink'

import './Post.css'

export default class Post extends React.Component
{
	static propTypes = {
		post: postShape.isRequired
	}

	state = {}

	showSlideshow = (i) => this.setState({
		slideshowIndex: i,
		showSlideshow: true
	})

	hideSlideshow = () => this.setState({
		slideshowIndex: undefined,
		showSlideshow: false
	})

	render() {
		const { post } = this.props
		const { showSlideshow, slideshowIndex } = this.state
		const attachments = post.attachments || []
		const embeddedAttachmentIds = []
		const pictures = attachments.filter(_ => _.type === 'picture').map(_ => _.picture)
		const embeddedPictures = []
		return (
			<div className="post">
				<div className="post__summary">
					<Link to={accountLink(post.account)}>
						<AccountPicture
							account={post.account}
							className="post__account-picture"/>
					</Link>
					<div className="post__name-and-date">
						<Link
							to={accountLink(post.account)}
							className="post__name">
							{post.account.name}
						</Link>
						<div className="post__date">
							<ReactTimeAgo tooltipClassName="post__date-tooltip">
								{post.date}
							</ReactTimeAgo>
						</div>
					</div>
				</div>
				{post.content && post.content.map((content, i) => {
					if (Array.isArray(content)) {
						return (
							<p key={i}>
								{content.map((content, i) => {
									if (typeof content === 'string') {
										return <PostText key={i}>{content}</PostText>
									} else if (content.type === 'link') {
										return <PostLink key={i}>{content}</PostLink>
									} else {
										console.error(`Unsupported post inline content:\n`, content)
										return null
									}
								})}
							</p>
						)
					} else if (typeof content === 'string') {
						return <PostParagraph key={i}>{content}</PostParagraph>
					} else if (content.type === 'heading') {
						return <PostHeading key={i}>{content}</PostHeading>
					} else if (content.type === 'list') {
						return <PostList key={i}>{content}</PostList>
					} else if (content.type === 'quote') {
						return <PostQuote key={i}>{content}</PostQuote>
					} else if (content.type === 'attachment') {
						const attachment = attachments.filter(_ => _.id === content.attachmentId)[0]
						if (!attachment) {
							console.error(`Attachment not found: ${content.attachmentId}`)
							return null
						}
						embeddedAttachmentIds.push(content.attachmentId)
						switch (attachment.type) {
							case 'picture':
								embeddedPictures.push(attachment.picture)
								return (
									<PostPicture
										onClick={() => this.showSlideshow(embeddedPictures.length - 1)}
										key={i}>
										{attachment}
									</PostPicture>
								)
							case 'video':
								return <PostVideo key={i}>{attachment}</PostVideo>
							case 'audio':
								return <PostAudio key={i}>{attachment}</PostAudio>
							default:
								console.error(`Unknown embedded attachment type: ${attachment.type}`)
								return null
						}
					} else {
						console.error(`Unsupported post content:\n`, content)
						return null
					}
				})}
				<PostAttachments showSlideshow={(i) => this.showSlideshow(embeddedPictures.length + i)}>
					{attachments.filter(_ => !embeddedAttachmentIds.includes(_.id))}
				</PostAttachments>
				{pictures.length > 0 &&
					<Slideshow
						i={slideshowIndex}
						isOpen={showSlideshow}
						onClose={this.hideSlideshow}>
						{embeddedPictures.concat(attachments.filter(_ => _.type === 'picture').map(_ => _.picture).filter(_ => embeddedPictures.indexOf(_) < 0))}
					</Slideshow>
				}
			</div>
		);
	}
}