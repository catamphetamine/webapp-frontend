import getTweet, { getTweetId } from '../getTweet'
import visitPostParts from './visitPostParts'

/**
 * Transforms Twitter `link`s by inserting twitter text as link content,
 * and also attaches a "social" `attachment` to the `link`.
 * @param  {object} post
 * @return {void}
 */
export default async function loadTwitterLinks(post, options = {}) {
	const { messages } = options
	const result = await Promise.all(visitPostParts(
		'link',
		link => parseTwitterLink(link, { messages }),
		post.content
	))
	return result.findIndex(_ => _) >= 0
}

async function parseTwitterLink(link, { messages }) {
	if (link.service !== 'twitter') {
		return
	}
	if (link.attachment) {
		return
	}
	const tweetId = getTweetId(link.url)
	if (!tweetId) {
		return
	}
	const tweet = await getTweet(tweetId, { messages })
	if (tweet) {
		link.attachment = {
			type: 'social',
			social: tweet
		}
		if (tweet.content) {
			link.content = `${tweet.author.name} (@${tweet.author.id}): ${tweet.content}`
		}
		return true
	}
}