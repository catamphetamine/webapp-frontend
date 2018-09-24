import React from 'react'
import ReactTimeAgo from 'react-time-ago'
import { Link } from 'react-website'

import { postShape } from '../PropTypes'
import { accountLink } from './AccountLink'
import AccountPicture from './AccountPicture'
import Picture from './Picture'
import Video from './Video'

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
		const pictures = attachments.filter(_ => _.type === 'picture').map(_ => _.picture)
		const videos = attachments.filter(_ => _.type === 'video').map(_ => _.video)
		const audios = attachments.filter(_ => _.type === 'audio').map(_ => _.audio)
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
					if (typeof content === 'string') {
						return (
							<p key={i}>
								{content}
							</p>
						);
					} else if (content.type === 'list') {
						return (
							<ul key={i}>
								{content.items.map((item, i) => (
									<li>{item}</li>
								))}
							</ul>
						);
					} else {
						console.error(`Unsupported post content:\n`, content)
						return <p key={i}/>
					}
				})}
				{attachments.length > 0 &&
					<div className="post__attachments">
						{pictures.length === 1 &&
							<Picture
								sizes={pictures[0].sizes}
								className="post__picture"/>
						}
						{videos.length === 1 && videos[0].picture && !showVideo &&
							<div className="post__video">
								<Picture
									onClick={this.showVideo}
									sizes={videos[0].picture.sizes}/>
								<PlayVideoIcon
									className="play-video-icon post__video-icon"/>
							</div>
						}
						{videos.length === 1 && (!videos[0].picture || showVideo) &&
							<Video
								video={videos[0]}
								className="post__video"/>
						}
						{(pictures.length > 1 || videos.length > 1) &&
							<div className="post__thumbnail-attachments-container">
								<ul className="post__thumbnail-attachments row">
									{pictures.length > 1 && pictures.map((picture, i) => (
										<li
											key={`picture-${i}`}
											className="post__thumbnail-attachment col-xs-12 col-xs-plus-6 col-m-4 col-xl-4">
											<Picture
												fit="cover"
												sizes={picture.sizes}
												className="post__attachment-thumbnail"/>
										</li>
									))}
									{videos.length > 1 && videos.map((video, i) => (
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
									<li
										key={i}
										className="post__audio">
										{audio.author} — {audio.title}
									</li>
								))}
							</ul>
						}
						{links.length > 0 &&
							<ul className="post__links">
								{links.map((link, i) => (
									<li
										key={i}
										className="post__link-item">
										<a
											href={link.url}
											target="_blank"
											className="post__link-attachment">
											{link.picture &&
												<Picture
													sizes={link.picture.sizes}
													className="post__link-picture"/>
											}
											<div className="post__link-title-and-description">
												<h2 className="post__link-title">
													{link.title}
												</h2>
												<p className="post__link-description">
													{link.description}
												</p>
											</div>
										</a>
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