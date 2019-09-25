import getVideoByUrl from 'social-components/commonjs/services/YouTube/getVideoByUrl'
import parseVideoUrl from 'social-components/commonjs/services/YouTube/parseVideoUrl'
import { getVideoFromCache, cacheVideo } from './YouTubeVideoCache'

export default async function getYouTubeVideoByUrlCached(url, options) {
	const { id } = parseVideoUrl(url)
	if (id) {
		const videoFromCache = getVideoFromCache(id)
		if (videoFromCache) {
			return videoFromCache
		}
		const video = await getVideoByUrl(url, options)
		if (video) {
			cacheVideo(video)
			return video
		}
	}
}