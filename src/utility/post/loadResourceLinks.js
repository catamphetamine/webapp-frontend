import cloneDeep from 'lodash/cloneDeep'

import loadYouTubeLinks from './loadYouTubeLinks'
import loadTwitterLinks from './loadTwitterLinks'
import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'
import generatePostPreview from './generatePostPreview'
import resolvePromises from '../resolvePromises'

import { getImageSize } from '../image'

/**
 * Loads "resource" links (such as links to YouTube and Twitter)
 * by loading the info associated with the resources.
 * For example, sets video `.attachment` on YouTube links
 * and sets "social" `.attachment` on Twitter links.
 * @param  {object} post
 * @param  {function} [options.onPostContentChange]
 * @param  {(string|string[])} [options.youTubeApiKey]
 * @param  {function} [options.onUpdatePost]
 * @param  {number} [options.commentLengthLimit]
 * @param  {object} [options.messages]
 */
export default function loadResourceLinks(post, {
	onPostContentChange,
	youTubeApiKey,
	messages,
	onUpdatePost,
	commentLengthLimit,
	fixAttachmentThumbnailSizes
}) {
	// Clone the post so that the original `post` is only
	// changed after the modified post has rendered.
	const postWithLinksExpanded = clonePost(post)
	const promises = [
		loadTwitterLinks(postWithLinksExpanded.content, {
			messages: messages && messages.contentType
		}),
		loadYouTubeLinks(postWithLinksExpanded.content, {
			youTubeApiKey,
			messages: messages && messages.post
		})
	]
	// `lynxchan` doesn't provide `width` and `height`
	// neither for the picture not for the thumbnail
	// in `/catalog.json` API response (which is a bug).
	// http://lynxhub.com/lynxchan/res/722.html#q984
	if (fixAttachmentThumbnailSizes && postWithLinksExpanded.attachments) {
		promises.push(fixPostAttachmentThumbnailSizes(postWithLinksExpanded.attachments))
	}
	function updatePostObject(newPost) {
		post.content = newPost.content
		post.contentPreview = newPost.contentPreview
		post.attachments = newPost.attachments
		if (post.onContentChange) {
			for (const id of post.onContentChange()) {
				// `onPostContentChange(id)` could update the
				// corresponding `<Post/>` in the list of posts.
				// For example, consider a list of `<Post/>` comments
				// where some comments may be replies to other comments
				// which also includes autogenerating parent comment quotes
				// at the start of each such reply. If the parent comment
				// content changes all such replies have to be re-generated
				// and re-rendered, and that's the use case here.
				if (onPostContentChange) {
					onPostContentChange(id)
				}
			}
		}
	}
	// `this._isMounted` and `this.props.post` are used inside.
	const updatePost = (post) => {
		// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
		// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
		// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
		expandStandaloneAttachmentLinks(post)
		// Re-generate post content preview (because post content has changed).
		post.contentPreview = generatePostPreview(post.content, post.attachments, {
			limit: commentLengthLimit
		})
		// Snapshot the `post` in its current state for re-rendering
		// because other resource loaders will be modifying `post` too.
		// (`content` will be modified and new `attachments` will be added)
		post = clonePost(post)
		// Update the post in state.
		onUpdatePost(post, () => updatePostObject(post))
	}
	// Perhaps loading "service" links could be paralleled.
	// For example, if YouTube links load first then render them first.
	// Then, twitter links load, and render them too.
	resolvePromises(promises, (foundSomething) => {
		// Intermediary updates.
		if (foundSomething) {
			updatePost(postWithLinksExpanded)
		}
	})
}

/**
 * Clones a post so that the original post content
 * could be modified and new attachments added
 * without affecting the snapshot.
 * Doesn't use straight `cloneDeep(post)`
 * just because I prefer keeping cloned properties explicit.
 * @param  {object} post
 * @return {object}
 */
function clonePost(post) {
	return {
		// `contentPreview` will be re-generated
		// so it's copied "by reference".
		...post,
		// `content` will be changed at arbitrary deep levels
		// so it's cloned deeply.
		content: cloneDeep(post.content),
		// New attachments will be added
		// so `attachments` are copied "shallowly".
		attachments: post.attachments && post.attachments.slice()
	}
}

// `lynxchan` doesn't provide `width` and `height`
// neither for the picture not for the thumbnail
// in `/catalog.json` API response (which is a bug).
// http://lynxhub.com/lynxchan/res/722.html#q984
const EXT_REGEXP = /\.[a-z]+$/
function fixPostAttachmentThumbnailSizes(attachments) {
	return Promise.all(attachments.map(async (attachment) => {
		switch (attachment.type) {
			case 'picture':
				// Not using `Promise.all` here because the URLs
				// aren't guaranteed to be valid.
				// (the original image URL is not always guessed)
				//
				// Load the thumbnail first for better UX.
				let thumbnailSize
				const thumbnailSizeUrl = attachment.picture.sizes[0].url
				try {
					thumbnailSize = await getImageSize(thumbnailSizeUrl)
				} catch (error) {
					console.error(error)
				}
				if (thumbnailSize) {
					attachment.picture = {
						...attachment.picture,
						sizes: [{
							...attachment.picture.sizes[0],
							...thumbnailSize
						}]
					}
				}
				// Images from `kohlchan.net` before moving to `lynxchan` in May 2019
				// have incorrect URLs: they don't have the extension part.
				// For example:
				// Exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng
				// Not exists: https://kohlchan.net/.media/82b9c3a866f6233f1c0253d3eb819ea5-imagepng.png
				let originalSize
				let originalSizeUrl = attachment.picture.url
				try {
					originalSize = await getImageSize(originalSizeUrl)
				} catch (error) {
					console.error(error)
					try {
						// Try an image with no file extension.
						// (kohlchan.net workaround).
						originalSizeUrl = attachment.picture.url.replace(EXT_REGEXP, '')
						originalSize = await getImageSize(originalSizeUrl)
					} catch (error) {
						console.error(error)
						// Original image URL not guessed.
						// Use thumbnail image as a stub.
						originalSize = thumbnailSize
						originalSizeUrl = thumbnailSizeUrl
					}
				}
				if (originalSize) {
					attachment.picture = {
						...attachment.picture,
						...originalSize,
						url: originalSizeUrl
					}
				}
				break
		}
	})).then(() => true)
}