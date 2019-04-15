import React from 'react'

import { getAspectRatio } from './Picture'
import Video, { getMaxSize, getUrl } from './Video'

export default {
	minInitialScale: 0.5,
	changeSlideOnClick: false,
	// showCloseButtonForSingleSlide: true,
	getMaxSize(slide) {
		return getMaxSize(slide)
	},
	getAspectRatio(slide) {
		if (slide.aspectRatio) {
			return slide.aspectRatio
		}
		return getAspectRatio(slide.picture)
	},
	// isScaleDownAllowed(slide) {
	// 	return false
	// },
	// capturesArrowKeys(slide) {
	// 	return true
	// },
	canSwipe(slide) {
		switch (slide.provider) {
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
	// 	switch (slide.provider) {
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
			// Seek backwards on Left Arrow key.
			case 37:
				// Only seek backwards on left arrow key if the video isn't at its start.
				// If the video is at its start then left arrow key will navigate to the previous slide.
				if (video.hasStarted() === true) {
					if (video.seek(false)) {
						event.preventDefault()
					}
				}
				break

			// Seek forward on Right Arrow key.
			case 39:
				// Only seek forward on right arrow key if the video hasn't ended.
				// If the video has ended then right arrow key will navigate to the next slide.
				if (video.hasEnded() === false) {
					if (video.seek(true)) {
						event.preventDefault()
					}
				}
				break

			// Volume Up on Up Arrow key.
			case 38:
				if (video.changeVolume(true)) {
					event.preventDefault()
				}
				break

			// Volume Down on Down Arrow key.
			case 40:
				if (video.changeVolume(false)) {
					event.preventDefault()
				}
				break
		}
		return
	},
	canOpenExternalLink(slide) {
		return true
	},
	getExternalLink(slide) {
		return getUrl(slide)
	},
	// canDownload(slide) {
	// 	switch (slide.provider) {
	// 		case undefined:
	// 			return true
	// 		default:
	// 			return false
	// 	}
	// },
	// getDownloadLink(slide) {
	// 	switch (slide.provider) {
	// 		case undefined:
	// 			return slide.url
	// 	}
	// },
	canRender(slide) {
		return slide.picture !== undefined
	},
	render({
		ref,
		slide,
		isShown,
		wasExpanded,
		onClick,
		maxWidth,
		maxHeight,
		tabIndex,
		style
	}) {
		return (
			<Video
				ref={ref}
				video={slide}
				onClick={onClick}
				autoPlay={wasExpanded ? true : false}
				showPreview={wasExpanded ? false : true}
				showPlayIcon={wasExpanded ? false : true}
				canPlay={isShown}
				fit="scale-down"
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				tabIndex={tabIndex}
				seekOnArrowKeys={false}
				changeVolumeOnArrowKeys={false}
				style={style}
				className="rrui__slideshow__video"/>
		)
	}
}