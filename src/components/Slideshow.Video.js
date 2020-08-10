import React from 'react'
import classNames from 'classnames'

import { getAspectRatio } from './Picture'
import Video, { getMaxSize, getUrl } from './Video'
import { isKey } from '../utility/keys'

export default {
	minInitialScale: 0.65,
	// showCloseButtonForSingleSlide: true,
	getMaxSize(slide) {
		return getMaxSize(slide.video)
	},
	getAspectRatio(slide) {
		if (slide.video.aspectRatio) {
			return slide.video.aspectRatio
		}
		return getAspectRatio(slide.video.picture)
	},
	// isScaleDownAllowed(slide) {
	// 	return false
	// },
	// capturesArrowKeys(slide) {
	// 	return true
	// },
	canSwipe(slide) {
		switch (slide.video.provider) {
			// iOS Safari has a bug when YouTube video is played in fullscreen slideshow:
			// touch scroll goes through it and it doesn't respond to swiping.
			// I guess Vimeo could have the same bug (didn't test).
			// On desktop mouse users are unable to swipe the video <iframe/> too.
			case 'YouTube':
			case 'Vimeo':
				return false
			default:
				return true
		}
	},
	// hasCloseButtonClickingIssues(slide) {
	// 	switch (slide.video.provider) {
	// 		// (Experienced both in iOS Safari and in desktop Chrome)
	// 		// Even though slideshow actions are shown above a YouTube video <iframe/>
	// 		// clicks are being captured by that video <iframe/> for some reason.
	// 		// I guess Vimeo could have the same bug (didn't test).
	// 		case 'YouTube':
	// 		case 'Vimeo':
	// 			return true
	// 		default:
	// 			return false
	// 	}
	// },
	onKeyDown(event) {
		// Capture Spacebar (Play/Pause).
		if (isKey('Space', event)) {
			// Spacebar is always handled by the `<Video/>` which is focused.
			return true
		}
	},
	canOpenExternalLink(slide) {
		return true
	},
	getExternalLink(slide) {
		return getUrl(slide.video)
	},
	// canDownload(slide) {
	// 	switch (slide.video.provider) {
	// 		case undefined:
	// 			return true
	// 		default:
	// 			return false
	// 	}
	// },
	// getDownloadLink(slide) {
	// 	switch (slide.video.provider) {
	// 		case undefined:
	// 			return slide.video.url
	// 	}
	// },
	canRender(slide) {
		return slide.type === 'video'
	},
	// onShowSlide(slide, ref, props) {
	// 	if (props.mode === 'flow') {
	// 		ref.showVideo(() => ref.play())
	// 	}
	// },
	render({
		ref,
		slide,
		isCurrentSlide,
		autoPlay,
		mode,
		onClick,
		width,
		height,
		// maxWidth,
		// maxHeight,
		tabIndex,
		style,
		className
	}) {
		// maxWidth={maxWidth}
		// maxHeight={maxHeight}
		// Disables video seeking on Left/Right arrow in "flow" slideshow mode.
		// seekOnArrowKeys={mode === 'flow' ? false : undefined}
		return (
			<Video
				ref={ref}
				video={slide.video}
				onClick={onClick}
				playable={isCurrentSlide}
				autoPlay={mode === 'flow' || autoPlay}
				stopVideoOnStopPlaying
				showPlayIcon
				width={width}
				height={height}
				fit="scale-down"
				tabIndex={tabIndex}
				preview={mode === 'flow' ? false : undefined}
				seekOnArrowKeysAtBorders={false}
				style={style}
				className={classNames('rrui__slideshow__video', className)}/>
		)
	}
}