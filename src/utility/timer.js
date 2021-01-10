export function periodical(action, interval, delay = 0) {
	let cancelled = false

	const iterate = () => {
		if (cancelled) {
			return
		}
		const result = action()
		if (result && typeof result.then === 'function') {
			result.then(() => setTimeout(iterate, interval))
		} else {
			setTimeout(iterate, interval)
		}
	}

	setTimeout(iterate, delay)

	return () => cancelled = true
}