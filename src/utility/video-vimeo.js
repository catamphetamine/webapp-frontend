import { parseURL } from './url'
import { getImageSize } from './image'
import { getUrlQueryPart } from './video-common'

// - Supported Vimeo URL formats:
//   - http://vimeo.com/25451551
//   - http://player.vimeo.com/video/25451551
export default
{
	parse: async (url) =>
	{
		// Parse video ID.
		let id
		const location = parseURL(url)
		if (location.hostname === 'vimeo.com') {
			id = location.pathname.slice('/'.length)
		} else if (location.hostname === 'player.vimeo.com') {
			if (location.pathname.indexOf('/video/') === 0) {
				id = location.pathname.slice('/video/'.length)
			}
		}

		if (id) {
			const response = await fetch(`http://vimeo.com/api/v2/video/${id}.json`)
			const data = (await response.json())[0]
			return {
				title: data.title,
				description: data.description,
				width: data.width,
				height: data.height,
				duration: data.duration,
				source: {
					provider: 'Vimeo',
					id
				},
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: data.thumbnail_large,
						...(await getImageSize(data.thumbnail_large))
					}]
				}
			}
		}
	},

	getEmbeddedVideoUrl(id, options = {}) {
		const parameters = {}
		if (options.color) {
			parameters.color = options.color
		}
		if (options.autoPlay) {
			parameters.autoplay = 1
		}
		if (options.loop) {
			parameters.loop = 1
		}
		return `https://player.vimeo.com/video/${id}${getUrlQueryPart(parameters)}`
	},

	getVideoUrl(id) {
		return `https://vimeo.com/${id}`
	}
}