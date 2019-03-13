export default function splitContent(content, indexes, options = {}, isRoot = true) {
	let left = []
	let right = []
	let i = 0
	while (i < content.length) {
		if (i === indexes[0]) {
			// If the final split point reached.
			if (indexes.length === 1) {
				if (options.include !== false) {
					if (options.transform) {
						const result = options.transform(content[i])
						if (result) {
							left.push(result)
						}
					} else {
						left.push(content[i])
					}
				}
				// Skip the "\n"s.
				if (options.skip) {
					i += options.skip
				}
			} else {
				const [one, two] = splitContent(content[i].content, indexes.slice(1), options, false)
				if (one) {
					left.push({
						...content[i],
						content: one
					})
				}
				if (two) {
					right.push({
						...content[i],
						content: two
					})
				}
			}
		} else if (i < indexes[0]) {
			left.push(content[i])
		} else {
			right.push(content[i])
		}
		i++
	}
	return [normalize(left, isRoot), normalize(right, isRoot)]
}

function normalize(content, isRoot) {
	if (content.length === 0) {
		return
	}
	if (!isRoot) {
		if (content.length === 1 && typeof content[0] === 'string') {
			return content[0]
		}
	}
	return content
}