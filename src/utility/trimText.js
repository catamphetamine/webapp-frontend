import test from './trimText.test'

const END_OF_SENTENCE_PUNCTUATION = ['.', '?', '!', '\n']

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @return {string}
 */
export default function trimText(string, maxLength) {
	if (string.length <= maxLength) {
		return string
	}
	string = string.slice(0, maxLength)
	// Trim by end of sentence (if available).
	let lastSentenceEndsAtLongest
	let lastSentenceEndsAtLongestPunctuation
	for (const puctuation of END_OF_SENTENCE_PUNCTUATION) {
		const lastSentenceEndsAt = string.lastIndexOf(puctuation + (puctuation === '\n' ? '' : ' '))
		if (lastSentenceEndsAt >= 0) {
			if (!lastSentenceEndsAtLongest || lastSentenceEndsAt > lastSentenceEndsAtLongest) {
				lastSentenceEndsAtLongest = lastSentenceEndsAt
				lastSentenceEndsAtLongestPunctuation = puctuation
			}
		}
	}
	if (lastSentenceEndsAtLongest) {
		return string.slice(0, lastSentenceEndsAtLongest +
			(lastSentenceEndsAtLongestPunctuation === '\n' ? '' : lastSentenceEndsAtLongestPunctuation.length)
		)
	}
	// Trim by end of word (if available).
	const lastWordEndsAt = string.lastIndexOf(' ')
	if (lastWordEndsAt >= 0) {
		return string.slice(0, lastWordEndsAt) + ' ' + '…'
	}
	// Simple trim.
	return string + '…'
}

test(trimText)