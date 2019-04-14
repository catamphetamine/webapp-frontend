import getTweet, { getTweetId } from '../getTweet'
import visitPostParts from './visitPostParts'

/**
 * Transforms Twitter `link`s by inserting twitter text as link content,
 * and also attaches a "social" `attachment` to the `link`.
 * @param  {object} post
 * @return {void}
 */
export default async function loadTwitterLinks(post, options = {}) {
	const result = await Promise.all(visitPostParts(
		'link',
		link => parseTwitterLink(link, options),
		post.content
	))
	return result.findIndex(_ => _) >= 0
}

async function parseTwitterLink(link, options) {
	if (link.service !== 'twitter') {
		return
	}
	if (link.attachment) {
		return
	}
	const tweet = await getTweet(getTweetId(link.url), options)
	if (tweet) {
		link.attachment = {
			type: 'social',
			provider: 'Twitter',
			text: tweet.text,
			date: tweet.date
		}
		if (tweet.text) {
			link.content = `${tweet.authorName} (@${tweet.authorId}): ${tweet.text}`
		}
		return true
	}
}