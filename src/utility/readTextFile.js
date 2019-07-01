export default function readTextFile(file) {
	return new Promise((resolve) => {
		const reader = new FileReader()
		reader.onload = (event) => {
			resolve(event.target.result)
		}
		// reader.readAsDataURL(file)
		reader.readAsText(file, 'utf-8')
	})
}