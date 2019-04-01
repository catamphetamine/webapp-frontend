import React from 'react'

import {
	getAspectRatio as getPictureAspectRatio
} from './Picture'

import Video, {
	getMaxSize as getMaxVideoSize
} from './Video'

export default {
	changeSlideOnClick: false,
	// showCloseButtonForSingleSlide: true,
	getMaxSize(slide) {
		return getMaxVideoSize(slide)
	},
	getAspectRatio(slide) {
		if (slide.aspectRatio) {
			return slide.aspectRatio
		}
		return getPictureAspectRatio(slide.picture)
	},
	// isScaleDownAllowed(slide) {
	// 	return false
	// },
	onKeyDown(event, slide, ref) {
		switch (slide.source.provider) {
			case 'file':
				const video = ref.current
				switch (event.keyCode) {
					// (is already handled by the `<video/>` itself)
					// // Pause/Play on Spacebar.
					// case 32:
					// 	if (video.isPaused()) {
					// 		video.play()
					// 	} else {
					// 		video.pause()
					// 	}
					// 	event.preventDefault()
					// 	break

					// Seek backwards on Left Arrow key.
					case 37:
						if (!video.hasEnded()) {
							video.seek(-5)
							event.preventDefault()
						}
						break

					// Seek forward on Right Arrow key.
					case 39:
						if (!video.hasEnded()) {
							video.seek(5)
							event.preventDefault()
						}
						break
				}
				return
			default:
				return
		}
	},
	canDownload(slide) {
		switch (slide.source.provider) {
			case 'file':
				return true
			default:
				return false
		}
	},
	getDownloadLink(slide) {
		switch (slide.source.provider) {
			case 'file':
				return slide.source.sizes[slide.source.sizes.length - 1].url
		}
	},
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
				fit="scale-down"
				onClick={onClick}
				autoPlay={wasExpanded ? true : false}
				showPreview={wasExpanded ? false : true}
				showPlayIcon={wasExpanded ? false : true}
				canPlay={isShown}
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				tabIndex={tabIndex}
				style={style}
				className="rrui__slideshow__video"/>
		)
	}
}