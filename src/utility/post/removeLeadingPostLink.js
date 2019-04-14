export default function removeLeadingPostLink(post, parentPost) {
	const content = removeLeadingPostLinkFromContent(post.content, parentPost.id)
	if (content === post.content) {
		return post
	}
	return {
		...post,
		content
	}
}

function removeLeadingPostLinkFromContent(content, parentPostId) {
	if (content) {
		const paragraph = content[0]
		if (Array.isArray(paragraph)) {
			const firstPart = paragraph[0]
			if (typeof firstPart === 'object' &&
				firstPart.type === 'post-link' &&
				(!(firstPart.quote || firstPart.quotes) || firstPart.quoteAutogenerated) &&
				firstPart.postId === parentPostId) {
				if (paragraph.length === 1) {
					if (content.length === 1) {
						return
					} else {
						return content.slice(1)
					}
				} else if (paragraph[1] === '\n') {
					if (paragraph.length === 2) {
						if (content.length === 1) {
							return
						} else {
							return content.slice(1)
						}
					} else {
						if (content.length === 1) {
							return [paragraph.slice(2)]
						} else {
							return [paragraph.slice(2)].concat(content.slice(1))
						}
					}
				}
			}
		}
	}
	return content
}