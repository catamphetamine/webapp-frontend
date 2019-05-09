import { getObject, setObject } from './localStorage'
import loadScript from './loadScript'
import loadStylesheet from './loadStylesheet'

let onScriptLoaded
let onPageRenderListeners = []
let installedExtensionUrl

function resetExtensionInstall() {
	installedExtensionUrl = undefined
	onScriptLoaded = undefined
}

function setOnScriptLoaded(callback) {
	onScriptLoaded = callback
}

export function installExtension(url) {
	if (installedExtensionUrl) {
		throw new Error('Extension install pending')
	}
	url = transformInstallUrl(url)
	installedExtensionUrl = url
	return loadScript(url, setOnScriptLoaded).then(resetExtensionInstall, resetExtensionInstall)
}

function transformInstallUrl(url) {
	const match = /^https:\/\/github.com\/([^\/]+)\/([^\/]+)/
	if (match) {
		return `https://raw.githubusercontent.com/${match[1]}/${match[2]}/master/index.json`
	}
	return url
}

function install(extension) {
	// {
	// 	id,
	// 	name,
	// 	description,
	// 	version,
	// 	homepage,
	// 	author,
	// 	contacts: [''],
	// 	license,
	// 	type,
	// 	url,
	// 	content?,
	// 	contentUrl?
	// }
	const extensions = getObject('extensions', [])
	extensions.push({
		...extension,
		url: installedExtensionUrl
	})
	setObject('extensions', extensions)
	if (onScriptLoaded) {
		onScriptLoaded()
	}
}

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

function defineExtensionApi(context) {
	context.Extension = {
		install(extension) {
			install(extension)
		},
		onPageRender(listener) {
			onPageRenderListeners.push(listener)
		}
	}
}

export function onPageRender(location) {
	for (const listener of onPageRenderListeners) {
		listener(location)
	}
}

if (typeof window !== 'undefined') {
	defineExtensionApi(window)
}