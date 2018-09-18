export default function translate(messages, language, key, substitutes)
{
	let message = key.split('.').reduce((messages, key) => messages[key], messages[language])
	if (!substitutes) {
		return message
	}
	for (const key of Object.keys(substitutes)) {
		message = replaceAll(message, `{${key}}`, substitutes[key])
	}
	return message
}

function replaceAll(string, substring, substitute)
{
	const replacedString = string.replace(substring, substitute)
	if (replacedString === string) {
		return string
	}
	return replaceAll(replacedString, substring, substitute)
}