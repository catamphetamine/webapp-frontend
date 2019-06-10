import YouTube from '../video-youtube'
import visitPostParts from './visitPostParts'

/**
 * Transforms YouTube `link`s by inserting video title as link content,
 * and also attaches a video `attachment` to the `link`.
 * @param  {object} post
 * @param  {object} options — `{ youTubeApiKey, messages }`
 * @return {void}
 */
export default async function parseYouTubeLinks(post, options = {}) {
	const { youTubeApiKey, messages } = options
	const result = await Promise.all(visitPostParts(
		'link',
		link => parseYouTubeLink(link, { youTubeApiKey, messages }),
		post.content
	))
	return result.findIndex(_ => _) >= 0
}

async function parseYouTubeLink(link, { youTubeApiKey, messages }) {
	if (link.service !== 'youtube') {
		return
	}
	if (link.attachment) {
		return
	}
	const video = await YouTube.parse(link.url, { youTubeApiKey, messages })
	if (video) {
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