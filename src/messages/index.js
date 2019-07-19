export default class Messages {
	constructor(messages, defaultLanguage) {
		this.messages = messages
		this.defaultLanguage = defaultLanguage
		// Add missing messages from default language messages.
		for (const language of Object.keys(messages)) {
			if (language !== defaultLanguage) {
				mergeMessages(messages[language], messages[defaultLanguage])
			}
		}
		this.languageNames = Object.keys(messages).reduce((all, language) => ({
			...all,
			[language]: messages[language].languageName || language
		}), {})
	}
	isSupportedLanguage = (language) => {
		return this.messages.hasOwnProperty(language)
	}
	getMessages = (language) => {
		if (this.messages.hasOwnProperty(language)) {
			return this.messages[language]
		}
		// Report the error to `sentry.io`.
		setTimeout(() => {
			throw new Error(`Unsupported language: ${language}`)
		}, 0)
		return this.messages[this.defaultLanguage]
	}
	getLanguageNames = () => {
		return this.languageNames
	}
}

/**
 * Deeply merges `from` messages into `to` messages.
 * `null` values in `to` mean "will stay empty".
 * @param  {object} to
 * @param  {object} from
 * @return {object} Mutates `to` and returns it for convenience.
 */
export function mergeMessages(to, from) {
	for (const key of Object.keys(from)) {
		// Skip `null`s.
		// For example, some phrases in English have no prefix
		// while in other languages they do.
		// For example, if a title contains a hyperlinked substring
		// the message has to be split into three substrings:
		// "before", "linked text" and "after".
		// English may not have the "before" part, for example.
		// In such cases it's explicitly marked as `null`.
		if (from[key] === null || to[key] === null) {
			continue
		}
		if (to[key] === undefined) {
			// Fill in missing keys.
			to[key] = from[key]
		} else if (typeof from[key] !== typeof to[key]) {
			// Replace strings with nested objects.
			to[key] = from[key]
		} else if (typeof from[key] !== 'string') {
			// Recurse into nested objects.
			mergeMessages(to[key], from[key])
		}
	}
	return to
}