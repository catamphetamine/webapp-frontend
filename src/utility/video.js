// - Supported YouTube URL formats:
//   - http://www.youtube.com/watch?v=My2FRPA3Gf8
//   - http://youtu.be/My2FRPA3Gf8
const YouTube =
{
	parse: async (url) =>
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
				provider: 'YouTube',
				id
			}
		}
	},

	getPicture: async (id) => {
		return {
			type: 'image/jpeg',
			sizes: [{
				url: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`,
				width: 1280,
				height: 720
			}]
		}
	},

	getEmbeddedVideoURL(id, options = {}) {
		return `https://www.youtube.com/embed/${id}`
	}
}

// - Supported Vimeo URL formats:
//   - http://vimeo.com/25451551
//   - http://player.vimeo.com/video/25451551
const Vimeo =
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
			return {
				provider: 'Vimeo',
				id
			}
		}
	},

	getPicture: async (id) =>
	{
		const response = await fetch(`http://vimeo.com/api/v2/video/${id}.json`)
		const data = response.json()
		console.log(data)
		return {
			type: 'image/jpeg',
			sizes: [{
				url: data[0].thumbnail_large,
				width: 0,
				height: 0
			}]
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

function parseURL(url)
{
	const link = document.createElement('a')
	link.href = url
	return link
}

function parseQueryString(queryString)
{
	return queryString.split('&').reduce((query, part) =>
	{
		const [key, value] = part.split('=')
		query[decodeURIComponent(key)] = decodeURIComponent(value)
		return query
	},
	{})
}

const VIDEO_PROVIDERS = {
	YouTube,
	Vimeo
}

// https://gist.github.com/yangshun/9892961
export async function parseVideoLink(url) {
	for (const provider of Object.keys(VIDEO_PROVIDERS)) {
		const result = await VIDEO_PROVIDERS[provider].parse(url)
		if (result) {
			return result
		}
	}
}

export async function getVideoPicture({ id, provider }) {
	return await VIDEO_PROVIDERS[provider].getPicture(id)
}

export function getEmbeddedVideoURL(id, provider) {
	return VIDEO_PROVIDERS[provider].getEmbeddedVideoURL(id)
}
