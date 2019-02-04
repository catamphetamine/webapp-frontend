import { parseURL, parseQueryString } from './url'
import { getImageSize } from './image'
import { getUrlQueryPart } from './video'

const PREVIEW_PICTURE_SIZES = [
	// 1280 x 720.
	// HD aspect ratio.
	{
		name: 'maxresdefault',
		width: 1280,
		height: 720
	},
	// 640 x 480.
	// non-HD aspect ratio.
	{
		name: 'sddefault',
		width: 640,
		height: 480
	},
	// Many videos don't have `maxresdefault`/`sddefault`.
	// 480 x 360.
	{
		name: 'hqdefault',
		width: 629,
		height: 472
	},
	// The smallest one.
	// 320 x 180.
	{
		name: 'mqdefault',
		width: 320,
		height: 180
	}
]

// A YouTube preview stub image when a preview size is not present.
const PREVIEW_NOT_FOUND_PICTURE_SIZE = {
	width: 120,
	height: 90
}

// - Supported YouTube URL formats:
//   - http://www.youtube.com/watch?v=My2FRPA3Gf8
//   - http://youtu.be/My2FRPA3Gf8
export default
{
	parse: async function(url, options) {
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
			if (options.youTubeApiKey) {
				try {
					const response = await fetch(`https://content.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${id}&key=${options.youTubeApiKey}`)
					const json = await response.json()
					const { snippet, contentDetails } = json.items[0]
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
				} catch (error) {
					console.error(error)
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
		for (const size of PREVIEW_PICTURE_SIZES) {
			try {
				const url = getPictureSizeURL(id, size.name)
				const imageSize = await getImageSize(url)
				if (imageSize.width === PREVIEW_NOT_FOUND_PICTURE_SIZE.width) {
					throw new Error(`YouTube preview size "${size.name}" not found for video "${id}"`)
				}
				return {
					type: 'image/jpeg',
					sizes: [{
						url,
						...imageSize
					}]
				}
			} catch (error) {
				console.error(error)
			}
		}
		console.error(`No picture found for YouTube video "${id}"`)
		return {
			type: 'image/jpeg',
			sizes: [{
				...PREVIEW_NOT_FOUND_PICTURE_SIZE,
				url: getPictureSizeURL(id, PREVIEW_PICTURE_SIZES[0].name)
			}]
		}
		// throw new Error(`No picture found for YouTube video ${id}`)
	},

	getEmbeddedVideoURL(id, options = {}) {
		const parameters = {}
		if (options.autoPlay) {
			parameters.autoplay = 1
		}
		return `https://www.youtube.com/embed/${id}${getUrlQueryPart(parameters)}`
	},

	getVideoURL(id) {
		return `https://youtube.com/watch?v=${id}`
	}
}

const getPictureSizeURL = (id, sizeName) => `https://img.youtube.com/vi/${id}/${sizeName}.jpg`

// Copied from:
// https://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
function parseISO8601Duration(duration) {
	const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
	// An invalid case won't crash the app.
	if (!match) {
		console.error(`Invalid YouTube video duration: ${duration}`)
		return 0
	}
	const [
		hours,
		minutes,
		seconds
	] = match.slice(1).map(_ => _ ? parseInt(_.replace(/\D/, '')) : 0)
  return (hours * 60 + minutes) * 60 + seconds
}

if (parseISO8601Duration('PT1H') !== 3600) {
	throw new Error()
}

if (parseISO8601Duration('PT23M') !== 1380) {
	throw new Error()
}

if (parseISO8601Duration('PT45S') !== 45) {
	throw new Error()
}

if (parseISO8601Duration('PT1H23M') !== 4980) {
	throw new Error()
}

if (parseISO8601Duration('PT1H45S') !== 3645) {
	throw new Error()
}

if (parseISO8601Duration('PT1H23M45S') !== 5025) {
	throw new Error()
}