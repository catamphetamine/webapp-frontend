import { parseURL, parseQueryString } from './url'
import { getImageSize } from './image'
import { getUrlQueryPart } from './video-common'

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

/**
 *
 * Supported YouTube URL formats:
 * http://www.youtube.com/watch?v=My2FRPA3Gf8
 * http://youtu.be/My2FRPA3Gf8
 */
export default {
	/**
	 * Parses YouTube video URL (if it's a video URL).
	 * @param  {string} url
	 * @param  {object} options
	 * @return {object} [video] Returns `null` if the video doesn't exist. Returns `undefined` if it's not a YouTube video.
	 */
	parse: async function(url, options) {
		// Get video ID.
		let id
		const location = parseURL(url)
		if (location.hostname === 'www.youtube.com' || location.hostname === 'm.youtube.com') {
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
					video = await getVideoData(id, options.youTubeApiKey, options)
				} catch (error) {
					console.error(error)
				}
			}
			if (video === null) {
				return null
			}
			if (!video) {
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

	getEmbeddedVideoUrl(id, options = {}) {
		const parameters = {}
		if (options.autoPlay) {
			parameters.autoplay = 1
		}
		return `https://www.youtube.com/embed/${id}${getUrlQueryPart(parameters)}`
	},

	getVideoUrl(id) {
		return `https://youtube.com/watch?v=${id}`
	}
}

/**
 * Gets YouTube video info.
 * API method: https://developers.google.com/youtube/v3/docs/videos/list
 * Uses "contentDetails" (quota cost 2) and "snippet" (quota cost 2) parts.
 * "contentDetails" is for the video duration and aspect ratio.
 * "snippet" is for the video title and description.
 * "localization" (quota cost 2) part could theoretically be used
 * but it only returns the title/description for the requested locale, not for all of them.
 * YouTube has a quota limit of 1 million per day which translates to 250 000 videos per day.
 * They can track the "HTTP Referrer" so they will know if someone's using several keys
 * to bypass the quota. But perhaps they don't care much.
 * https://www.freakyjolly.com/youtube-data-api-v3-1m-units-limits-explained/
 * In their user agreement they stated that only "one project per client" may be used to
 * send API requests which would mean that creating multiple "projects"
 * (which means getting multiple keys) is considered a violation fo the user agreement.
 * https://stackoverflow.com/questions/43782892/extending-youtube-api-quota-with-limited-funds
 * Still, perhaps they don't care much.
 * "fileDetails" (quota cost 1) part could be used for getting video resolution
 * (`fileDetails.videoStreams[].widthPixels`) but it's available only to video owner.
 * Could alternatively use YouTube's unofficial "oembed" endpoint, like:
 * https://www.youtube.com/oembed?url=http://www.youtube.com/watch?v=INVdbXTuPVI
 * It returns video "title" and also `aspectRatio` = "width"/"height" (approximated).
 * But the `thumbnail_url` is incorrect. For example, for video ID "INVdbXTuPVI"
 * it says "thumbnail_url": "https://i.ytimg.com/vi/INVdbXTuPVI/hqdefault.jpg",
 * but the correct one is "https://i.ytimg.com/vi/INVdbXTuPVI/maxresdefault.jpg".
 * And also this "oembed" endpoint doesn't support neither CORS nor JSONP
 * so it's uncallable from a web browser (could be proxied though).
 * @param  {string} id
 * @param  {string} youTubeApiKey
 * @param  {object} options
 * @return {object} [video] Returns `null` if the video doesn't exist. Returns `undefined` if some error happened.
 */
async function getVideoData(id, youTubeApiKey, options) {
	const response = await fetch(`https://content.googleapis.com/youtube/v3/videos?part=snippet,contentDetails${options.locale ? ',localizations' : ''}&id=${id}&key=${youTubeApiKey}${options.locale ? '&hl=' + options.locale : ''}`)
	const json = await response.json()
	if (json.items.length === 0) {
		console.error(`YouTube video "${id}" not found`)
		// `null` means "Video doesn't exist".
		return null
	}
	const { snippet, contentDetails } = json.items[0]
	const video = {
		title: options.locale ? snippet.localized.title : snippet.title,
		description: options.locale ? snippet.localized.description : snippet.description,
		duration: parseISO8601Duration(contentDetails.duration),
		// HD aspect ratio is 16:9 which is 1.777777777...
		// SD aspect ratio is 4:3 which is 1.3333333333...
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
	// YouTube doesn't return video width or height.
	switch (contentDetails.definition) {
		case 'hd':
			// HD aspect ratio is 16:9.
			// https://en.wikipedia.org/wiki/High-definition_television
			video.width = 1920
			video.height = 1080
			break
		case 'sd':
			// SD aspect ratio is 4:3.
			// https://en.wikipedia.org/wiki/Standard-definition_television
			video.width = 1440
			video.height = 1080
			break
	}
	return video
}

const getPictureSizeURL = (id, sizeName) => `https://img.youtube.com/vi/${id}/${sizeName}.jpg`

// Copied from:
// https://stackoverflow.com/questions/22148885/converting-youtube-data-api-v3-video-duration-format-to-seconds-in-javascript-no
function parseISO8601Duration(duration) {
	const match = duration.match(/P(\d+Y)?(\d+W)?(\d+D)?T(\d+H)?(\d+M)?(\d+S)?/)
	// An invalid case won't crash the app.
	if (!match) {
		console.error(`Invalid YouTube video duration: ${duration}`)
		return 0
	}
	const [
		years,
		weeks,
		days,
		hours,
		minutes,
		seconds
	] = match.slice(1).map(_ => _ ? parseInt(_.replace(/\D/, '')) : 0)
  return (((years * 365 + weeks * 7 + days) * 24 + hours) * 60 + minutes) * 60 + seconds
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

if (parseISO8601Duration('P43W5DT5M54S') !== 26438754) {
	throw new Error()
}

if (parseISO8601Duration('P1Y43W5DT5M54S') !== 57974754) {
	throw new Error()
}