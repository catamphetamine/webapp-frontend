// `getAttachmentText()` already uses `getSocialText()`
// so using `getAttachmentTextWithoutSocial()` here to avoid circular dependency.
import getAttachmentTextWithoutSocial from './getAttachmentTextWithoutSocial'
import getAttachmentMessage from './getAttachmentMessage'

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
		return social.content
	}
	if (social.attachments) {
		for (const attachment of social.attachments) {
			const text = getAttachmentTextWithoutSocial(attachment, messages)
			if (text) {
				return text
			}
		}
		if (messages) {
			for (const attachment of social.attachments) {
				if (getAttachmentMessage(attachment, messages)) {
					return getAttachmentMessage(attachment, messages)
				}
			}
		}
	}
}