import { parseURL, parseQueryString } from './url'
import { getImageSize } from './image'

const PICTURE_SIZE_NAMES = [
	// 1280 x 720.
	// HD aspect ratio.
	'maxresdefault',
	// 629 x 472.
	// non-HD aspect ratio.
	'sddefault',
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
		for (const sizeName of PICTURE_SIZE_NAMES) {
			try {
				const url = getPictureSizeURL(id, sizeName)
				return {
					type: 'image/jpeg',
					sizes: [{
						url,
						...(await getImageSize(url))
					}]
				}
			} catch (error) {
				console.error(error)
			}
		}
		throw new Error(`No picture found for YouTube video ${id}`)
	},

	getEmbeddedVideoURL(id, options = {}) {
		return `https://www.youtube.com/embed/${id}`
	}
}

const getPictureSizeURL = (id, sizeName) => `https://img.youtube.com/vi/${id}/${sizeName}.jpg`