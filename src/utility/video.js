// import getYouTubeVideoByUrl from 'social-components/commonjs/services/YouTube/getVideoByUrl'
import getYouTubeEmbeddedVideoUrl from 'social-components/commonjs/services/YouTube/getEmbeddedVideoUrl'
import getYouTubeVideoUrl from 'social-components/commonjs/services/YouTube/getVideoUrl'

// import getVimeoVideoByUrl from 'social-components/commonjs/services/Vimeo/getVideoByUrl'
import getVimeoEmbeddedVideoUrl from 'social-components/commonjs/services/Vimeo/getEmbeddedVideoUrl'
import getVimeoVideoUrl from 'social-components/commonjs/services/Vimeo/getVideoUrl'

export function getEmbeddedVideoUrl(id, provider, options) {
	switch (provider) {
		case 'YouTube':
			return getYouTubeEmbeddedVideoUrl(id, options)
		case 'Vimeo':
			return getVimeoEmbeddedVideoUrl(id, options)
		default:
			throw new RangeError(`Unknown video provider: ${provider}`)
	}
}

export function getVideoUrl(id, provider, options) {
	switch (provider) {
		case 'YouTube':
			return getYouTubeVideoUrl(id, options)
		case 'Vimeo':
			return getVimeoVideoUrl(id, options)
		default:
			throw new RangeError(`Unknown video provider: ${provider}`)
	}
}