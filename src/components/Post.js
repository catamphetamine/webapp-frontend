import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-website'

import { postShape } from '../PropTypes'
import { accountLink } from './AccountLink'
import AccountPicture from './AccountPicture'
import Picture from './Picture'

import PostParagraph from './PostParagraph'
import PostList from './PostList'
import PostQuote from './PostQuote'
import PostPicture from './PostPicture'
import PostVideo from './PostVideo'
import PostAudio from './PostAudio'

import PostText from './PostText'
import PostLink from './PostLink'

// import PostAttachmentPicture from './PostAttachmentPicture'
// import PostAttachmentVideo from './PostAttachmentVideo'
// import PostAttachmentAudio from './PostAttachmentAudio'
import PostAttachmentLink from './PostAttachmentLink'

import PlayVideoIcon from '../../assets/images/video-player-play-icon-overlay.svg'

import './Post.css'

export default class Post extends React.Component
{
	static propTypes = {
		post: postShape.isRequired
	}

	state = {}

	showVideo = () => this.setState({ showVideo: true })

	render() {
		const { post } = this.props
		const { showVideo } = this.state
		const attachments = post.attachments || []
		const pictures = attachments.filter(_ => _.type === 'picture')
		const videos = attachments.filter(_ => _.type === 'video')
		const audios = attachments.filter(_ => _.type === 'audio')
		const links = attachments.filter(_ => _.type === 'link')
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
					} else if (content.type === 'list') {
						return <PostList key={i}>{content}</PostList>
					} else if (content.type === 'quote') {
						return <PostQuote key={i}>{content}</PostQuote>
					} else if (content.type === 'picture') {
						return <PostPicture key={i}>{content}</PostPicture>
					} else if (content.type === 'video') {
						return <PostVideo key={i}>{content}</PostVideo>
					} else if (content.type === 'audio') {
						return <PostAudio key={i}>{content}</PostAudio>
					} else {
						console.error(`Unsupported post content:\n`, content)
						return null
					}
				})}
				{attachments.length > 0 &&
					<div className="post__attachments">
						{pictures.length === 1 &&
							<PostPicture>
								{pictures[0]}
							</PostPicture>
						}
						{videos.length === 1 &&
							<PostVideo>
								{videos[0]}
							</PostVideo>
						}
						{(pictures.length > 1 || videos.length > 1) &&
							<div className="post__thumbnail-attachments-container">
								<ul className="post__thumbnail-attachments row">
									{pictures.length > 1 && pictures.map(_ => _.picture).map((picture, i) => (
										<li
											key={`picture-${i}`}
											className="post__thumbnail-attachment col-xs-12 col-xs-plus-6 col-m-4 col-xl-4">
											<Picture
												fit="cover"
												sizes={picture.sizes}
												className="post__attachment-thumbnail"/>
										</li>
									))}
									{videos.length > 1 && videos.map(_ => _.video).map((video, i) => (
										<li
											key={`video-${i}`}
											className="post__thumbnail-attachment col-xs-12 col-xs-plus-6 col-m-4 col-xl-4">
											<div className="position-relative">
												<Picture
													fit="cover"
													sizes={video.picture.sizes}
													className="post__attachment-thumbnail"/>
												<PlayVideoIcon
													className="play-video-icon post__thumbnail-video-icon"/>
											</div>
										</li>
									))}
								</ul>
							</div>
						}
						{audios.length > 0 &&
							<ul className="post__audios">
								{audios.map((audio, i) => (
									<li key={i}>
										<PostAudio>
											{audio}
										</PostAudio>
									</li>
								))}
							</ul>
						}
						{links.length > 0 &&
							<ul className="post__links">
								{links.map((link, i) => (
									<li key={i}>
										<PostAttachmentLink>
											{link}
										</PostAttachmentLink>
									</li>
								))}
							</ul>
						}
					</div>
				}
			</div>
		);
	}
}