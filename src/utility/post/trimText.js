import findLastSentenceEnd from './findLastSentenceEnd'

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @return {string}
 */
export default function trimText(string, maxLength, method) {
	if (string.length <= maxLength) {
		return string
	}
	string = string.slice(0, maxLength)
	// Trim by end of sentence.
	if (!method || method === 'sentence-end' || method === 'sentence-or-word-end') {
		const result = trimByEndOfSentence(string)
		if (result && result.length > 0.5 * maxLength) {
			return result
		}
	}
	// Trim by end of word (if available).
	if (!method || method === 'sentence-or-word-end') {
		const lastWordEndsAtPlusOne = string.lastIndexOf(' ')
		if (lastWordEndsAtPlusOne >= 0 && lastWordEndsAtPlusOne > 0.5 * maxLength) {
			return string.slice(0, lastWordEndsAtPlusOne).trim() + ' ' + '…'
		}
	}
	// Simple trim.
	if (!method) {
		return string + '…'
	}
}

function trimByEndOfSentence(string) {
	// Trim by end of sentence (if available).
	let trimAtIndex
	const lastNewLineIndex = string.lastIndexOf('\n')
	if (lastNewLineIndex >= 0) {
		trimAtIndex = lastNewLineIndex - 1
	}
	const lastEndOfSentenceIndex = findLastSentenceEnd(string)
	if (lastEndOfSentenceIndex >= 0) {
		if (trimAtIndex !== undefined) {
			trimAtIndex = Math.max(trimAtIndex, lastEndOfSentenceIndex)
		} else {
			trimAtIndex = lastEndOfSentenceIndex
		}
	}
	if (trimAtIndex !== undefined) {
		return string.slice(0, trimAtIndex + 1)
		// There may be sentences like "Abc.\n\nDef."
		// and without trimming at the end it would return `"Abc.\n"`.
		.replace(/\s*$/, '')
	}
}