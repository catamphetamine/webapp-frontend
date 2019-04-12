/**
 * Converts post content to text.
 * Removes `post-link`s and their autogenerated `inline-quotes`.
 * Can optionally ignore attachments (or skip them unless there's no text).
 * Can optionally exclude `quotes` and `inline-quote`s.
 * @param  {object} post
 * @param  {object} options — `{ softLimit, messages, excludeQuotes, ignoreAttachments, skipAttachments }`
 * @return {string}
 */
export default function getPostText(post, options = {}) {
	// Simple case optimization.
	if (typeof post.content === 'string') {
		return post.content
	}
	if (post.content) {
		// Concatenate post paragraphs' text.
		let text = ''
		let softLimit = options.softLimit
		for (const block of post.content) {
			const blockText = getContentText(block, softLimit, {
				...options,
				attachments: post.attachments
			}).trim()
			if (!blockText) {
				continue
			}
			if (text) {
				text += '\n\n'
			}
			text += blockText
			if (softLimit !== undefined) {
				softLimit -= blockText.length - countOccurrences(blockText, '\n')
				if (softLimit <= 0) {
					break
				}
			}
		}
		if (text) {
			return text
		}
	}
	// If there're any attachments then fall back to attachment text.
	if (post.attachments && !options.ignoreAttachments) {
		for (const attachment of post.attachments) {
			if (getAttachmentTitle(attachment)) {
				return getAttachmentTitle(attachment)
			}
		}
		if (options.messages) {
			for (const attachment of post.attachments) {
				if (getAttachmentMessage(attachment, options.messages)) {
					return getAttachmentMessage(attachment, options.messages)
				}
			}
		}
	}
	return ''
}

export function getContentText(content, softLimit, options = {}) {
	if (typeof content === 'string') {
		return content
	}
	if (Array.isArray(content)) {
		if (options.excludeQuotedPosts !== false) {
			content = removePostLinks(content)
		}
		if (options.excludeQuotes) {
			// Remove block-level quotes.
			content = removeQuotes(content)
		}
		let text = ''
		for (const part of content) {
			const partText = getContentText(part, softLimit, options)
			text += partText
			if (softLimit !== undefined) {
				softLimit -= partText.length - countOccurrences(partText, '\n')
				if (softLimit <= 0) {
					break
				}
			}
		}
		return text
	}
	const part = content
	const getContent = (property = 'content') => getContentText(part[property], softLimit, options)
	switch (part.type) {
		case 'quote':
			if (options.excludeQuotes) {
				return ''
			}
			if (part.source) {
				return `«${getContent()}» — ${part.source}`
			}
			return `«${getContent()}»`
		case 'inline-quote':
			return `«${getContent()}»`
		case 'spoiler':
			// https://www.w3schools.com/charsets/ref_utf_block.asp
			// ░ LIGHT SHADE
			// ▒ MEDIUM SHADE
			// ▓ DARK SHADE
			// █ FULL BLOCK
			// Also add "line break" characters
			// because otherwise in iOS Safari it would overflow.
			return '░\u200b'.repeat(getContent().length)
		case 'post-link':
			return `«${getContent('quote')}»`
		case 'link':
			if (part.autogenerated) {
				return getHumanReadableLinkAddress(part.url)
			}
			return part.content
		case 'monospace':
			if (!part.inline && options.excludeCodeBlocks) {
				if (options.messages && options.messages.code) {
					return '(' + options.messages.code.toLowerCase() + ')'
				}
				return ''
			}
			return getContent()
		case 'attachment':
			if (options.ignoreAttachments || options.skipAttachments) {
				return ''
			}
			const attachment = options.attachments.find(_ => _.id === part.attachmentId)
			if (!attachment) {
				return ''
			}
			const title = getAttachmentTitle(attachment)
			if (title) {
				return title
			}
			if (options.skipUntitledAttachments) {
				return ''
			}
			if (!options.messages) {
				return ''
			}
			return getAttachmentMessage(attachment, options.messages) || ''
		default:
			return getContent()
	}
}

export function removeQuotes(content) {
	const newContent = removeQuote(content)
	if (newContent === content) {
		return content
	}
	return removeQuote(newContent)
}

export function removePostLinks(content) {
	const newContent = removePostLink(content)
	if (newContent === content) {
		return content
	}
	return removePostLinks(newContent)
}

function removeQuote(content) {
	const inlineQuote = content.find(part => typeof part === 'object' && part.type === 'inline-quote')
	if (inlineQuote) {
		const inlineQuoteIndex = content.indexOf(inlineQuote)
		const hasNewLine = content[inlineQuoteIndex + 1] === '\n'
		return content.slice(0, inlineQuoteIndex).concat(content.slice(inlineQuoteIndex + (hasNewLine ? 2 : 1)))
	}
	const quote = content.find(part => typeof part === 'object' && part.type === 'quote')
	if (quote) {
		const quoteIndex = content.indexOf(quote)
		return content.slice(0, quoteIndex).concat(content.slice(quoteIndex + 1))
	}
	return content
}

function removePostLink(content) {
	const postLink = content.find(part => typeof part === 'object' && part.type === 'post-link')
	if (!postLink) {
		return content
	}
	const postLinkIndex = content.indexOf(postLink)
	let hasNewLine = false
	let hasAutomaticQuote = false
	let hasNewLineAfterAutomaticQuote = false
	if (content[postLinkIndex + 1] === '\n') {
		hasNewLine = true
		const possibleAutomaticQuote = content[postLinkIndex + 2]
		if (typeof possibleAutomaticQuote === 'object' && possibleAutomaticQuote.autogenerated) {
			hasAutomaticQuote = true
			if (content[postLinkIndex + 3] === '\n') {
				hasNewLineAfterAutomaticQuote = true
			}
		}
	}
	return content.slice(0, postLinkIndex).concat(content.slice(
		hasAutomaticQuote ?
			(hasNewLineAfterAutomaticQuote ? postLinkIndex + 4 : postLinkIndex + 3) :
			(hasNewLine ? postLinkIndex + 2 : postLinkIndex + 1)
	))
}

function getAttachmentTitle(attachment) {
	switch (attachment.type) {
		case 'picture':
			if (attachment.picture.title) {
				return attachment.picture.title
			}
			break
		case 'video':
			if (attachment.video.title) {
				return attachment.video.title
			}
			break
	}
}

function getAttachmentMessage(attachment, messages) {
	switch (attachment.type) {
		case 'picture':
			return messages.picture
		case 'video':
			return messages.video
	}
}

function getHumanReadableLinkAddress(url) {
	try {
		url = decodeURI(url)
	} catch (error) {
		// Sometimes throws "URIError: URI malformed".
		console.error(error)
	}
	return url
		// Remove `https://www.` in the beginning.
		.replace(/^https?:\/\/(www\.)?/, '')
		// Remove `/` in the end.
		.replace(/\/$/, '')
}

function countOccurrences(string, character) {
	let count = 0
	for (const char of string) {
		if (char === character) {
			count++
		}
	}
	return count
}