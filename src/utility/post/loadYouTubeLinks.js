import YouTube from '../video-youtube'
import visitPostParts from './visitPostParts'

/**
 * Transforms YouTube `link`s by inserting video title as link content,
 * and also attaches a video `attachment` to the `link`.
 * @param  {any} content — Post `content`.
 * @param  {object} options — `{ youTubeApiKey, messages }`
 * @return {void}
 */
export default async function loadYouTubeLinks(content, options = {}) {
	const { youTubeApiKey, messages } = options
	const result = await Promise.all(visitPostParts(
		'link',
		link => loadYouTubeLink(link, { youTubeApiKey, messages }),
		content
	))
	return result.findIndex(_ => _) >= 0
}

async function loadYouTubeLink(link, { youTubeApiKey, messages }) {
	if (link.service !== 'youtube') {
		return
	}
	if (link.attachment) {
		return
	}
	const video = await YouTube.parse(link.url, { youTubeApiKey, messages })
	if (video) {
		// Video description is not currently being output anywhere.
		// Without `description` the `video` size is about 400 bytes.
		// With `description` the `video` size is about 1000 bytes on average.
		delete video.description
		link.attachment = {
			type: 'video',
			video
		}
		if (video.title) {
			link.content = video.title
		}
		return true
	} else if (video === null) {
		if (messages && messages.videoNotFound) {
			link.content = messages.videoNotFound
		}
		return true
	}
}