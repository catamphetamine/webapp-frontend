export default function searchContent(content, test, options = {}) {
	if (!Array.isArray(content)) {
		throw new Error('Non-array content passed to "searchContent"')
	}
	let i = options.backwards ? content.length - 1 : 0
	while (options.backwards ? i >= 0 : i < content.length) {
		if (typeof content[i] === 'string') {
			if (test(content[i], content, i)) {
				return [i]
			}
		} else if (content[i].content) {
			if (Array.isArray(content[i].content)) {
				// Recurse into child content.
				const indexes = searchContent(content[i].content, test, options)
				if (indexes) {
					return [i].concat(indexes)
				}
			} else {
				if (test(content[i].content)) {
					return [i]
				}
			}
		}
		// I can imagine some inline-level post parts not having `content`
		// being hypothetically added in some potential future (though unlikely).
		else  {
			console.error(`No "content" is present for an inline-level paragraph part at index ${i}`)
			console.error(content)
		}
		options.backwards ? i-- : i++
	}
}
