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

// Picture border width.
// Could also be read from the CSS variable:
// `parseInt(getComputedStyle(this.container.current).getPropertyValue('--Picture-borderWidth'))`.
export const BORDER_WIDTH = 1

export default class Video extends React.Component {
	state = {
		showPreview: this.props.showPreview && !this.props.autoPlay,
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

	showVideo = (callback) => {
		const { showPreview } = this.state
		if (showPreview) {
			this.setState({
				showPreview: false,
				autoPlay: true
			}, () => {
				this.focus()
				if (callback) {
					callback()
				}
			})
		} else {
			if (callback) {
				callback()
			}
		}
	}

	onClick = (event) => {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		// Handle click event.
		const { onClick, expand } = this.props
		const { showPreview } = this.state
		if (expand) {
			return
		}
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
			seekOnArrowKeysAtBorders,
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
				if (seekOnArrowKeys &&
					(seekOnArrowKeysAtBorders || this.hasStarted() === true)
				) {
					if (this.seek(false)) {
						event.preventDefault()
					}
				}
				break

			// Seek forward on Right Arrow key.
			case 39:
				if (seekOnArrowKeys &&
					(seekOnArrowKeysAtBorders || this.hasEnded() === false)
				) {
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

	addBorder(dimension) {
		const { border } = this.props
		if (border) {
			return dimension + 2 * BORDER_WIDTH
		}
		return dimension
	}

	getAspectRatio() {
		const { video } = this.props
		return getAspectRatio(video)
	}

	getMaxWidth() {
		const {
			video,
			maxWidth,
			maxHeight,
			fit
		} = this.props
		const maxWidths = []
		if (maxWidth) {
			maxWidths.push(maxWidth)
		}
		if (maxHeight) {
			maxWidths.push(maxHeight * this.getAspectRatio())
		}
		if (fit === 'scale-down') {
			maxWidths.push(getMaxSize(video).width)
		}
		if (maxWidths.length > 0) {
			return Math.min(...maxWidths)
		}
	}

	getContainerStyle() {
		const {
			video,
			width,
			height,
			maxWidth,
			maxHeight,
			fit
		} = this.props
		if (width || height) {
			return {
				width: this.addBorder(width || (height * this.getAspectRatio())) + 'px',
				height: this.addBorder(height || (width / this.getAspectRatio())) + 'px'
			}
		}
		if (maxWidth || maxHeight) {
			return {
				width: '100%',
				maxWidth: this.addBorder(this.getMaxWidth()) + 'px'
			}
		}
	}

	render() {
		const {
			border,
			video,
			showPlayIcon,
			expand,
			width,
			height,
			maxWidth,
			maxHeight,
			onClick,
			tabIndex,
			style,
			className
		} = this.props

		const {
			showPreview: _showPreview
		} = this.state

		const showPreview = _showPreview && !expand

		const _className = classNames(className, 'rrui__video', {
			'rrui__video--preview': showPreview,
			// 'rrui__video--aspect-ratio': fit === 'width',
			'rrui__video--border': border,
			// 'rrui__video--expanded': expand
		})

		if (showPreview) {
			return (
				<Picture
					ref={this.button}
					border={border}
					picture={video.picture}
					component={ButtonOrLink}
					url={getUrl(video)}
					onClick={this.onClick}
					aria-label={this.props['aria-label']}
					tabIndex={tabIndex}
					width={expand ? undefined : width}
					height={expand ? undefined : height}
					maxWidth={expand ? getMaxSize(video).width : this.getMaxWidth()}
					maxHeight={expand ? undefined : maxHeight}
					aspectRatio={video.width ? this.getAspectRatio() : undefined}
					aria-hidden
					style={style}
					className={classNames(_className, 'rrui__button-reset', 'rrui__video__preview')}>
					{showPlayIcon &&
						<VideoPlayIcon className="rrui__video__play-icon--center"/>
					}
					{!showPlayIcon &&
						<VideoDuration duration={video.duration}/>
					}
				</Picture>
			)
		}

		return this.renderVideo({
			onKeyDown: this.onKeyDown,
			style: style ? { ...style, ...this.getContainerStyle() } : this.getContainerStyle(),
			className: _className
		})
	}

	renderVideo(rest) {
		const {
			expand,
			video,
			tabIndex
		} = this.props

		const {
			autoPlay
		} = this.state

		if (!video.provider) {
			// `onClick` is used to prevent Chrome Video player
			// triggering "pause"/"play" on click while dragging.
			//
			// `<video/>` can maintain its aspect ratio during layout
			// but only after the video file has loaded, and there's a
			// very short period of time at the start of `<video/>` layout
			// when it doesn't maintain aspect ratio. This results in
			// `<Post/>`s having `<video/>`s changing their height after
			// such `<Post/>`s have been mounted which results in
			// `virtual-scroller` jumping while scrolling.
			// Therefore using an `<AspectRatioWrapper/>` here too
			// to preserve aspect ratio.
			return (
				<AspectRatioWrapper {...rest} aspectRatio={this.getAspectRatio()}>
					<HtmlVideo
						width="100%"
						height="100%"
						preview={expand ? false : true}
						ref={this.video}
						onClick={this.onClick}
						tabIndex={tabIndex}
						video={video}
						autoPlay={autoPlay}/>
				</AspectRatioWrapper>
			)
		}

		if (video.provider === 'YouTube' && YouTubeVideo.hasApiLoaded()) {
			// `<video/>` can maintain its aspect ratio during layout
			// while `<iframe/>` can't, so using the `paddingBottom` trick here
			// to preserve aspect ratio.
			return (
				<AspectRatioWrapper {...rest} aspectRatio={this.getAspectRatio()}>
					<YouTubeVideo
						ref={this.youTubeVideo}
						tabIndex={tabIndex}
						video={video}
						width="100%"
						height="100%"
						autoPlay={autoPlay}/>
				</AspectRatioWrapper>
			)
		}

		if (video.provider === 'Vimeo' || video.provider === 'YouTube') {
			// https://developers.google.com/web/updates/2017/09/autoplay-policy-changes
			// `allowFullScreen` property is for legacy browsers support.
			//
			// `<video/>` can maintain its aspect ratio during layout
			// while `<iframe/>` can't, so using the `paddingBottom` trick here
			// to preserve aspect ratio.
			return (
				<AspectRatioWrapper {...rest} aspectRatio={this.getAspectRatio()}>
					<iframe
						ref={this.iframeVideo}
						src={getEmbeddedVideoUrl(video.id, video.provider, {
							autoPlay,
							startAt: video.startAt
						})}
						width="100%"
						height="100%"
						frameBorder={0}
						allow="autoplay; fullscreen"
						allowFullScreen/>
				</AspectRatioWrapper>
			)
		}

		console.error(`Unsupported video provider: ${video.provider}`)
		return null
	}
}

Video.propTypes = {
	video: video.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	fit: PropTypes.oneOf(['scale-down']),
	showPreview: PropTypes.bool.isRequired,
	seekOnArrowKeys: PropTypes.bool.isRequired,
	seekOnArrowKeysAtBorders: PropTypes.bool.isRequired,
	seekStep: PropTypes.number.isRequired,
	changeVolumeOnArrowKeys: PropTypes.bool.isRequired,
	changeVolumeStep: PropTypes.number.isRequired,
	autoPlay: PropTypes.bool.isRequired,
	canPlay: PropTypes.bool.isRequired,
	showPlayIcon: PropTypes.bool,
	onClick: PropTypes.func,
	tabIndex: PropTypes.number,
	border: PropTypes.bool,
	expand: PropTypes.bool,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	showPreview: true,
	seekOnArrowKeys: true,
	seekOnArrowKeysAtBorders: true,
	seekStep: 5,
	changeVolumeOnArrowKeys: true,
	changeVolumeStep: 0.1,
	autoPlay: false,
	canPlay: true
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

function AspectRatioWrapper({ aspectRatio, children, ...rest }) {
	return (
		<div {...rest}>
			<div style={{ width: '100%', paddingBottom: 100 / aspectRatio + '%' }}>
				<div style={ASPECT_RATIO_WRAPPER_INNER_STYLE}>
					{children}
				</div>
			</div>
		</div>
	)
}

const ASPECT_RATIO_WRAPPER_INNER_STYLE = {
	position: 'absolute',
	width: '100%',
	height: '100%'
}