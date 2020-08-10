import { PREVIEW_PICTURE_SIZES, getPictureSizeUrl } from 'social-components/commonjs/services/YouTube/getVideo'
import { LocalStorageCache } from './FIFOCache'
import { areCookiesAccepted } from '../cookiePolicy'

let cache
if (typeof window !== 'undefined') {
	// An single cached video is about 100 bytes in size (tested on a 1000 cached videos).
	// The cache size is, therefore, about 100 KB.
	cache = new LocalStorageCache(1000, 'youtube')
}

function cacheVideo(id, video) {
	if (cache && areCookiesAccepted()) {
		// Video is `null` when it's "Not found".
		return cache.set(id, video && archiveVideo(video))
	}
}

function getVideoFromCache(id) {
	if (cache) {
		const cachedVideo = cache.get(id)
		if (cachedVideo) {
			return unarchiveVideo(id, cachedVideo)
		}
		// Video is `null` when it's "Not found".
		return cachedVideo
	}
}

export function clearCache() {
	if (cache) {
		cache.clear()
	}
}

// An archived video is about 100 bytes in size (tested on a 1000 cached videos).
// An unarchived video is about 400 bytes in size.
// (`export` is just for testing)
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

// (`export` is just for testing)
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

export default {
	put: (id, video) => cacheVideo(id, video),
	get: (id) => getVideoFromCache(id)
}