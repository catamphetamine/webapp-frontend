import React from 'react'

import { getAspectRatio } from './Picture'
import Video, { getMaxSize, getUrl } from './Video'

export default {
	minInitialScale: 0.5,
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
	onKeyDown(event, slide, ref) {
		const video = ref.current
		switch (event.keyCode) {
			// Capture Spacebar (Play/Pause).
			case 32:
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
	// 	if (props.slideshowMode) {
	// 		ref.showVideo(() => ref.play())
	// 	}
	// },
	render({
		ref,
		slide,
		isCurrentSlide,
		autoPlay,
		slideshowMode,
		onClick,
		maxWidth,
		maxHeight,
		tabIndex,
		style
	}) {
		return (
			<Video
				ref={ref}
				video={slide.video}
				onClick={onClick}
				playable={isCurrentSlide}
				autoPlay={slideshowMode || autoPlay}
				stopVideoOnStopPlaying
				showPlayIcon
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				fit="scale-down"
				tabIndex={tabIndex}
				preview={slideshowMode ? false : undefined}
				seekOnArrowKeys={slideshowMode ? false : undefined}
				seekOnArrowKeysAtBorders={false}
				style={style}
				className="rrui__slideshow__video"/>
		)
	}
}