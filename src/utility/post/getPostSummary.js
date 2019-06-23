import getPostText from './getPostText'
import trimText from './trimText'

export default function getPostSummary(post, { messages, maxLength, stopOnNewLine }) {
	let text = getPostText(post, {
		excludePostQuotes: true,
		excludeCodeBlocks: true,
		softLimit: maxLength,
		stopOnNewLine,
		// `messages` are optional.
		messages
	})
	// If the generated post preview is empty
	// then loosen the filters and include quotes.
	// Code blocks are replaced with "(code)".
	if (!text) {
		text = getPostText(post, {
			excludePostQuotes: false,
			excludeCodeBlocks: true,
			softLimit: maxLength,
			stopOnNewLine,
			// `messages` are optional.
			messages
		})
		// If the generated post preview is empty
		// then loosen the filters and include quotes.
		// Code blocks are always replaced with "(code)".
		if (!text) {
			text = getPostText(post, {
				excludePostQuotes: false,
				excludeCodeBlocks: false,
				softLimit: maxLength,
				stopOnNewLine,
				// `messages` are optional.
				messages
			})
		}
	}
	if (text) {
		// Set `content.quote` to the quoted post text abstract.
		// Doesn't set `content.post` object to prevent JSON circular structure.
		// Compacts multiple paragraphs into multiple lines.
		return trimText(text, maxLength).replace(/\n\n+/g, '\n')
	}
}