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

export function getEmbeddedVideoUrl(id, provider, options) {
	return VIDEO_PROVIDERS[provider].getEmbeddedVideoUrl(id, options)
}

export function getVideoUrl(id, provider, options) {
	return VIDEO_PROVIDERS[provider].getVideoUrl(id, options)
}