// Operating Systems usually employ their own file write cache:
//
// * Windows: NTFS filesystem runs a "lazy writer" every second.
//   https://docs.microsoft.com/en-us/windows/win32/fileio/file-caching
//
// * Linux: etx4 filesystem has a 5-second journal write interval.
//   https://superuser.com/questions/479379/how-long-can-file-system-writes-be-cached-with-ext4
//
// Still, `fsync()` is used by some software to bypass OS caching.
// For example, Chromium uses `fsync()` when writing stuff to disk.
// https://bugs.chromium.org/p/chromium/issues/detail?id=176727#c203
//
// Chromium itself seems to also employ a 5-sec-interval `localStorage` write-limiting strategy:
// https://bugs.chromium.org/p/chromium/issues/detail?id=52663#c161
// https://chromium.googlesource.com/chromium/src/+/770daec923bb61392afbf9ca16ee0dad147e154f
// It's not guaranteed though that other browsers do something like that.
//
// Chromium uses SQLite for storing `localStorage` data.
// Except writing to `localStorage`, Chromium also writes a lot of other stuff:
// visited links history, static files cache for every web page, and maybe some other things.
//
// Some related links:
// https://bugs.chromium.org/p/chromium/issues/detail?id=176727#c194
// https://bugs.chromium.org/p/chromium/issues/detail?id=176727#c211
//
// To monitor disk writes on Windows, one could use the "Resource Monitor" app.
// For example, when idle, chrome writes about 200 KB per second of data,
// that would be about 17 GB of data per day. That's a lot.
// Operating system also writes about 200 KB per second or so.

import LocalStorage from './LocalStorage'

/**
 * `CachedLocalStorage` is periodically saved ("flushed").
 * This presumably prevents too much SSD/HDD writes of `localStorage`.
 * The data is "flushed" not less than the configured period of time,
 * and also when the page becomes not "visible".
 * Visibility API: https://golb.hplar.ch/2019/07/page-visibility-api.html
 *
 * It's not specified, how a web browser manages saving to `localStorage`:
 * does it save it to disk every time when `.setItem()` is called?
 * Or does it somehow cache it and the "flush" to the disk later?
 * If yes, then how often does it "flush"?
 * A modern user-land SSD could sustain, for example, about 1000 write cycles:
 * https://www.enterprisestorageforum.com/storage-hardware/ssd-lifespan.html
 * Web browsers do write to disk quite often (for example, to history
 * on every navigation, or to cache), and the Operating System itself does
 * (for example, swap file, log files, etc).
 * Maybe such optimization isn't required at all and it's normal
 * to write to `localStorage` every second or so.
 *
 * Usage example: `captchan` calls `.set()` on each "read" comment,
 * which could be a lot of `.set()`s over a short period of time
 * when a user scrolls through a thread.
 *
 * In order for the "caching" mechanism to work, the `cache: true`
 * option should be passed when calling `.set(key, value)`.
 * Otherwise, the storage will act as a regular local storage.
 *
 * `cache: true` option can only be passed in cases when a tab has
 * an exclusive lock for writing to the `key`. Otherwise, if some
 * other tab writes a `value` to the same `key` while the current tab
 * has some cached `value` which hasn't been written yet, then, when
 * the cache is flushed, the more recent `value` that has been written
 * by the other tab gets overwritten by the current page's cached `value`.
 *
 * `captchan` uses `cache: true` option when writing `latestReadComments`
 * because only the current tab can do that by design.
 */

export default class CachedLocalStorage extends LocalStorage {
	constructor(options) {
		super(options)
		this.options = {
			leadingWrite: false,
			flushInterval: 30 * 1000,
			...options
		}
		this.cache = {}
		this.previouslyFlushedAt = 0
		// Uses Visibility API to detect the current tab being
		// closed, navigated from, switched from, minimized
		// (including going into background on mobile phones).
		// https://golb.hplar.ch/2019/07/page-visibility-api.html
		// When a tab is closed, web browsers emit `visibilitychange: "hidden"` event.
		// Exceptions: Android 4.4 and before, desktop Safari < 13 when closing a tab by clicking "x".
		// https://github.com/fusionjs/fusion-plugin-universal-events/pull/158#issuecomment-450958837
		// https://github.com/GoogleChromeLabs/page-lifecycle/issues/2
		document.addEventListener('visibilitychange', this.onVisibilityChange)
		// On mobile (at least on iPhones), all browsers (Safari, Chrome, Firefox)
		// have a bug: they don't emit a "visibilitychange" event on page refresh.
		// A workaround is to listen to "pagehide" event.
		// https://developer.mozilla.org/en-US/docs/Web/API/Window/pagehide_event
		window.addEventListener('pagehide', this.flush)
	}

	/**
	 * `.unload()` should be called when the storage instance will no longer be used.
	 */
	unload() {
		document.removeEventListener('visibilitychange', this.onVisibilityChange)
		window.removeEventListener('pagehide', this.flush)
	}

	onVisibilityChange = () => {
		switch (document.visibilityState) {
			case 'hidden':
				this.flush()
				break
		}
	}

	get(key, defaultValue) {
		// Because a browser tab flushes its cache
		// when a user switches to another tab,
		// a background tab will always skip this `if` block
		// and will read directly from `localStorage`.
		if (this.cache.hasOwnProperty(key)) {
			// console.log(`debug: [localStorage] get value from cache for key "${key}"`, this.cache[key])
			return this.cache[key]
		}
		return super.get(key, defaultValue)
	}

	set(key, value) {
		if (this.shouldCache(key)) {
			// console.log(`debug: [localStorage] cache value for key "${key}"`, value)
			// if (this.cache.hasOwnProperty(key) && this.cache[key] === value) {
			// 	// The value didn't change.
			// } else {
				this.cache[key] = value
				this.scheduleFlush()
			// }
		} else {
			super.set(key, value)
		}
	}

	delete(key) {
		if (this.cache.hasOwnProperty(key)) {
			delete this.cache[key]
		}
		super.delete(key)
	}

	flush = () => {
		// console.log(`debug: [localStorage] flush`)
		for (const key of Object.keys(this.cache)) {
			super.set(key, this.cache[key])
		}
		this.cache = {}
		this.previouslyFlushedAt = Date.now()
		if (this.flushTimer) {
			clearTimeout(this.flushTimer)
			this.flushTimer = undefined
		}
	}

	/**
	 * Marks `key` as cached.
	 * @param  {string} key
	 */
	cacheKey(key) {
		this.options.cachedKeys = (this.options.cachedKeys || []).concat(key)
	}

	/**
	 * Checks if a `key` should be cached.
	 * @param  {string} key
	 * @return {boolean}
	 */
	shouldCache(key) {
		if (!this.options.cachedKeys || !this.options.cachedKeys.includes(key)) {
			return false
		}
		if (this.flushTimer) {
			return true
		}
		if (this.options.leadingWrite) {
			const interval = Date.now() - this.previouslyFlushedAt
			if (interval > this.options.flushInterval) {
				return false
			}
		}
		return true
	}

	scheduleFlush() {
		if (!this.flushTimer) {
			this.flushTimer = setTimeout(this.flush, this.options.flushInterval)
		}
	}
}