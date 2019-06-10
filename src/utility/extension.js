import { getObject, setObject } from './localStorage'
import loadScript from './loadScript'
import loadStylesheet from './loadStylesheet'

// ------------- Application API starts ---------------

/**
 * Installs an extension from `url`.
 * Adds the extension to the list of extensions
 * and runs the extension install script.
 * Can't be called concurrently for multiple extensions at once.
 * @param  {string} url — Extension install script URL.
 * @return {Promise}
 */
export function installExtension(url) {
	return scriptRunner.run(transformInstallUrl(url))
}

/**
 * Runs all installed extensions.
 * Can be called at application initialization time.
 */
export function runExtensions() {
	const extensions = getObject('extensions', [])
	for (const extension of extensions) {
		try {
			runExtension(extension)
		} catch (error) {
			console.error(error)
		}
	}
}

// Defines Extension API on `window` for use by extensions.
if (typeof window !== 'undefined') {
	defineExtensionApi(window)
}

// ------------- Application API ends ---------------

/**
 * Runs a script from a `url`.
 * Doesn't allo concurrent script running.
 */
const scriptRunner = {
	url: undefined,
	onLoad: undefined,
	run(url) {
		if (this.url) {
			throw new Error('A script is already running')
		}
		this.url = url
		return loadScript(url, resolve => this.onLoad = resolve).then(
			() => this.reset(),
			() => this.reset()
		)
	},
	reset() {
		this.url = undefined
		this.onLoad = undefined
	}
}

function transformInstallUrl(url) {
	const match = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)/
	if (match) {
		return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/master/index.json`
	}
	return url
}

export function runExtension(extension) {
	switch (extension.type) {
		case 'script':
			loadScript(extension.contentUrl)
			break
		case 'style':
			loadStylesheet(extension.contentUrl)
			break
		default:
			throw new Error(`Unsupported extension type:\n${JSON.stringify(extension, null, 2)}`)
	}
}

/**
 * Defines extension API.
 * (the API that can only be called by extensions)
 */
function defineExtensionApi(context) {
	context.Extension = {
		/**
		 * Installs extension.
 		 * Can only be called by the extension install script: `Extension.install(extensionInfo)`.
 		 * Can only be called after `installExtension(url)` has been called by the application.
 		 * Adds `extension` to the list of installed extensions in `localStorage`.
		 * @param {object} extension.
		 */
		install(extensionInfo) {
			// Extension info possible fields:
			// {
			// 	id, // Required.
			// 	name, // Required.
			// 	description, // Required.
			// 	version, // Required.
			// 	homepage, // Required.
			// 	author, // Author name.
			// 	contacts: ["example@example.com", ...], // Author email, author messenger id, or whatever else.
			// 	type, // Required. Either "script" or "style".
			// 	url, // Will be set automatically.
			// 	content?, // Either `content` or `contentUrl` are required.
			// 	contentUrl?, // Either `content` or `contentUrl` are required.
			// 	license
			// }
			// Add extension to the list of extensions in `localStorage`.
			const extensions = getObject('extensions', [])
			extensions.push({
				...extensionInfo,
				url: scriptRunner.url
			})
			setObject('extensions', extensions)
			// Run the "on extension installation finished" callback.
			scriptRunner.onLoad()
		}
	}
}