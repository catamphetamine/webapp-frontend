import YouTube from '../video-youtube'
import YouTubeCached from '../video-youtube-cached'
import visitPostParts from './visitPostParts'

/**
 * Transforms YouTube `link`s by inserting video title as link content,
 * and also attaches a video `attachment` to the `link`.
 * @param  {any} content — Post `content`.
 * @param  {object} options — `{ youTubeApiKey, messages }`
 * @return {void}
 */
export default async function loadYouTubeLinks(content, options = {}) {
	const { youTubeApiKey, messages, cache } = options
	const result = await Promise.all(visitPostParts(
		'link',
		link => loadYouTubeLink(link, { youTubeApiKey, messages, cache }),
		content
	))
	return result.findIndex(_ => _) >= 0
}

async function loadYouTubeLink(link, { youTubeApiKey, messages, cache }) {
	if (link.service !== 'youtube') {
		return
	}
	// If the video has already been loaded somehow then skip.
	if (link.attachment) {
		return
	}
	const video = await (cache === false ? YouTube : YouTubeCached).parse(link.url, { youTubeApiKey })
	if (video) {
		// Video description is not currently being output anywhere.
		// Without `description` the `video` size is about 400 bytes.
		// With `description` the `video` size is about 1000 bytes on average.
		// `description` is explicitly deleted here in order to prevent
		// any possible bugs resulting from retrieving the video from local YouTube cache
		// that doesn't store video descriptions.
		delete video.description
		link.attachment = {
			type: 'video',
			video
		}
		if (link.contentGenerated) {
			if (video.title) {
				link.content = video.title
				// Unmark the link `content` as autogenerated
				// so that it's output as-is in autogenerated quotes
				// instead of "(link to youtube.com)".
				delete link.contentGenerated
			}
		}
		return true
	} else if (video === null) {
		if (link.contentGenerated) {
			if (messages && messages.videoNotFound) {
				link.content = messages.videoNotFound
				// Unmark the link `content` as autogenerated
				// so that it's output as-is in autogenerated quotes
				// instead of "(link to youtube.com)".
				delete link.contentGenerated
			}
		}
		return true
	}
}