import { getMinSize } from '../picture'

export function getThumbnailSize(attachment) {
	switch (attachment.type) {
		case 'picture':
			return getMinSize(attachment.picture)
		case 'video':
			return getMinSize(attachment.video.picture)
	}
}