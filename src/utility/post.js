import expectToEqual from './expectToEqual'

/**
 * Converts post content to text.
 * @param  {object} post
 * @return {string}
 */
export function getPostText(post) {
	if (!post.content) {
		return ''
	}
	// Simple case optimization.
	if (typeof post.content === 'string') {
		return post.content
	}
	// Concatenate post paragraphs' text.
	return post.content.map(getContentText).join('\n\n')
}

function getContentText(content) {
	if (Array.isArray(content)) {
		return removePostLinks(content).map(getContentText).join('')
	}
	if (typeof content === 'string') {
		return content
	}
	const part = content
	content = part.content
	switch (part.type) {
		case 'quote':
			if (part.source) {
				return `«${content}» — ${part.source}`
			}
			return `«${content}»`
		case 'inline-quote':
			return `«${content}»`
		case 'spoiler':
			return `(${content})`
		default:
			return content
	}
}

function removePostLinks(content) {
	const newContent = removePostLink(content)
	if (newContent === content) {
		return content
	}
	return removePostLink(newContent)
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
		if (typeof possibleAutomaticQuote === 'object' && possibleAutomaticQuote.automaticInReplyToQuote) {
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

function getPostTextTest(content, text) {
	expectToEqual(getPostText({ content }), text)
}

getPostTextTest(
	'Abc',
	'Abc'
)

getPostTextTest(
	['Abc'],
	'Abc'
)

getPostTextTest(
	[['Abc']],
	'Abc'
)

getPostTextTest(
	['Abc', 'Def'],
	'Abc\n\nDef'
)

getPostTextTest(
	[['Abc', 'Def']],
	'AbcDef'
)

getPostTextTest(
	[['Abc', '\n', 'Def']],
	'Abc\nDef'
)

function removePostLinksTest(content, text) {
	expectToEqual(removePostLinks(content), text)
}

removePostLinksTest(
	[
		{
			type: 'post-link',
			content: 'Сообщение'
		},
		'\n',
		{
			type: 'inline-quote',
			content: 'Quote'
		},
		'\n',
		'abc'
	],
	[
		{
			type: 'inline-quote',
			content: 'Quote'
		},
		'\n',
		'abc'
	]
)

removePostLinksTest(
	[
		{
			type: 'post-link',
			content: 'Сообщение'
		},
		'\n',
		{
			type: 'inline-quote',
			content: 'Quote',
			automaticInReplyToQuote: true
		},
		'\n',
		'abc'
	],
	[
		'abc'
	]
)

removePostLinksTest(
	[
		{
			type: 'post-link',
			content: 'Сообщение'
		},
		'\n',
		{
			type: 'inline-quote',
			content: 'Quote',
			automaticInReplyToQuote: true
		},
		'\n',
		{
			type: 'post-link',
			content: 'Сообщение'
		},
		'\n',
		{
			type: 'inline-quote',
			content: 'Quote',
			automaticInReplyToQuote: true
		},
		'\n',
		'abc'
	],
	[
		'abc'
	]
)