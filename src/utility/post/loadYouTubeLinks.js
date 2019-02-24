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
	const result = await Promise.all(visitPostParts(
		'link',
		link => parseYouTubeLink(link, options),
		post.content
	))
	return result.length > 0
}

async function parseYouTubeLink(link, options) {
	if (link.service !== 'youtube') {
		return
	}
	const video = await YouTube.parse(link.url, options)
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
		if (options.messages && options.messages.videoNotFound) {
			link.content = options.messages.videoNotFound
		}
		return true
	}
}