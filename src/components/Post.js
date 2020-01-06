import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'
import { moreActionsType } from './PostMoreActions'

import loadResourceLinks from 'social-components/commonjs/utility/post/loadResourceLinks'
import getNonEmbeddedAttachments from 'social-components/commonjs/utility/post/getNonEmbeddedAttachments'
import getContentBlocks from 'social-components/commonjs/utility/post/getContentBlocks'

import getYouTubeVideoByUrlCached from '../utility/getYouTubeVideoByUrlCached'
import { fixAttachmentPictureSizes } from '../utility/fixPictureSize'

import './Post.css'
import './PostQuoteBlock.css'

export default class Post extends React.Component {
	static propTypes = {
		post: post.isRequired,
		header: PropTypes.func,
		headerItems: PropTypes.arrayOf(PropTypes.node),
		headerBadges: PropTypes.arrayOf(postBadge),
		footerBadges: PropTypes.arrayOf(postBadge),
		compact: PropTypes.bool,
		expandFirstPictureOrVideo: PropTypes.bool,
		expandAttachments: PropTypes.bool,
		useSmallestThumbnailsForAttachments: PropTypes.bool,
		serviceIcons: PropTypes.objectOf(PropTypes.func),
		youTubeApiKey: PropTypes.string,
		maxAttachmentThumbnails: PropTypes.oneOfType([
			PropTypes.oneOf([false]),
			PropTypes.number
		]),
		attachmentThumbnailSize: PropTypes.number.isRequired,
		onAttachmentClick: PropTypes.func,
		onPostLinkClick: PropTypes.func,
		onReply: PropTypes.func,
		showingReplies: PropTypes.bool,
		onShowReplies: PropTypes.func,
		toggleShowRepliesButtonRef: PropTypes.any,
		vote: PropTypes.bool,
		onVote: PropTypes.func,
		url: PropTypes.string,
		locale: PropTypes.string,
		moreActions: moreActionsType,
		initialExpandContent: PropTypes.bool,
		onExpandContent: PropTypes.func,
		onContentDidChange: PropTypes.func,
		onPostContentChange: PropTypes.func,
		// `lynxchan` doesn't provide `width` and `height`
		// neither for the picture not for the thumbnail
		// in `/catalog.json` API response (which is a bug).
		// http://lynxhub.com/lynxchan/res/722.html#q984
		fixAttachmentPictureSizes: PropTypes.bool,
		showPostThumbnailWhenThereAreMultipleAttachments: PropTypes.bool,
		messages: postMessages.isRequired,
		genericMessages: PropTypes.object,
		stretch: PropTypes.bool,
		className: PropTypes.string
	}

	static defaultProps = {
		attachmentThumbnailSize: 250,
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
			post: originalPost
		} = this.state
		// This condition is only for cases when `post` property changes.
		return post === originalPost ? postWithLinksExpanded : post
	}

	componentDidMount() {
		this._isMounted = true
		this.expandLinks()
	}

	componentWillUnmount() {
		this._isMounted = false
	}

	componentDidUpdate(prevProps, prevState) {
		const {
			post,
			expandAttachments,
			onContentDidChange
		} = this.props
		const {
			postWithLinksExpanded
		} = this.state
		if (post !== prevProps.post) {
			// If `post` property has changed then re-expand links.
			this.expandLinks()
		}
		if (expandAttachments !== prevProps.expandAttachments) {
			// The post height has changed due to expanding or collapsing attachments.
			// `onContentDidChange()` is gonna be `virtual-scroller`'s `onItemHeightChange()`.
			if (onContentDidChange) {
				onContentDidChange()
			}
		}
		if (postWithLinksExpanded !== prevState.postWithLinksExpanded) {
			// The post height did change due to the re-generated preview.
			// `onContentDidChange()` is gonna be `virtual-scroller`'s `onItemHeightChange()`.
			if (onContentDidChange) {
				onContentDidChange()
			}
		}
	}

	expandLinks() {
		const {
			post,
			youTubeApiKey,
			onContentDidChange,
			onPostContentChange,
			commentLengthLimit,
			genericMessages,
			fixAttachmentPictureSizes: shouldFixAttachmentPictureSizes
		} = this.props
		loadResourceLinks(post, {
			youTubeApiKey,
			getYouTubeVideoByUrl: getYouTubeVideoByUrlCached,
			messages: genericMessages,
			commentLengthLimit,
			// Fix attachment picture sizes.
			//
			// `lynxchan` doesn't provide `width` and `height`
			// neither for the picture not for the thumbnail
			// in `/catalog.json` API response (which is a bug).
			// http://lynxhub.com/lynxchan/res/722.html#q984
			// This is a workaround for that: it fetches the images
			// and finds out their correct sizes.
			//
			// `fixAttachmentPictureSizes` gets the correct image sizes
			// but for some reason React doesn't apply the `style` changes to the DOM.
			// It's most likely a bug in React.
			// https://github.com/facebook/react/issues/16357
			// `<PostAttachment/>` does pass the correct `style` to `<ButtonOrLink/>`
			// but the `style` doesn't get applied in the DOM.
			//
			loadPost: shouldFixAttachmentPictureSizes ? (post) => {
				if (post.attachments) {
					return fixAttachmentPictureSizes(post.attachments)
				}
				return []
			} : undefined,
			onPostContentChange,
			onContentChange: (postWithLinksExpanded) => {
				if (this._isMounted) {
					this.setState({
						postWithLinksExpanded,
						// `post` is stored in `state` for cases when `post` property changes.
						post
					})
				}
			}
		})
	}

	render() {
		const {
			header,
			headerItems,
			headerBadges,
			footerBadges,
			compact,
			url,
			locale,
			expandFirstPictureOrVideo,
			expandAttachments,
			maxAttachmentThumbnails,
			attachmentThumbnailSize,
			useSmallestThumbnailsForAttachments,
			showPostThumbnailWhenThereAreMultipleAttachments,
			serviceIcons,
			onAttachmentClick,
			onPostLinkClick,
			onReply,
			showingReplies,
			onShowReplies,
			toggleShowRepliesButtonRef,
			vote,
			onVote,
			moreActions,
			messages,
			stretch,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		const post = this.getPost()

		const postContent = showPreview && post.contentPreview ? post.contentPreview : post.content

		return (
			<article
				ref={this.node}
				className={classNames(className, 'post', {
					'post--titled': post.title,
					'post--starts-with-text': post.content && (typeof post.content === 'string' || typeof post.content[0] === 'string' || Array.isArray(post.content[0])),
					'post--anonymous': !post.account,
					'post--empty': !post.content,
					'post--compact': compact,
					'post--stretch': stretch
				})}>
				<PostHeader
					post={post}
					url={url}
					locale={locale}
					header={header}
					items={headerItems}
					badges={headerBadges}
					moreActions={moreActions}
					messages={messages}
					onReply={onReply}
					showingReplies={showingReplies}
					onShowReplies={onShowReplies}
					toggleShowRepliesButtonRef={toggleShowRepliesButtonRef}
					vote={vote}
					onVote={onVote}/>
				{postContent &&
					<div className="post__content">
						{getContentBlocks(postContent).map((content, i) => (
							<PostBlock
								key={i}
								url={url}
								onReadMore={this.onExpandContent}
								readMoreLabel={messages.readMore}
								attachments={post.attachments}
								attachmentThumbnailSize={attachmentThumbnailSize}
								expandAttachments={expandAttachments}
								spoilerLabel={messages.spoiler}
								onAttachmentClick={onAttachmentClick}
								onPostLinkClick={onPostLinkClick}
								serviceIcons={serviceIcons}
								locale={locale}>
								{content}
							</PostBlock>
						))}
					</div>
				}
				<PostAttachments
					post={post}
					showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
					expandFirstPictureOrVideo={expandFirstPictureOrVideo}
					useSmallestThumbnails={useSmallestThumbnailsForAttachments}
					maxAttachmentThumbnails={maxAttachmentThumbnails}
					attachmentThumbnailSize={attachmentThumbnailSize}
					expandAttachments={expandAttachments}
					spoilerLabel={messages.spoiler}
					onAttachmentClick={onAttachmentClick}>
					{getNonEmbeddedAttachments(post)}
				</PostAttachments>
				{stretch &&
					<div className="post__stretch"/>
				}
				<PostFooter
					post={post}
					badges={footerBadges}
					locale={locale}
					messages={messages}/>
			</article>
		);
	}
}