import cloneDeep from 'lodash/cloneDeep'

import loadYouTubeLinks from './loadYouTubeLinks'
import loadTwitterLinks from './loadTwitterLinks'
import expandStandaloneAttachmentLinks from './expandStandaloneAttachmentLinks'
import generatePostPreview from './generatePostPreview'
import resolvePromises from '../resolvePromises'

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
	commentLengthLimit
}) {
	// Clone the post so that the original `post` is only
	// changed after the modified post has rendered.
	const postWithLinksExpanded = cloneDeep(post)
	const promises = [
		loadTwitterLinks(postWithLinksExpanded.content, {
			messages
		}),
		loadYouTubeLinks(postWithLinksExpanded.content, {
			youTubeApiKey,
			messages
		})
	]
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
		// Clone the post because it's being updated as links are being loaded.
		post = cloneDeep(post)
		// Expand attachment links (objects of shape `{ type: 'link', attachment: ... }`)
		// into standalone attachments (block-level attachments: `{ type: 'attachment' }`).
		// In such case attachments are moved from `{ type: 'link' }` objects to `post.attachments`.
		expandStandaloneAttachmentLinks(post)
		// Re-generate post content preview (because post content has changed).
		post.contentPreview = generatePostPreview(post.content, post.attachments, {
			limit: commentLengthLimit
		})
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