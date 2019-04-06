import React from 'react'
import PropTypes from 'prop-types'

import { video } from '../PropTypes'

export default class YouTubeVideo extends React.Component {
	node = React.createRef()

	componentDidMount() {
		const {
			video,
			width,
			height,
			autoPlay
		} = this.props
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
		const { autoPlay } = this.props
		if (autoPlay) {
			event.target.playVideo()
		}
	}

	play() {
		// state -> "playing" (1).
		this.player.playVideo()
	}

	pause() {
		// state -> "paused" (2) or "ended" (0).
		this.player.pauseVideo()
	}

	stop() {
		// Stops loading video stream.
		// state -> ended (0), paused (2), video cued (5) or unstarted (-1).
		this.player.stopVideo()
	}

	getCurrentTime() {
		return this.player.getCurrentTime()
	}

	getDuration() {
		return this.player.getDuration()
	}

	seekTo(seconds) {
		// const allowSeekAhead = true
		this.player.seekTo(seconds, true)
	}

	getNode() {
		return this.player.getIframe()
	}

	// Removes the player `<iframe/>` element.
	destroy() {
		this.player.destroy()
	}

	getState() {
		return this.player.getPlayerState()
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
		this.player.mute()
	}

	unMute() {
		this.player.unMute()
	}

	isMuted() {
		return this.player.isMuted()
	}

	setVolume(volume) {
		this.player.setVolume(volume * 100)
	}

	getVolume() {
		return this.player.getVolume() / 100
	}

	getDuration() {
		return this.player.getDuration()
	}

	focus = () => {
		this.getNode().focus()
	}

	render() {
		return <div ref={this.node}/>
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
let loadingApi = false
YouTubeVideo.loadApi = () => {
	if (loadingApi) {
		return
	}
	loadingApi = true
	const script = document.createElement('script')
	script.onerror = () => loadingApi = false
	script.src = 'https://www.youtube.com/iframe_api'
	const firstScriptTag = document.getElementsByTagName('script')[0]
	firstScriptTag.parentNode.insertBefore(script, firstScriptTag)
}

YouTubeVideo.hasApiLoaded = () => {
	return typeof YT !== 'undefined' && YT.Player !== undefined
}

const NOT_STARTED = -1
const ENDED = 0
const PLAYING = 1
const PAUSED = 2
const LOADING = 3
const CUED = 5