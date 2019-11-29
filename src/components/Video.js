import React, { useState, useRef, useEffect, useLayoutEffect, useImperativeHandle, useMemo } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { video } from '../PropTypes'
import { getEmbeddedVideoUrl, getVideoUrl } from '../utility/video'
import { requestFullScreen, exitFullScreen as _exitFullScreen } from '../utility/dom'

import Picture, { getMaxFitSize } from './Picture'
import VideoPlayIcon from './VideoPlayIcon'
import HtmlVideo from './HtmlVideo'
import YouTubeVideo, {
	loadYouTubeVideoPlayerApi,
	hasYouTubeVideoPlayerApiLoaded
} from './YouTubeVideo'
import ButtonOrLink from './ButtonOrLink'

import './Video.css'

// Picture border width.
// Could also be read from the CSS variable:
// `parseInt(getComputedStyle(container.current).getPropertyValue('--Picture-borderWidth'))`.
export const BORDER_WIDTH = 1

function Video({
	video,
	border,
	preview,
	playable,
	autoPlay,
	expand,
	showPlayIcon,
	width,
	height,
	maxWidth,
	maxHeight,
	fit,
	onClick: _onClick,
	seekStep,
	seekOnArrowKeys,
	seekOnArrowKeysAtBorders,
	changeVolumeOnArrowKeys,
	changeVolumeStep,
	stopVideoOnStopPlaying,
	spoilerLabel,
	tabIndex,
	style,
	className,
	...rest
}, ref) {
	const [shouldStartPlaying, setShouldStartPlaying] = useState(playable && autoPlay)
	const [showPreview, setShowPreview] = useState(preview && !shouldStartPlaying && !expand)
	const previewRef = useRef()
	const playerRef = useRef()
	const playerContainerInnerRef = useRef()
	const hasMounted = useRef()
	const isFullScreen = useRef()
	const playState = useRef(Promise.resolve())

	useEffect(() => {
		// YouTube Player API should be loaded in advance
		// in order to be already "ready" for the player
		// to be rendered in the same "event loop" cycle
		// as the user's interaction, otherwise iOS
		// won't "auto play" the video.
		// For example, call `loadYouTubeVideoPlayerApi()`
		// after the website has loaded.
		// Calling it multiple times (including concurrently)
		// doesn't do anything.
		if (video.provider === 'YouTube') {
			loadYouTubeVideoPlayerApi()
		}
		return () => {
			if (isFullScreen.current) {
				exitFullScreen()
			}
		}
	}, [])

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
		// The initial call is ignored.
		if (!hasMounted.current) {
			return
		}
		if (shouldStartPlaying) {
			focus()
			setPlayState(play)
		} else {
			if (stopVideoOnStopPlaying) {
				setPlayState(stop)
			} else {
				setPlayState(pause)
			}
		}
	}, [shouldStartPlaying])

	function setPlayState(newStateTransition) {
		playState.current = playState.current
			.then(newStateTransition)
			.catch((error) => {
				// When a new player is created with `autoPlay={true}`
				// it is initially being played without calling `play()`
				// so `playState` is not the `.play()` promise.
				// So, when a `<Slideshow/>` changes the current slide
				// `pause()` is called on a video which might not have
				// started playing yet causing the error.
				// An ideal code would emulate `autoPlay={true}` using
				// `useEffect()` but that would be too much hassle,
				// so just ignoring these "DOMException" errors.
				// ("The play() request was interrupted by a call to pause()")
				if (error.name === 'AbortError') {
					// Ignore
				} else {
					throw error
				}
			})
	}

	function updateShowPreview() {
		setShowPreview(preview && !(playable && autoPlay) && !expand)
	}

	// On `preview` property change.
	useEffect(() => {
		if (hasMounted.current) {
			updateShowPreview()
		}
	}, [preview])

	// On `expand` property change.
	useEffect(() => {
		if (hasMounted.current) {
			updateShowPreview()
		}
	}, [expand])

	// On `playable` property change.
	useEffect(() => {
		if (hasMounted.current) {
			updateShowPreview()
			setShouldStartPlaying(playable && autoPlay ? true : false)
		}
	}, [playable])

	// On `autoPlay` property change.
	useEffect(() => {
		if (hasMounted.current) {
			updateShowPreview()
			setShouldStartPlaying(playable && autoPlay ? true : false)
		}
	}, [autoPlay])

	useEffect(() => {
		hasMounted.current = true
	}, [])

	useImperativeHandle(ref, () => ({
		focus
	}))

	function play() {
		if (playerRef.current && playerRef.current.play) {
			const result = playerRef.current.play()
			// HTML `<video/>` `.play()` returns a `Promise`.
			// https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
			if (result && typeof result.then === 'function') {
				return result
			}
			return true
		}
	}

	function pause() {
		if (playerRef.current && playerRef.current.pause) {
			playerRef.current.pause()
			return true
		}
	}

	function stop() {
		if (playerRef.current) {
			// Exit fullscreen on stop.
			// For example, when watching slides in a slideshow
			// and the current slide is video and it's in fullscreen mode
			// and then the user pushes "Left" or "Right" key
			// to move to another slide that next slide should be focused
			// which wouldn't be possible until the fullscreen mode is exited from.
			if (isFullScreen.current) {
				exitFullScreen()
			}
			if (playerRef.current.stop) {
				playerRef.current.stop()
				return true
			}
			// `<HtmlVideo/>` doesn't have a `.stop()` method.
			// Emulate `stop()` via `pause()` and `seekTo()`.
			else {
				return pause() && seekTo(0)
			}
		}
	}

	function togglePlay() {
		if (isPaused() !== undefined) {
			if (isPaused()) {
				return play()
			} else {
				return pause()
			}
		}
	}

	function isPaused() {
		if (playerRef.current && playerRef.current.isPaused) {
			return playerRef.current.isPaused()
		}
	}

	function hasStarted() {
		if (playerRef.current && playerRef.current.hasStarted) {
			return playerRef.current.hasStarted()
		}
	}

	function hasEnded() {
		if (playerRef.current && playerRef.current.hasEnded) {
			return playerRef.current.hasEnded()
		}
	}

	function seek(forward) {
		const delta = forward ? seekStep : -1 * seekStep
		if (playerRef.current && playerRef.current.getCurrentTime) {
			return seekTo(playerRef.current.getCurrentTime() + delta)
		}
	}

	function seekTo(seconds) {
		if (playerRef.current && playerRef.current.seekTo) {
			playerRef.current.seekTo(seconds)
			return true
		}
	}

	function setVolume(volume) {
		if (playerRef.current && playerRef.current.setVolume) {
			playerRef.current.setVolume(volume)
			return true
		}
	}

	function getVolume() {
		if (playerRef.current && playerRef.current.getVolume) {
			return playerRef.current.getVolume()
		}
	}

	function getDuration() {
		// Even if `video` didn't contain `duration`
		// YouTube player can return its duration.
		if (playerRef.current && playerRef.current.getDuration) {
			return playerRef.current.getDuration
		}
		return video.duration
	}

	function changeVolume(up) {
		const delta = up ? changeVolumeStep : -1 * changeVolumeStep
		const volume = getVolume()
		if (volume !== undefined) {
			return setVolume(Math.min(Math.max(0, volume + delta), 1))
		}
	}

	function mute() {
		if (playerRef.current && playerRef.current.mute) {
			playerRef.current.mute()
			return true
		}
	}

	function unMute() {
		if (playerRef.current && playerRef.current.unMute) {
			playerRef.current.unMute()
			return true
		}
	}

	function isMuted() {
		if (playerRef.current && playerRef.current.isMuted) {
			return playerRef.current.isMuted()
		}
	}

	function toggleMute() {
		if (isMuted() !== undefined) {
			if (isMuted()) {
				return unMute()
			} else {
				return mute()
			}
		}
	}

	function focus() {
		if (showPreview) {
			previewRef.current.focus()
		} else if (shouldFocusPlayer(video) &&
			playerRef.current && playerRef.current.focus) {
			playerRef.current.focus()
		} else {
			playerContainerInnerRef.current.focus()
		}
	}

	function onClick(event) {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		// Handle click event.
		if (expand) {
			return
		}
		// `<Slideshow/>` passes `onClick()` to prevent
		// `<video/>` from toggling Pause/Play on click-and-drag.
		if (_onClick) {
			// `<Slideshow/>` calls `event.preventDefault()` here on click-and-drag.
			_onClick(event)
		}
		if (showPreview && !event.defaultPrevented) {
			event.preventDefault()
			setShowPreview(false)
			setShouldStartPlaying(true)
		}
	}

	function onKeyDown(event) {
		if (event.ctrlKey || event.altKey || event.shiftKey || event.metaKey) {
			return
		}
		switch (event.keyCode) {
			// Pause/Play on Spacebar.
			case 32:
				if (!videoPlayerHandlesTogglePlayOnSpacebar(video)) {
					if (isPaused() !== undefined) {
						setPlayState(togglePlay)
						event.preventDefault()
					}
				}
				break

			// Seek backwards on Left Arrow key.
			case 37:
				if (seekOnArrowKeys &&
					(seekOnArrowKeysAtBorders || hasStarted() === true)
				) {
					if (seek(false)) {
						event.preventDefault()
					}
				}
				break

			// Seek forward on Right Arrow key.
			case 39:
				if (seekOnArrowKeys &&
					(seekOnArrowKeysAtBorders || hasEnded() === false)
				) {
					if (seek(true)) {
						event.preventDefault()
					}
				}
				break

			// Seek to start on Home key.
			case 36:
				if (seekTo(0)) {
					event.preventDefault()
				}
				break

			// Seek to end on End key.
			case 35:
				if (seekTo(video.duration)) {
					event.preventDefault()
				}
				break

			// Volume Up on Up Arrow key.
			case 38:
				if (changeVolumeOnArrowKeys) {
					if (changeVolume(true)) {
						event.preventDefault()
					}
				}
				break

			// Volume Down on Down Arrow key.
			case 40:
				if (changeVolumeOnArrowKeys) {
					if (changeVolume(false)) {
						event.preventDefault()
					}
				}
				break

			// Toggle mute on "M" key.
			case 77:
				if (toggleMute()) {
					event.preventDefault()
				}
				break

			// Toggle fullscreen on "F" key.
			case 70:
				if (!showPreview) {
					let node
					// If focus is not inside the element being promoted to
					// fullscreen then the focus is lost upon entering fullscreen.
					if (shouldFocusPlayer(video)) {
						node = playerRef.current && getPlayerNode(playerRef.current, video)
					}
					node = node || playerContainerInnerRef.current
					if (isFullScreen.current) {
						exitFullScreen()
					} else {
						enterFullScreen(node)
					}
					event.preventDefault()
				}
				break
		}
	}

	function enterFullScreen(node) {
		if (requestFullScreen(node)) {
			isFullScreen.current = true
		}
	}

	function exitFullScreen() {
		_exitFullScreen()
		isFullScreen.current = false
	}

	function addBorder(dimension) {
		if (border) {
			return dimension + 2 * BORDER_WIDTH
		}
		return dimension
	}

	function getMaxWidth() {
		const maxWidths = []
		if (maxWidth) {
			maxWidths.push(maxWidth)
		}
		if (maxHeight) {
			maxWidths.push(maxHeight * getAspectRatio(video))
		}
		if (fit === 'scale-down') {
			maxWidths.push(getMaxSize(video).width)
		}
		if (maxWidths.length > 0) {
			return Math.min(...maxWidths)
		}
	}

	function getContainerStyle() {
		if (width || height) {
			return {
				width: addBorder(width || (height * getAspectRatio(video))) + 'px',
				height: addBorder(height || (width / getAspectRatio(video))) + 'px'
			}
		}
		if (maxWidth || maxHeight) {
			return {
				width: '100%',
				maxWidth: addBorder(getMaxWidth()) + 'px'
			}
		}
	}

	if (showPreview) {
		return (
			<Picture
				{...rest}
				ref={previewRef}
				border={border}
				picture={video.picture}
				component={ButtonOrLink}
				url={getUrl(video)}
				onClick={onClick}
				tabIndex={tabIndex}
				width={expand ? undefined : width}
				height={expand ? undefined : height}
				maxWidth={expand ? getMaxSize(video).width : getMaxWidth()}
				maxHeight={expand ? undefined : maxHeight}
				aria-hidden
				style={style}
				className={classNames(
					className,
					'rrui__video',
					'rrui__video__preview',
					'rrui__button-reset', {
						'rrui__video--border': border
					}
				)}>
				{showPlayIcon &&
					<VideoPlayIcon className="rrui__video__play-icon--center"/>
				}
				{!showPlayIcon &&
					<VideoDuration duration={video.duration}/>
				}
			</Picture>
		)
	}

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
		<AspectRatioWrapper
			{...rest}
			innerRef={playerContainerInnerRef}
			onKeyDown={onKeyDown}
			aspectRatio={getAspectRatio(video)}
			innerTabIndex={!shouldFocusPlayer(video) ? tabIndex : -1}
			innerClassName="rrui__video__player-container-inner"
			style={style ? { ...style, ...getContainerStyle() } : getContainerStyle()}
			className={classNames(
				className,
				'rrui__video', {
					'rrui__video--border': !shouldFocusPlayer(video) && border
				}
			)}>
			<VideoPlayer
				ref={playerRef}
				video={video}
				preview={showPreview}
				autoPlay={shouldStartPlaying}
				tabIndex={shouldFocusPlayer(video) ? tabIndex : undefined}
				onClick={onClick}
				className={classNames({
					'rrui__video--border': shouldFocusPlayer(video) && border
				})}/>
		</AspectRatioWrapper>
	)
}

Video = React.forwardRef(Video)

Video.propTypes = {
	video: video.isRequired,
	width: PropTypes.number,
	height: PropTypes.number,
	maxWidth: PropTypes.number,
	maxHeight: PropTypes.number,
	fit: PropTypes.oneOf(['scale-down']),
	preview: PropTypes.bool.isRequired,
	stopVideoOnStopPlaying: PropTypes.bool,
	seekOnArrowKeys: PropTypes.bool.isRequired,
	seekOnArrowKeysAtBorders: PropTypes.bool.isRequired,
	seekStep: PropTypes.number.isRequired,
	changeVolumeOnArrowKeys: PropTypes.bool.isRequired,
	changeVolumeStep: PropTypes.number.isRequired,
	playable: PropTypes.bool.isRequired,
	autoPlay: PropTypes.bool.isRequired,
	showPlayIcon: PropTypes.bool,
	onClick: PropTypes.func,
	tabIndex: PropTypes.number,
	border: PropTypes.bool,
	expand: PropTypes.bool,
	style: PropTypes.object,
	className: PropTypes.string
}

Video.defaultProps = {
	preview: true,
	seekOnArrowKeys: true,
	seekOnArrowKeysAtBorders: true,
	seekStep: 5,
	changeVolumeOnArrowKeys: true,
	changeVolumeStep: 0.1,
	playable: true,
	autoPlay: false
}

export default Video

function VideoPlayer({
	video,
	preview,
	autoPlay,
	tabIndex,
	onClick
}, ref) {
	if (!video.provider) {
		// `onClick` is used to prevent Chrome Video player
		// triggering "pause"/"play" on click while dragging.
		return (
			<HtmlVideo
				width="100%"
				height="100%"
				preview={preview}
				ref={ref}
				onClick={onClick}
				tabIndex={tabIndex}
				video={video}
				autoPlay={autoPlay}/>
		)
	}

	if (video.provider === 'YouTube' && hasYouTubeVideoPlayerApiLoaded()) {
		// `<video/>` can maintain its aspect ratio during layout
		// while `<iframe/>` can't, so using the `paddingBottom` trick here
		// to preserve aspect ratio.
		return (
			<YouTubeVideo
				ref={ref}
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
		//
		// `<video/>` can maintain its aspect ratio during layout
		// while `<iframe/>` can't, so using the `paddingBottom` trick here
		// to preserve aspect ratio.
		return (
			<iframe
				ref={ref}
				src={getEmbeddedVideoUrl(video.id, video.provider, {
					autoPlay,
					startAt: video.startAt
				})}
				width="100%"
				height="100%"
				frameBorder={0}
				allow="autoplay; fullscreen"
				allowFullScreen/>
		)
	}

	console.error(`Unsupported video provider: ${video.provider}`)
	return null
}

VideoPlayer = React.forwardRef(VideoPlayer)

VideoPlayer.propTypes = {
	video: video.isRequired,
	preview: PropTypes.bool,
	autoPlay: PropTypes.bool,
	tabIndex: PropTypes.number,
	onClick: PropTypes.func
}

function getPlayerNode(playerRef, video) {
	if (video.provider === 'Vimeo') {
		return playerRef
	}
	if (video.provider === 'YouTube') {
		// YouTube video could be shown in a YouTube player
		// or as an `<iframe/>` (as a fallback).
		if (playerRef instanceof YouTubeVideo) {
			return playerRef.getDOMNode()
		}
		return playerRef
	}
	if (!video.provider) {
		return playerRef.getDOMNode()
	}
}

function shouldFocusPlayer(video) {
	// HTML `<video/>` player is focusable
	// and it doesn't consume `keydown` events.
	// `<iframes/>` aren't interactive elements
	// and also they don't bubble `keydown` events.
	return !video.provider
}

function videoPlayerHandlesTogglePlayOnSpacebar(video) {
	// HTML `<video/>` player already handles toggling play/pause on Spacebar.
	return !video.provider
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

function AspectRatioWrapper({ innerRef, innerTabIndex, innerClassName, aspectRatio, children, ...rest }, ref) {
	const aspectRatioStyle = useMemo(() => ({
		position: 'relative',
		width: '100%',
		paddingBottom: 100 / aspectRatio + '%'
	}), [aspectRatio])
	return (
		<div ref={ref} {...rest}>
			<div style={aspectRatioStyle}>
				<div
					ref={innerRef}
					tabIndex={innerTabIndex}
					style={ASPECT_RATIO_WRAPPER_INNER_STYLE}
					className={innerClassName}>
					{children}
				</div>
			</div>
		</div>
	)
}

AspectRatioWrapper = React.forwardRef(AspectRatioWrapper)

AspectRatioWrapper.propTypes = {
	aspectRatio: PropTypes.number.isRequired,
	children: PropTypes.node.isRequired
}

const ASPECT_RATIO_WRAPPER_INNER_STYLE = {
	position: 'absolute',
	width: '100%',
	height: '100%'
}