// `getAttachmentText()` already uses `getSocialText()`
// so using `getAttachmentTextWithoutSocial()` here to avoid circular dependency.
import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial'
import getAttachmentMessage from './getAttachmentMessage'

// These may be passed as `options`.
const LEFT_QUOTE = '«'
const RIGHT_QUOTE = '»'

/**
 * Generates a text-only representation of a `social`.
 * @param  {object} social
 * @param  {object} [messages]
 * @return {string}
 */
export default function getSocialText(social, messages) {
	const author = getSocialAuthorText(social)
	const content = getSocialContentText(social, messages)
	if (content) {
		return `${author}: ${content}`
	}
	return author
}

function getSocialAuthorText(social) {
	if (social.author.name) {
		if (social.author.id) {
			return `${social.author.name} (@${social.author.id})`
		} else {
			return social.author.name
		}
	} else {
		return `@${social.author.id}`
	}
}

function getSocialContentText(social, messages) {
	if (social.content) {
		return `${LEFT_QUOTE}${social.content}${RIGHT_QUOTE}`
	}
	if (social.attachments) {
		for (const attachment of social.attachments) {
			const text = getAttachmentTextWithoutSocial(attachment, messages)
			if (text) {
				return text
			}
		}
		if (messages && messages) {
			for (const attachment of social.attachments) {
				if (getAttachmentMessage(attachment, messages)) {
					return getAttachmentMessage(attachment, messages)
				}
			}
		}
	}
}