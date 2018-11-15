// Gets image size.
// Returns a `Promise`.
export function getImageSize(url) {
	return new Promise((resolve, reject) => {
		const image = new Image()
		image.onload = () => resolve({ width: image.width, height: image.height })
		image.onerror = reject
		image.src = url
	})
}

// export async function getImageSizes(urls) {
// 	const images = []
// 	for (const url of urls) {
// 		try {
// 			images.push({
// 				url,
// 				...(await getImageSize(url))
// 			})
// 		} catch (error) {
// 			console.error(error)
// 		}
// 	}
// 	return images
// }