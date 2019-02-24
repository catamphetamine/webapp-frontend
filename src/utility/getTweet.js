import fetchJsonp from 'fetch-jsonp'

import getTweetText from './getTweetText'

let counter = 1
/**
 * Returns tweet data.
 * Can return `undefined`.
 * Twitter has a proper API but that API is an OAuth one
 * meaning that a client has a special key which is used to obtain
 * the actual API access keys (which expire over time).
 * The "get API access key" endpoint doesn't allow CORS.
 * There are many discussions about that on StackOverflow,
 * Twitter just doesn't care. But the "/oembed" API endpoint
 * does allow CORS, and also doesn't require any API keys,
 * so it's much simpler to use. It returns an object of shape:
 * `{ url, html, author_url, author_name }`.
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