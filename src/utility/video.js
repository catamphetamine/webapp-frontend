import YouTube from './video-youtube'
import Vimeo from './video-vimeo'

const VIDEO_PROVIDERS = {
	YouTube,
	Vimeo
}

// parseVideoLink('https://vimeo.com/289902998').then(_ => console.log(_))
// parseVideoLink('https://www.youtube.com/watch?v=P3DGwyl0mJQ').then(_ => console.log(_))
export async function parseVideoLink(url, options) {
	for (const provider of Object.keys(VIDEO_PROVIDERS)) {
		const result = await VIDEO_PROVIDERS[provider].parse(url, options)
		if (result) {
			return result
		}
	}
}

// export async function getVideoPicture(id, provider) {
// 	return await VIDEO_PROVIDERS[provider].getPicture(id)
// }

export function getEmbeddedVideoURL(id, provider, options) {
	return VIDEO_PROVIDERS[provider].getEmbeddedVideoURL(id, options)
}

export function getVideoURL(id, provider, options) {
	return VIDEO_PROVIDERS[provider].getVideoURL(id, options)
}

export function getUrlQueryPart(parameters) {
	const keys = Object.keys(parameters)
	if (keys.length === 0) {
		return ''
	}
	return '?' + keys.map(key => encodeURIComponent(key) + '=' + encodeURIComponent(parameters[key])).join('&')
}