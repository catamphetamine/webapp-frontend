export default function getAttachmentTextWithoutSocial(attachment) {
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
		case 'audio':
			if (attachment.audio.author) {
				return `${attachment.audio.author} — ${attachment.audio.title}`
			}
			return attachment.audio.title
	}
}