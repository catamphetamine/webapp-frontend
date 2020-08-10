import React, { useState, useCallback, useEffect, useRef } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

import PostHeader from './PostHeader'
import PostBlock from './PostBlock'
import PostAttachments from './PostAttachments'
import PostFooter, { hasFooter } from './PostFooter'
import { moreActionsType } from './PostMoreActions'

import loadResourceLinks from 'social-components/commonjs/utility/post/loadResourceLinks'
import getContentBlocks from 'social-components/commonjs/utility/post/getContentBlocks'

import { fixAttachmentPictureSizes } from '../utility/fixPictureSize'
import ResourceCache from '../utility/cache/ResourceCache'

import './Post.css'
import './PostQuoteBlock.css'

function Post({
	post: postProperty,
	showHeader,
	showSummary,
	header,
	headerItems,
	headerBadges,
	footerBadges,
	compact,
	url,
	urlBasePath,
	locale,
	initialExpandContent,
	onExpandContent,
	initialExpandPostLinkQuotes,
	onContentDidChange,
	youTubeApiKey,
	onPostContentChange,
	contentMaxLength,
	resourceMessages,
	fixAttachmentPictureSizes: shouldFixAttachmentPictureSizes,
	expandFirstPictureOrVideo,
	expandAttachments,
	onlyShowFirstAttachmentThumbnail,
	maxAttachmentThumbnails,
	attachmentThumbnailSize,
	useSmallestThumbnailsForAttachments,
	showPostThumbnailWhenThereAreMultipleAttachments,
	serviceIcons,
	onAttachmentClick,
	onPostUrlClick,
	onPostLinkClick,
	isPostLinkClickable,
	expandPostLinkBlockQuotes,
	postLinkQuoteMinimizedComponent,
	postLinkQuoteExpandTimeout,
	onPostLinkQuoteExpand,
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
}, ref) {
	const [showPreview, setShowPreview] = useState(initialExpandContent ? false : true)
	const [originalPost, setOriginalPost] = useState()
	const [postWithLinksExpanded, setPostWithLinksExpanded] = useState()

	const isMounted = useRef()
	const prevPostProperty = useRef()

	const onExpandContent_ = useCallback(() => {
		if (onExpandContent) {
			onExpandContent()
		}
		setShowPreview(false)
	}, [
		onExpandContent,
		setShowPreview
	])

	const isPostLinkQuoteExpanded = useCallback((_id) => {
		return initialExpandPostLinkQuotes && initialExpandPostLinkQuotes[_id]
	}, [initialExpandPostLinkQuotes])

	useEffect(() => {
		if (isMounted.current) {
			// Call `onContentDidChange()` when the user has clicked "Read more".
			if (onContentDidChange) {
				onContentDidChange()
			}
		}
	}, [showPreview])

	function expandLinks() {
		loadResourceLinks(postProperty, {
			youTubeApiKey,
			cache: ResourceCache,
			messages: resourceMessages,
			contentMaxLength,
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
			loadResources: shouldFixAttachmentPictureSizes ? (post) => {
				if (post.attachments) {
					return fixAttachmentPictureSizes(post.attachments)
				}
				return []
			} : undefined,
			onPostContentChange: (id) => {
				if (isMounted.current) {
					onPostContentChange(id)
				}
			},
			onContentChange: (postWithLinksExpanded) => {
				if (isMounted.current) {
					setPostWithLinksExpanded(postWithLinksExpanded)
					// `post` is stored in `state` for cases when `post` property changes.
					setOriginalPost(postProperty)
				}
			}
		})
	}

	useEffect(() => {
		isMounted.current = true
		expandLinks()
		return () => isMounted.current = false
	}, [])

	useEffect(() => {
		// If `post` property has changed then re-expand links.
		expandLinks()
	}, [postProperty])

	useEffect(() => {
		// The post height has changed due to expanding or collapsing attachments.
		// `onContentDidChange()` is gonna be `virtual-scroller`'s `onItemHeightChange()`.
		if (onContentDidChange) {
			onContentDidChange()
		}
	}, [expandAttachments])

	useEffect(() => {
		// The post height did change due to the re-generated preview.
		// `onContentDidChange()` is gonna be `virtual-scroller`'s `onItemHeightChange()`.
		if (onContentDidChange) {
			onContentDidChange()
		}
	}, [postWithLinksExpanded])

	// This condition is only for cases when `post` property changes.
	const post = postProperty === originalPost ? postWithLinksExpanded : postProperty

	const postContent = showPreview && post.contentPreview ? post.contentPreview : post.content

	const startsWithText = post.content && (typeof post.content === 'string' || typeof post.content[0] === 'string' || Array.isArray(post.content[0]))
	const startsWithQuote = post.content && Array.isArray(post.content) && (post.content[0].type === 'quote' || (Array.isArray(post.content[0]) && (post.content[0][0].type === 'post-link' || post.content[0][0].type === 'quote')))

	return (
		<article
			ref={ref}
			className={classNames(className, 'Post', {
				// 'Post--has-title': post.title,
				// 'Post--starts-with-text': startsWithText,
				// 'Post--starts-with-quote': startsWithQuote,
				'Post--anonymous': !post.account,
				// 'Post--no-content': !post.content,
				'Post--has-content': post.content,
				'Post--compact': compact,
				'Post--stretch': stretch
			})}>
			{showHeader &&
				<PostHeader
					post={post}
					showSummary={showSummary}
					url={url}
					urlBasePath={urlBasePath}
					onPostUrlClick={onPostUrlClick}
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
			}
			{postContent &&
				<div className={classNames('PostContent', {
					// 'PostContent--has-title': post.title,
					'PostContent--starts-with-text': startsWithText
				})}>
					{getContentBlocks(postContent).map((content, i) => (
						<PostBlock
							key={i}
							url={url}
							first={i === 0}
							markFirstQuote={startsWithQuote}
							onReadMore={onExpandContent_}
							readMoreLabel={messages.readMore}
							attachments={post.attachments}
							attachmentThumbnailSize={attachmentThumbnailSize}
							expandAttachments={expandAttachments}
							spoilerLabel={messages.spoiler}
							onAttachmentClick={onAttachmentClick}
							onPostLinkClick={onPostLinkClick}
							isPostLinkClickable={isPostLinkClickable}
							expandPostLinkBlockQuotes={expandPostLinkBlockQuotes}
							postLinkQuoteMinimizedComponent={postLinkQuoteMinimizedComponent}
							postLinkQuoteExpandTimeout={postLinkQuoteMinimizedComponent}
							isPostLinkQuoteExpanded={isPostLinkQuoteExpanded}
							onPostLinkQuoteExpand={onPostLinkQuoteExpand}
							onContentDidChange={onContentDidChange}
							useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
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
				onlyShowFirstAttachmentThumbnail={onlyShowFirstAttachmentThumbnail}
				spoilerLabel={messages.spoiler}
				onAttachmentClick={onAttachmentClick}/>
			{stretch &&
				<div className="Post-stretchVertically"/>
			}
			<PostFooter
				post={post}
				badges={footerBadges}
				locale={locale}
				messages={messages}/>
		</article>
	);
}

Post = React.forwardRef(Post)

Post.propTypes = {
	post: post.isRequired,
	header: PropTypes.func,
	headerItems: PropTypes.arrayOf(PropTypes.node),
	headerBadges: PropTypes.arrayOf(postBadge),
	footerBadges: PropTypes.arrayOf(postBadge),
	compact: PropTypes.bool,
	contentMaxLength: PropTypes.number,
	expandFirstPictureOrVideo: PropTypes.bool,
	expandAttachments: PropTypes.bool,
	onlyShowFirstAttachmentThumbnail: PropTypes.bool,
	useSmallestThumbnailsForAttachments: PropTypes.bool,
	serviceIcons: PropTypes.objectOf(PropTypes.func),
	youTubeApiKey: PropTypes.string,
	maxAttachmentThumbnails: PropTypes.oneOfType([
		PropTypes.oneOf([false]),
		PropTypes.number
	]),
	attachmentThumbnailSize: PropTypes.number.isRequired,
	onAttachmentClick: PropTypes.func,
	onPostUrlClick: PropTypes.func,
	onPostLinkClick: PropTypes.func,
	isPostLinkClickable: PropTypes.func,
	expandPostLinkBlockQuotes: PropTypes.bool,
	postLinkQuoteMinimizedComponent: PropTypes.elementType,
	postLinkQuoteExpandTimeout: PropTypes.number,
	onPostLinkQuoteExpand: PropTypes.func,
	onReply: PropTypes.func,
	showingReplies: PropTypes.bool,
	onShowReplies: PropTypes.func,
	toggleShowRepliesButtonRef: PropTypes.any,
	vote: PropTypes.bool,
	onVote: PropTypes.func,
	url: PropTypes.string,
	urlBasePath: PropTypes.string,
	locale: PropTypes.string,
	moreActions: moreActionsType,
	initialExpandContent: PropTypes.bool,
	onExpandContent: PropTypes.func,
	initialExpandPostLinkQuotes: PropType.objectOf(PropTypes.bool),
	onContentDidChange: PropTypes.func,
	onPostContentChange: PropTypes.func,
	// `lynxchan` doesn't provide `width` and `height`
	// neither for the picture not for the thumbnail
	// in `/catalog.json` API response (which is a bug).
	// http://lynxhub.com/lynxchan/res/722.html#q984
	fixAttachmentPictureSizes: PropTypes.bool,
	showPostThumbnailWhenThereAreMultipleAttachments: PropTypes.bool,
	messages: postMessages.isRequired,
	resourceMessages: PropTypes.object,
	showHeader: PropTypes.bool,
	showSummary: PropTypes.bool,
	stretch: PropTypes.bool,
	className: PropTypes.string
}

Post.defaultProps = {
	showHeader: true,
	attachmentThumbnailSize: 250,
	messages: {
		readMore: '...'
	}
}

export default Post