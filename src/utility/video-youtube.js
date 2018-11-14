import { parseURL, parseQueryString } from './url'
import { getImageSize } from './image'
import { getUrlQueryPart } from './video'

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
	parse: async function(url) {
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
			let video
			if (configuration.youTubeApiKey) {
				const response = await fetch(`https://content.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${configuration.youTubeApiKey}`)
				const { snippet, contentDetails } = response.items[0]
				video = {
					title: snippet.title,
					description: snippet.description,
					duration: parseISO8601Duration(contentDetails.duration),
					aspectRatio: contentDetails.definition === 'hd' ? 16/9 : 4/3,
					picture: {
						type: 'image/jpeg',
						sizes: (
							(snippet.thumbnails.medium || snippet.thumbnails.maxres) ? [
								// 320 x 180 (HD).
								snippet.thumbnails.medium,
								// 1280 x 720 (HD).
								snippet.thumbnails.maxres
							] : [
								// 120 x 90 (4:3, non-HD).
								snippet.thumbnails.default,
								// 480 x 360 (4:3, non-HD)
								snippet.thumbnails.high,
								// 640 x 480 (4:3, non-HD).
								snippet.thumbnails.standard
							]
						).filter(_ => _)
					}
				}
			}
			else {
				video = {
					picture: await this.getPicture(id)
				}
			}
			video.source = {
				'provider': 'YouTube',
				id
			}
			return video
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
		const parameters = {}
		if (options.autoPlay) {
			parameters.autoplay = 1
		}
		return `https://www.youtube.com/embed/${id}${getUrlQueryPart(parameters)}`
	}
}

const getPictureSizeURL = (id, sizeName) => `https://img.youtube.com/vi/${id}/${sizeName}.jpg`

function parseISO8601Duration(string) {
	const matches = string.match(/PT(\d+)M(\d+)S/)
	if (!matches) {
		throw new Error(`Invalid ISO8601 duration: ${string}`)
	}
	return matches[1] * 60 + matches[2]
}