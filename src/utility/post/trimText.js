import findLastSentenceEnd from './findLastSentenceEnd'

// New line cost is 30.
// Same as in `generatePostPreview.js`.
const NEW_LINE_COST = 30
const MIN_LAST_LINE_CHARACTERS = 20

/**
 * Trims a string if it exceeds the maximum length.
 * Trims at sentence endings when available,
 * trims as-is otherwise (appending an ellipsis).
 * @param  {string} string
 * @param  {number} maxLength
 * @return {string}
 */
export default function trimText(string, maxLength, options) {
	let method
	if (typeof options === 'string') {
		method = options
		options = undefined
	} else {
		if (options) {
			method = options.method
		}
	}
	if (options && options.countNewLines) {
		const lines = string.split('\n').filter(_ => _)
		string = ''
		let pointsLeft = NEW_LINE_COST + maxLength
		for (let line of lines) {
			pointsLeft -= NEW_LINE_COST
			if (pointsLeft < MIN_LAST_LINE_CHARACTERS &&
				// The first line always skips this rule.
				maxLength >= MIN_LAST_LINE_CHARACTERS) {
				break
			}
			if (pointsLeft < 0) {
				break
			}
			if (line.length > pointsLeft) {
				line = _trimText(line, pointsLeft, method)
			}
			if (!line) {
				break
			}
			string += '\n'
			string += line
			pointsLeft -= line.length
		}
		// Remove the leading `\n`.
		return string.slice('\n'.length)
	} else {
		return _trimText(string, maxLength, method)
	}
}

function _trimText(string, maxLength, method) {
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

function trimByEndOfSentence(string, options) {
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
			// and when trimming by "end of sentence"
			// it could return, for example, `"Abc.\n"`.
			// Such whitespace at the end should be trimmed.
			.replace(/\s*$/, '')
	}
}