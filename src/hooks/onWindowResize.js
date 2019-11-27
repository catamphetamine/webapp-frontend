import { useEffect } from 'react'
import throttle from 'lodash/throttle'

export default function onWindowResize(callback, options) {
	useEffect(() => {
		if (options && options.alsoOnMount) {
			callback()
		}
		const onWindowResize = throttle((event) => callback(), 100)
		window.addEventListener('resize', onWindowResize)
		return () => {
			window.removeEventListener('resize', onWindowResize)
		}
	}, [])
}