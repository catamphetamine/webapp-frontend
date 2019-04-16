// https://www.iana.org/assignments/media-types/media-types.xhtml
const MIME_TYPES = {
	// Picture.
	'svg': 'image/svg+xml',
	'jpg': 'image/jpeg',
	'jpeg': 'image/jpeg',
	'gif': 'image/gif',
	'png': 'image/png',
	'bmp': 'image/bmp',
	'webp': 'image/webp',
	// Video.
	'webm': 'video/webm',
	'mp4': 'video/mp4',
	'ogv': 'video/ogg',
	// Audio.
	'mp3': 'audio/mpeg',
	'ogg': 'audio/ogg',
	'flac': 'audio/flac',
	'opus': 'audio/opus',
	// Other.
	'7z': 'application/x-7z-compressed',
	'zip': 'application/zip',
	'pdf': 'application/pdf',
	'epub': 'application/epub+zip',
	'txt': 'text/plain'
}

/**
 * Gets MIME type by file URL (or filesystem path, or filename).
 * @param  {string} url File URL, or filesystem path, or filename, or just the "ext" part (dot extension).
 * @return {string} [mimeType] MIME type
 */
export default function getMimeType(url) {
	const urlParametersStartAt = url.indexOf('?')
	const endIndex = urlParametersStartAt >= 0 ? urlParametersStartAt : url.length
	const dotIndex = url.lastIndexOf('.', endIndex)
	if (dotIndex < 0) {
		return
	}
	const extension = url.slice(dotIndex + 1, endIndex)
	return MIME_TYPES[extension]
}