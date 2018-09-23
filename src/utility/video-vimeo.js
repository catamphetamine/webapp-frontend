import { parseURL } from './url'
import { getImageSize } from './image'

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

	getEmbeddedVideoURL(id, options = {}) {
		let url = `https://player.vimeo.com/video/${id}`
		if (options.color) {
			url += `?color=${options.color}`
		}
		return url
	}
}