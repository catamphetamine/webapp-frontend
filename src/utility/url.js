// Only on client side.
export function parseURL(url)
{
	const link = document.createElement('a')
	link.href = url
	return link
}

export function parseQueryString(queryString)
{
	return queryString.split('&').reduce((query, part) =>
	{
		const [key, value] = part.split('=')
		query[decodeURIComponent(key)] = decodeURIComponent(value)
		return query
	},
	{})
}