import expectToEqual from './expectToEqual'

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

function test(input, maxLength, output) {
	expectToEqual(trimText(input, maxLength), output)
}

const text = 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games Store.'
test(text, text.length - 1, 'Сергей Галёнкин заявил, что блогеры-участники программы Support-A-Creator получили по три бесплатных игры из стартовой линейки Epic Games …')

test('A b c. D e f. G h', 17, 'A b c. D e f. G h')
test('A b c. D e f. G h', 16, 'A b c. D e f.')
test('A b c. D e f. G', 12, 'A b c.')
test('A b c. D e f. G', 6, 'A b …')
test('A b c. D e f. G', 4, 'A b …')
test('A b c. D e f. G', 3, 'A …')
test('A b c. D e f. G', 2, 'A …')
test('A b c. D e f. G', 1, 'A…')
test('A b c. D e f. G', 0, '…')

test('Abc.', 2, 'Ab…')
test('Abc? Def.', 7, 'Abc?')
test('Abc! Def.', 7, 'Abc!')

test('Abc. Def? Ghi', 12, 'Abc. Def?')
test('Abc. Def! Ghi', 12, 'Abc. Def!')

test('A b c\nD e f\nG h i', 16, 'A b c\nD e f')