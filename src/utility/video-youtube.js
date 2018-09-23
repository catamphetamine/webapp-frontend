import { parseURL, parseQueryString } from './url'
import { getImageSizes } from './image'

const PICTURE_SIZE_NAMES = [
	// 1280 x 720.
	'maxresdefault',
	// 629 x 472.
	'sddefault'
]

const PICTURE_SIZE_NAMES_FALLBACK = [
	// For really old videos not having `maxresdefault`/`sddefault`.
	'hqdefault'
]

// - Supported YouTube URL formats:
//   - http://www.youtube.com/watch?v=My2FRPA3Gf8
//   - http://youtu.be/My2FRPA3Gf8
export default
{
	parse: async function(url)
	{
		// Get video ID.
		let id
		const location = parseURL(url)
		if (location.hostname === 'www.youtube.com') {
			if (location.search) {
				const query = parseQueryString(location.search.slice('/'.length))
				id = query.v
			}
		} else if (location.hostname === 'youtu.be') {
			id = location.pathname.slice('/'.length)
		}

		if (id) {
			return {
				source: {
					provider: 'YouTube',
					id
				},
				picture: await this.getPicture(id)
			}
		}
	},

	getPicture: async (id) => {
		let pictures = await getImageSizes(PICTURE_SIZE_NAMES.map(_ => getPictureSizeURL(id, _)))
		if (pictures.length === 0) {
			pictures = await getImageSizes(PICTURE_SIZE_NAMES_FALLBACK.map(_ => getPictureSizeURL(id, _)))
		}
		if (pictures.length === 0) {
			throw new Error(`No picture found for YouTube video ${id}`)
		}
		return {
			type: 'image/jpeg',
			sizes: pictures
		}
	},

	getEmbeddedVideoURL(id, options = {}) {
		return `https://www.youtube.com/embed/${id}`
	}
}

const getPictureSizeURL = (id, sizeName) => `https://img.youtube.com/vi/${id}/${sizeName}.jpg`