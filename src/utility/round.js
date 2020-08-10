export function roundScreenPixels(value) {
	if (typeof window === 'undefined' || !window.devicePixelRatio) {
		return Math.round(value)
	}
	const step = 1 / window.devicePixelRatio
	let roundedValue = Math.floor(value)
	while (roundedValue < value - step / 2) {
		roundedValue += step
	}
	return roundedValue
}