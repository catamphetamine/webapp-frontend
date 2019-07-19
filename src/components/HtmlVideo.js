import React from 'react'
import PropTypes from 'prop-types'

import { video } from '../PropTypes'

export default class HtmlVideo extends React.Component {
	node = React.createRef()
	focus = () => this.node.current.focus()
	// `<video/>` docs:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement
	getPlayer = () => this.node.current
	play = () => this.getPlayer().play()
	pause = () => this.getPlayer().pause()
	isPaused = () => this.getPlayer().paused
	getCurrentTime = () => this.getPlayer().currentTime
	seekTo = (seconds) => this.getPlayer().currentTime = seconds
	hasStarted = () => this.getCurrentTime() > 0
	hasEnded = () => this.getPlayer().ended
	setVolume = (volume) => this.getPlayer().volume = volume
	getVolume = () => this.getPlayer().volume
	isMuted = () => this.getVolume() === 0
	mute = () => {
		this.volumeBeforeMute = this.getVolume()
		this.setVolume(0)
	}
	unMute = () => {
		this.setVolume(this.volumeBeforeMute === undefined ? 1 : this.volumeBeforeMute)
	}

	getNode() {
		return this.node.current
	}

	render() {
		const {
			video,
			preview,
			width,
			height,
			tabIndex,
			autoPlay,
			...rest
		} = this.props

		return (
			<video
				{...rest}
				ref={this.node}
				tabIndex={tabIndex}
				width={width}
				height={height}
				poster={preview ? video.picture && video.picture.url : undefined}
				autoPlay={autoPlay}
				controls>
				<source
					src={video.url}
					type={video.type}/>
			</video>
		)
	}
}

HtmlVideo.propTypes = {
	video: video.isRequired,
	preview: PropTypes.bool.isRequired,
	tabIndex: PropTypes.number,
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

HtmlVideo.defaultProps = {
	preview: true
}