import { saveAs } from 'file-saver'

/**
 * Saves a file on client side.
 * @param  {string} data
 * @param  {string} filename
 */
export default function saveFile(data, filename) {
	saveAs(
		new Blob([data], {
			type: 'text/plain;charset=utf-8'
		}),
		filename
	)
}