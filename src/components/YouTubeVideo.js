import React from 'react'
import PropTypes from 'prop-types'

import { video } from '../PropTypes'

import loadScript from '../utility/loadScript'

export default class YouTubeVideo extends React.Component {
	node = React.createRef()

	componentDidMount() {
		const {
			video,
			width,
			height,
			autoPlay
		} = this.props
		// `this.player` won't have the instance methods
		// until it's in the "ready" state.
		this.player = new YT.Player(this.node.current, {
			width,
			height,
			videoId: video.id,
			playerVars: {
				autoplay: autoPlay ? 1 : 0,
				start: video.startAt
			},
			events: {
				onReady: this.onReady
			}
		})
	}

	onReady = (event) => {
		this.isReady = true
		const { autoPlay } = this.props
		if (autoPlay) {
			event.target.playVideo()
		}
	}

	play() {
		if (this.isReady) {
			// state -> "playing" (1).
			this.player.playVideo()
		}
	}

	pause() {
		if (this.isReady) {
			// state -> "paused" (2) or "ended" (0).
			this.player.pauseVideo()
		}
	}

	stop() {
		if (this.isReady) {
			// Stops loading video stream.
			// state -> ended (0), paused (2), video cued (5) or unstarted (-1).
			this.player.stopVideo()
		}
	}

	getCurrentTime() {
		if (this.isReady) {
			return this.player.getCurrentTime()
		}
		return 0
	}

	getDuration() {
		if (this.isReady) {
			return this.player.getDuration()
		}
		return 0
	}

	seekTo(seconds) {
		if (this.isReady) {
			// const allowSeekAhead = true
			this.player.seekTo(seconds, true)
		}
	}

	getNode() {
		return this.player.getIframe()
	}

	// Removes the player `<iframe/>` element.
	destroy() {
		this.player.destroy()
	}

	getState() {
		if (this.isReady) {
			return this.player.getPlayerState()
		}
	}

	isPaused() {
		switch (this.getState()) {
			case NOT_STARTED:
			case PAUSED:
			case ENDED:
				return true
			default:
				return false
		}
	}

	hasStarted() {
		switch (this.getState()) {
			case NOT_STARTED:
				return false
			default:
				return this.getCurrentTime() > 0
		}
	}

	hasEnded() {
		return this.getState() === ENDED
	}

	mute() {
		if (this.isReady) {
			this.player.mute()
		}
	}

	unMute() {
		if (this.isReady) {
			this.player.unMute()
		}
	}

	isMuted() {
		if (this.isReady) {
			return this.player.isMuted()
		}
	}

	setVolume(volume) {
		if (this.isReady) {
			this.player.setVolume(volume * 100)
		}
	}

	getVolume() {
		if (this.isReady) {
			return this.player.getVolume() / 100
		}
	}

	focus = () => {
		this.getNode().focus()
	}

	render() {
		// const {
		// 	video,
		// 	width,
		// 	height,
		// 	autoPlay,
		// 	...rest
		// } = this.props
		// The `<div/>` with `ref={this.node}` will be replaced by YouTube.
		return (
			<div ref={this.node}/>
		)
	}
}

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

// https://developers.google.com/youtube/iframe_api_reference
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