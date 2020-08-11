import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { post, postBadge, postMessages } from '../PropTypes'

import PostHeader from './PostHeader'
import PostContent from './PostContent'
import PostAttachments from './PostAttachments'
import PostStretchVertically from './PostStretchVertically'
import PostFooter, { hasFooter } from './PostFooter'
import { moreActionsType } from './PostMoreActions'

import './Post.css'

function Post({
	post,
	showHeader,
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
	fixAttachmentPictureSizes,
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
	return (
		<article
			ref={ref}
			className={classNames(className, 'Post', {
				// 'Post--has-title': post.title,
				'Post--anonymous': !post.account,
				// 'Post--no-content': !post.content,
				'Post--has-content': post.content,
				'Post--compact': compact,
				'Post--stretch': stretch
			})}>
			<PostHeader
				post={post}
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
			<PostContent
				post={post}
				initialExpandContent={initialExpandContent}
				onExpandContent={onExpandContent}
				initialExpandPostLinkQuotes={initialExpandPostLinkQuotes}
				onContentDidChange={onContentDidChange}
				youTubeApiKey={youTubeApiKey}
				onPostContentChange={onPostContentChange}
				contentMaxLength={contentMaxLength}
				resourceMessages={resourceMessages}
				fixAttachmentPictureSizes={fixAttachmentPictureSizes}
				expandFirstPictureOrVideo={expandFirstPictureOrVideo}
				expandAttachments={expandAttachments}
				attachmentThumbnailSize={attachmentThumbnailSize}
				useSmallestThumbnailsForAttachments={useSmallestThumbnailsForAttachments}
				serviceIcons={serviceIcons}
				onAttachmentClick={onAttachmentClick}
				onPostLinkClick={onPostLinkClick}
				isPostLinkClickable={isPostLinkClickable}
				expandPostLinkBlockQuotes={expandPostLinkBlockQuotes}
				postLinkQuoteMinimizedComponent={postLinkQuoteMinimizedComponent}
				postLinkQuoteExpandTimeout={postLinkQuoteExpandTimeout}
				onPostLinkQuoteExpand={onPostLinkQuoteExpand}
				url={url}
				locale={locale}
				messages={messages}
				className={className}/>
			<PostAttachments
				post={post}
				showPostThumbnailWhenThereAreMultipleAttachments={showPostThumbnailWhenThereAreMultipleAttachments}
				expandFirstPictureOrVideo={expandFirstPictureOrVideo}
				useSmallestThumbnails={useSmallestThumbnailsForAttachments}
				maxAttachmentThumbnails={maxAttachmentThumbnails}
				attachmentThumbnailSize={attachmentThumbnailSize}
				expandAttachments={expandAttachments}
				onlyShowFirstAttachmentThumbnail={onlyShowFirstAttachmentThumbnail}
				spoilerLabel={messages && messages.spoiler}
				onAttachmentClick={onAttachmentClick}/>
			{stretch &&
				<PostStretchVertically/>
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
	attachmentThumbnailSize: PropTypes.number,
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
	messages: postMessages,
	resourceMessages: PropTypes.object,
	stretch: PropTypes.bool,
	className: PropTypes.string
}

export default Post