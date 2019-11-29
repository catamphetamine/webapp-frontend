import React, { useRef, useImperativeHandle, useEffect, useLayoutEffect, useCallback } from 'react'
import PropTypes from 'prop-types'

import { video } from '../PropTypes'

import loadScript from '../utility/loadScript'

function YouTubeVideo({
	video,
	width,
	height,
	autoPlay
}, ref) {
	const node = useRef()
	const player = useRef()
	const isReady = useRef()

	// Using `useLayoutEffect()` instead of `useEffect()` here
	// because iOS won't "auto play" videos unless requested
	// in the same "event loop" cycle as the user's interaction
	// (for example, a tap).
	// Still the behavior observed on my iPhone is non-deterministic:
	// sometimes YouTube videos auto play, sometimes they won't.
	// YouTube Player API docs are extremely unclear about that:
	// in which cases would auto play work, in which it wouldn't.
	// https://developers.google.com/youtube/iframe_api_reference#Autoplay_and_scripted_playback
	// So it's unclear whether using `useLayoutEffect()`
	// instead of `useEffect()` here makes any difference.
	useLayoutEffect(() => {
		// `player.current` won't have the instance methods
		// until it's in the "ready" state.
		player.current = new YT.Player(node.current, {
			width,
			height,
			videoId: video.id,
			playerVars: {
				autoplay: autoPlay ? 1 : 0,
				// `playsinline` attribute prevents the video from
				// automatically entering fullscreen on play on iOS.
				// https://stackoverflow.com/questions/40960747/disable-auto-fullscreen-of-youtube-embeds-on-iphone
				playsinline: 1,
				start: video.startAt
			},
			events: {
				onReady: (event) => {
					isReady.current = true
					if (autoPlay) {
						event.target.playVideo()
					}
				}
			}
		})
	}, [])

	const getState = useCallback(() => {
		if (isReady.current) {
			return player.current.getPlayerState()
		}
	}, [])

	const getCurrentTime = useCallback(() => {
		if (isReady.current) {
			return player.current.getCurrentTime()
		}
		return 0
	}, [])

	const getDOMNode = useCallback(() => {
		return player.current.getIframe()
	}, [])

	useImperativeHandle(ref, () => ({
		play: () => {
			if (isReady.current) {
				// state -> "playing" (1).
				player.current.playVideo()
			}
		},
		pause: () => {
			if (isReady.current) {
				// state -> "paused" (2) or "ended" (0).
				player.current.pauseVideo()
			}
		},
		stop: () => {
			if (isReady.current) {
				// Stops loading video stream.
				// state -> ended (0), paused (2), video cued (5) or unstarted (-1).
				player.current.stopVideo()
			}
		},
		getCurrentTime,
		getDuration: () => {
			if (isReady.current) {
				return player.current.getDuration()
			}
			return 0
		},
		seekTo: (seconds) => {
			if (isReady.current) {
				// const allowSeekAhead = true
				player.current.seekTo(seconds, true)
			}
		},
		// // Removes the player `<iframe/>` element.
		// destroy: () => {
		// 	player.current.destroy()
		// },
		isPaused: () => {
			switch (getState()) {
				case NOT_STARTED:
				case PAUSED:
				case ENDED:
					return true
				default:
					return false
			}
		},
		hasStarted: () => {
			switch (getState()) {
				case NOT_STARTED:
					return false
				default:
					return getCurrentTime() > 0
			}
		},
		hasEnded: () => {
			return getState() === ENDED
		},
		mute: () => {
			if (isReady.current) {
				player.current.mute()
			}
		},
		unMute: () => {
			if (isReady.current) {
				player.current.unMute()
			}
		},
		isMuted: () => {
			if (isReady.current) {
				return player.current.isMuted()
			}
		},
		setVolume: (volume) => {
			if (isReady.current) {
				player.current.setVolume(volume * 100)
			}
		},
		getVolume: () => {
			if (isReady.current) {
				return player.current.getVolume() / 100
			}
		},
		getDOMNode,
		focus: () => {
			getDOMNode().focus()
		}
	}), [getState])

	// The `<div/>` will be replaced by YouTube.
	return (
		<div ref={node}/>
	)
}

YouTubeVideo = React.forwardRef(YouTubeVideo)

YouTubeVideo.propTypes = {
	video: video.isRequired,
	autoPlay: PropTypes.bool,
	width: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	]),
	height: PropTypes.oneOfType([
		PropTypes.string,
		PropTypes.number
	])
}

export default YouTubeVideo

/**
 * YouTube Player API should be loaded in advance
 * in order to be already "ready" for the player
 * to be rendered in the same "event loop" cycle
 * as the user's interaction, otherwise iOS
 * won't "auto play" the video.
 * For example, call `loadYouTubeVideoPlayerApi()`
 * after the website has loaded.
 * Calling it multiple times (including concurrently)
 * doesn't do anything.
 * https://developers.google.com/youtube/iframe_api_reference
 */
let apiStatus
let apiPromise
export function loadYouTubeVideoPlayerApi() {
	switch (apiStatus) {
		case 'LOADED':
			return Promise.resolve()
		case 'LOADING':
			return apiPromise
		default:
			if (apiStatus) {
				return Promise.reject(new Error(`Unknown YouTube Player API status: ${apiStatus}`))
			}
	}
	apiStatus = 'LOADING'
	apiPromise = loadScript(
		'https://www.youtube.com/iframe_api',
		(resolve) => window.onYouTubeIframeAPIReady = resolve
	).then(
		() => {
			apiStatus = 'LOADED'
			apiPromise = undefined
		},
		() => {
			apiStatus = undefined
			apiPromise = undefined
		}
	)
	return apiPromise
}

export function hasYouTubeVideoPlayerApiLoaded() {
	return typeof YT !== 'undefined' && YT.Player !== undefined
}

const NOT_STARTED = -1
const ENDED = 0
const PLAYING = 1
const PAUSED = 2
const LOADING = 3
const CUED = 5