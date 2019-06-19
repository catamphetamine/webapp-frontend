import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { video } from '../PropTypes'
import { getEmbeddedVideoUrl, getVideoUrl } from '../utility/video'
import { requestFullScreen, exitFullScreen, onFullScreenChange } from '../utility/dom'

import Picture, { getMaxFitSize } from './Picture'
import VideoPlayIcon from './VideoPlayIcon'
import HtmlVideo from './HtmlVideo'
import YouTubeVideo from './YouTubeVideo'
import ButtonOrLink from './ButtonOrLink'

import './Video.css'

export default class Video extends React.Component {
	state = {
		showPreview: this.props.showPreview, // && this.props.video.picture,
		autoPlay: this.props.autoPlay
	}

	button = React.createRef()
	video = React.createRef()
	youTubeVideo = React.createRef()
	iframeVideo = React.createRef()

	componentDidMount() {
		const { video } = this.props
		if (video.provider === 'YouTube') {
			YouTubeVideo.loadApi()
		}
	}

	componentWillUnmount() {
		if (this.isFullScreen) {
			this.exitFullScreen()
		}
	}

	componentDidUpdate(prevProps) {
		// On `showPreview` property change.
		if (this.props.showPreview !== prevProps.showPreview) {
			this.setState({
				showPreview: this.props.showPreview
			})
		}
		// On `autoPlay` property change.
		if (this.props.autoPlay !== prevProps.autoPlay) {
			this.setState({
				autoPlay: this.props.autoPlay
			})
		}
		// On `canPlay` property change.
		if (this.props.canPlay !== prevProps.canPlay) {
			if (!this.props.canPlay && this.props.showPreview) {
				this.setState({
					showPreview: true,
					autoPlay: false
				})
			}
		}
	}

	getPlayer() {
		return this.video.current || this.youTubeVideo.current
	}

	spacebarTogglesPlay() {
		return this.getPlayer() === this.video.current
	}

	focus = () => {
		if (this.button.current) {
			this.button.current.focus()
		} else if (this.getPlayer() && this.getPlayer().focus) {
			this.getPlayer().focus()
		} else {
			return false
		}
	}

	// `<video/>` docs:
	// https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement

	play = () => {
		if (this.getPlayer() && this.getPlayer().play) {
			this.getPlayer().play()
			return true
		}
	}

	pause = () => {
		if (this.getPlayer() && this.getPlayer().pause) {
			this.getPlayer().pause()
			return true
		}
	}

	togglePlay() {
		// // If rendering HTML5 `<video/>` which is focused
		// // then it already handles play/pause of spacebar.
		// if (this.video.current) {
		// 	return true
		// }
		const isPaused = this.isPaused()
		if (isPaused !== undefined) {
			if (isPaused) {
				this.getPlayer().play()
			} else {
				this.getPlayer().pause()
			}
			return true
		}
	}

	isPaused = () => {
		if (this.getPlayer() && this.getPlayer().isPaused) {
			return this.getPlayer().isPaused()
		}
	}

	hasStarted = () => {
		if (this.getPlayer() && this.getPlayer().hasStarted) {
			return this.getPlayer().hasStarted()
		}
	}

	hasEnded = () => {
		if (this.getPlayer() && this.getPlayer().hasEnded) {
			return this.getPlayer().hasEnded()
		}
	}

	seek(forward) {
		const { seekStep } = this.props
		const delta = forward ? seekStep : -1 * seekStep
		if (this.getPlayer() && this.getPlayer().getCurrentTime) {
			return this.seekTo(this.getPlayer().getCurrentTime() + delta)
		}
	}

	seekTo(seconds) {
		if (this.getPlayer() && this.getPlayer().seekTo) {
			this.getPlayer().seekTo(seconds)
			return true
		}
	}

	setVolume(volume) {
		if (this.getPlayer() && this.getPlayer().setVolume) {
			this.getPlayer().setVolume(volume)
			return true
		}
	}

	getVolume() {
		if (this.getPlayer() && this.getPlayer().getVolume) {
			return this.getPlayer().getVolume()
		}
	}

	getDuration() {
		const { video } = this.props
		// Even if `video` didn't contain `duration`
		// YouTube player can return its duration.
		if (this.getPlayer() && this.getPlayer().getDuration) {
			return this.getPlayer().getDuration
		}
		return video.duration
	}

	changeVolume(up) {
		const { changeVolumeStep } = this.props
		const delta = up ? changeVolumeStep : -1 * changeVolumeStep
		const volume = this.getVolume()
		if (volume !== undefined) {
			return this.setVolume(Math.min(Math.max(0, volume + delta), 1))
		}
	}

	mute() {
		if (this.getPlayer() && this.getPlayer().mute) {
			this.getPlayer().mute()
			return true
		}
	}

	unMute() {
		if (this.getPlayer() && this.getPlayer().unMute) {
			this.getPlayer().unMute()
			return true
		}
	}

	isMuted() {
		if (this.getPlayer() && this.getPlayer().isMuted) {
			return this.getPlayer().isMuted()
		}
	}

	toggleMute() {
		const isMuted = this.isMuted()
		if (isMuted !== undefined) {
			if (isMuted) {
				return this.unMute()
			} else {
				return this.mute()
			}
		}
	}

	showVideo = () => {
		this.setState({
			showPreview: false,
			autoPlay: true
		}, this.focus)
	}

	onClick = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		// Handle click event.
		const { onClick } = this.props
		const { showPreview } = this.state
		if (onClick) {
			onClick(event)
		}
		if (showPreview && !event.defaultPrevented) {
			event.preventDefault()
			this.showVideo()
		}
	}

	onKeyDown = (event) => {
		const {
			video,
			seekOnArrowKeys,
			changeVolumeOnArrowKeys
		} = this.props

		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}

		switch (event.keyCode) {
			// Pause/Play on Spacebar.
			case 32:
				if (!this.spacebarTogglesPlay()) {
					if (this.togglePlay()) {
						event.preventDefault()
					}
				}
				break

			// Seek backwards on Left Arrow key.
			case 37:
				if (seekOnArrowKeys) {
					if (this.seek(false)) {
						event.preventDefault()
					}
				}
				break

			// Seek forward on Right Arrow key.
			case 39:
				if (seekOnArrowKeys) {
					if (this.seek(true)) {
						event.preventDefault()
					}
				}
				break

			// Seek to start on Home key.
			case 36:
				if (this.seekTo(0)) {
					event.preventDefault()
				}
				break

			// Seek to end on End key.
			case 35:
				if (this.seekTo(video.duration)) {
					event.preventDefault()
				}
				break

			// Volume Up on Up Arrow key.
			case 38:
				if (changeVolumeOnArrowKeys) {
					if (this.changeVolume(true)) {
						event.preventDefault()
					}
				}
				break

			// Volume Down on Down Arrow key.
			case 40:
				if (changeVolumeOnArrowKeys) {
					if (this.changeVolume(false)) {
						event.preventDefault()
					}
				}
				break

			// Toggle mute on "M" key.
			case 77:
				if (this.toggleMute()) {
					event.preventDefault()
				}
				break

			// Toggle fullscreen on "F" key.
			case 70:
				const node = (this.getPlayer() && this.getPlayer().getNode()) || this.iframeVideo.current
				if (node) {
					if (this.isFullScreen) {
						this.exitFullScreen()
					} else {
						this.enterFullScreen(node)
					}
					event.preventDefault()
				}
				break
		}
	}

	enterFullScreen(node) {
		if (requestFullScreen(node)) {
			this.isFullScreen = true
		}
	}

	exitFullScreen() {
		exitFullScreen()
		this.isFullScreen = false
	}

	onFullScreenChange() {}

	getFit() {
		const {
			fit,
			width,
			height,
			maxWidth,
			maxHeight
		} = this.props
		if (fit) {
			return fit
		}
		if (width || height) {
			return 'exact'
		}
		if (maxWidth || maxHeight) {
			return 'exact-contain'
		}
		return 'width'
	}

	getContainerStyle() {
		const {
			video,
			maxWidth,
			maxHeight
		} = this.props
		const fit = this.getFit()
		switch (fit) {
			case 'width':
			case 'exact-contain':
				return {
					paddingBottom: 100 / getAspectRatio(video) + '%'
				}
			case 'scale-down':
				const maxSize = getMaxFitSize(getMaxSize(video), maxWidth, maxHeight, fit)
				return {
					maxWidth: maxSize.width,
					maxHeight: maxSize.height
				}
		}
	}

	render() {
		const {
			video,
			maxWidth,
			maxHeight,
			maxWidthWrapper
		} = this.props
		const fit = this.getFit()
		switch (fit) {
			case 'exact-contain':
				// Setting `max-width` on the top-most container to make
				// the whole thing downsize when the page width is not enough.
				// Percentage `padding-bottom` is set on child element which sets aspect ratio.
				// Setting `max-width` together with `padding-bottom` doesn't work:
				// aspect ratio is not being inforced in that case.
				// That's the reason the extra wrapper is introduced.
				if (maxWidthWrapper) {
					return (
						<div style={{
							maxWidth: (maxWidth || (maxHeight * getAspectRatio(video))) + 'px'
						}}>
							{this.render_(fit)}
						</div>
					)
				}
				return this.render_(fit)
			default:
				return this.render_(fit)
		}
	}

	render_(fit) {
		const {
			video,
			// width,
			// height,
			onClick,
			tabIndex,
			style,
			className
		} = this.props

		const {
			showPreview
		} = this.state

		const _style = style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle()
		const _className = classNames(className, 'rrui__video', {
			'rrui__video--preview': showPreview,
			'rrui__video--aspect-ratio': fit === 'width'
		})

		if (showPreview) {
			// Percentage `padding-bottom` is set on the `<button/>` to enforce aspect ratio.
			return (
				<ButtonOrLink
					ref={this.button}
					url={getUrl(video)}
					onClick={this.onClick}
					aria-label={this.props['aria-label']}
					tabIndex={tabIndex}
					style={_style}
					className={classNames('rrui__button-reset', 'rrui__video__button', _className)}>
					{this.renderPreview()}
				</ButtonOrLink>
			)
		}

		// Percentage `padding-bottom` is set on the `<div/>` to enforce aspect ratio.
		return (
			<div
				ref={this.container}
				onKeyDown={this.onKeyDown}
				style={_style}
				className={_className}>
				{this.renderVideo()}
			</div>
		)
	}

	renderPreview() {
		const {
			video,
			showPlayIcon
		} = this.props

		return (
			<React.Fragment>
				<Picture
					picture={video.picture}
					fit="cover"
					aria-hidden/>
				{showPlayIcon &&
					<VideoPlayIcon className="rrui__video__play-icon--center"/>
				}
				{!showPlayIcon &&
					<VideoDuration duration={video.duration}/>
				}
			</React.Fragment>
		);
	}

	renderVideo() {
		const {
			video,
			tabIndex
		} = this.props

		const {
			autoPlay
		} = this.state

		if (!video.provider) {
			// `onClick` is used to prevent Chrome Video player
			// triggering "pause"/"play" on click while dragging.
			return (
				<HtmlVideo
					ref={this.video}
					onClick={this.onClick}
					tabIndex={tabIndex}
					video={video}
					width="100%"
					height="100%"
					autoPlay={autoPlay}/>
			)
		}

		if (video.provider === 'YouTube' && YouTubeVideo.hasApiLoaded()) {
			return (
				<YouTubeVideo
					ref={this.youTubeVideo}
					tabIndex={tabIndex}
					video={video}
					width="100%"
					height="100%"
					autoPlay={autoPlay}/>
			)
		}

		if (video.provider === 'Vimeo' || video.provider === 'YouTube') {
			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
			// `allowFullScreen` property is for legacy browsers support.
			return (
				<iframe
					ref={this.iframeVideo}
					src={getEmbeddedVideoUrl(video.id, video.provider, {
						autoPlay,
						startAt: video.startAt
					})}
					frameBorder={0}
					allow="autoplay; fullscreen"
					allowFullScreen />
			)
			/*
			<iframe
				width={width}
				height={height} />
			*/
		}

		console.error(`Unsupported video provider: ${video.provider}`)
		return null
	}
}

Video.propTypes = {
	video: video.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	fit: PropTypes.oneOf([
		'contain',
		'scale-down'
	]).isRequired,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	// `<button/>` containers require width being set on them directly
	// and won't work as `<button><div style="max-width: ...">...</div></button>`.
	maxWidthWrapper : PropTypes.bool.isRequired,
	showPreview: PropTypes.bool.isRequired,
	seekOnArrowKeys: PropTypes.bool.isRequired,
	seekStep: PropTypes.number.isRequired,
	changeVolumeOnArrowKeys: PropTypes.bool.isRequired,
	changeVolumeStep: PropTypes.number.isRequired,
	autoPlay: PropTypes.bool.isRequired,
	canPlay: PropTypes.bool.isRequired,
	showPlayIcon: PropTypes.bool,
	onClick: PropTypes.func,
	tabIndex: PropTypes.number,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	showPreview: true,
	seekOnArrowKeys: true,
	seekStep: 5,
	changeVolumeOnArrowKeys: true,
	changeVolumeStep: 0.1,
	autoPlay: false,
	canPlay: true,
	maxWidthWrapper: true
}

export function getUrl(video) {
	if (!video.provider) {
		return video.url
	}
	if (video.provider === 'Vimeo' || video.provider === 'YouTube') {
		return getVideoUrl(video.id, video.provider, {
			startAt: video.startAt
		})
	}
	console.error(`Unsupported video provider: ${video.provider}`)
	return
}

export function getAspectRatio(video) {
	if (video.aspectRatio) {
		return video.aspectRatio
	}
	const maxSize = getMaxSize(video)
	if (maxSize) {
		return maxSize.width / maxSize.height
	}
}

export function getMaxSize(video) {
	// `.width` and `.height` aren't required on a `video`
	// because, for example, if it's a YouTube video
	// which was parsed without using a YouTube API key
	// it will only contain video ID and the thumbnail picture.
	if (video.width && video.height) {
		return video
	}
	return video.picture
}

export function VideoDuration({ duration, children }) {
	return (
		<div className={classNames('rrui__video__duration', {
			'rrui__video__duration--time': duration
		})}>
			{duration ? formatVideoDuration(duration) : (children || '▶')}
		</div>
	)
}

VideoDuration.propTypes = {
	duration: PropTypes.number,
	children: PropTypes.string
}

function formatVideoDuration(seconds) {
	let minutes = Math.floor(seconds / 60)
	seconds = seconds % 60
	const hours = Math.floor(minutes / 60)
	minutes = minutes % 60
	if (hours === 0) {
		return minutes + ':' + formatTwoPositions(seconds)
	}
	return hours + ':' + formatTwoPositions(minutes) + ':' + formatTwoPositions(seconds)
}

function formatTwoPositions(number) {
	if (number < 10) {
		return '0' + number
	}
	return number
}