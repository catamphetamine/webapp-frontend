import fetchJsonp from 'fetch-jsonp'

import getTweetText from './getTweetText'

let counter = 1
/**
 * Returns tweet data.
 * Can return `undefined`.
 * @param  {string} id
 * @param  {object} options — `{ messages }`
 * @return {object} [result] `{ url, text, authorName, authorUrl }`.
 */
export default async function getTweet(id, options) {
	if (counter === Number.MAX_SAFE_INTEGER) {
		counter = 1
	}
	try {
		const response = await fetchJsonp(`https://publish.twitter.com/oembed?url=https://twitter.com/Interior/status/${id}`, {
			jsonpCallbackFunction: `jsonp_twitter_${counter++}`
		})
		return parseTweet(await response.json(), options)
	} catch (error) {
		console.error(error)
		return
	}
}

export function parseTweet(json, options) {
	const text = getTweetText(json.html, options)
	if (!text) {
		return
	}
	return {
		url: json.url,
		text,
		authorName: json.author_name,
		authorUrl: json.author_url
	}
}