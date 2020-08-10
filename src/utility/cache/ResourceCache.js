import YouTubeVideoCache from './YouTubeVideoCache'

export default {
	get(service, key) {
		switch (service) {
			case 'youtube':
				return YouTubeVideoCache.get(key)
		}
	},
	put(service, key, value) {
		switch (service) {
			case 'youtube':
				return YouTubeVideoCache.put(key, value)
		}
	}
}