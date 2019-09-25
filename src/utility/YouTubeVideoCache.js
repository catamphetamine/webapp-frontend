import { PREVIEW_PICTURE_SIZES, getPictureSizeUrl } from 'social-components/commonjs/services/YouTube/getVideo'
import { LocalStorageCache } from './LRUCache'
import { areCookiesAccepted } from './cookiePolicy'

let cache
if (typeof window !== 'undefined') {
	cache = new LocalStorageCache(1000, 'youtube')
}

export function cacheVideo(video) {
	if (cache && areCookiesAccepted()) {
		return cache.set(video.id, archiveVideo(video))
	}
}

export function getVideoFromCache(id) {
	if (cache) {
		const cachedVideo = cache.get(id)
		if (cachedVideo) {
			return unarchiveVideo(id, cachedVideo)
		}
	}
}

export function clearCache() {
	if (cache) {
		cache.clear()
	}
}

// An archived video is about 100 bytes in size.
// An unarchived video is about 400 bytes in size.
export function archiveVideo(video) {
	return [
		video.title,
		video.duration,
		video.width,
		video.height,
		video.aspectRatio === 16/9 ? 1 : 0,
		video.picture ? [video.picture].concat(video.picture.sizes || []).map(archivePictureSize) : []
	]
}

function archivePictureSize(size) {
	for (const standardSize of PREVIEW_PICTURE_SIZES) {
		if (size.width === standardSize.width &&
			size.height === standardSize.height &&
			size.url.indexOf(standardSize.name + '.jpg') > 0) {
			return standardSize.name
		}
	}
	return [
		size.width,
		size.height,
		size.url
	]
}

export function unarchiveVideo(id, archive) {
	const [
		title,
		duration,
		width,
		height,
		hd,
		pictureSizes
	] = archive
	const sizes = pictureSizes.map(size => unarchivePictureSize(size, id))
	const video = {
		id,
		provider: 'YouTube',
		title,
		duration,
		width,
		height,
		aspectRatio: hd ? 16/9 : (width && height ? width / height : 4/3),
		picture: sizes.length > 0 ? sizes.shift() : undefined
	}
	if (sizes.length > 0) {
		video.picture.sizes = sizes
	}
	return video
}

function unarchivePictureSize(size, videoId) {
	if (typeof size === 'string') {
		const standardSize = PREVIEW_PICTURE_SIZES.filter(_ => _.name === size)[0]
		size = {
			width: standardSize.width,
			height: standardSize.height,
			url: getPictureSizeUrl(videoId, standardSize.name)
		}
	} else {
		const [
			width,
			height,
			url
		] = size
		size = {
			width,
			height,
			url
		}
	}
	size.type = 'image/jpeg'
	return size
}