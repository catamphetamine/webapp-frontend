import YouTube, { parseUrl } from './video-youtube'
import { getVideoFromCache, cacheVideo } from './video-youtube-cache'

export default {
	...YouTube,
	parse: async (url, options) => {
		const { id } = parseUrl(url)
		if (id) {
			const videoFromCache = getVideoFromCache(id)
			if (videoFromCache) {
				return videoFromCache
			}
			const video = await YouTube.parse(url, options)
			if (video) {
				cacheVideo(video)
				return video
			}
		}
	}
}