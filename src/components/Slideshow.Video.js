import React from 'react'

import { getAspectRatio } from './Picture'
import Video, { getMaxSize } from './Video'

export default {
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
	onKeyDown(event, slide, ref) {
		switch (slide.provider) {
			case undefined:
				const video = ref.current
				switch (event.keyCode) {
					// Seek backwards on Left Arrow key.
					case 37:
						// Only seek backwards on left arrow key if the video isn't at its start.
						// If the video is at its start then left arrow key will navigate to the previous slide.
						if (video.isStart() === false) {
							if (video.seek(false)) {
								event.preventDefault()
							}
						}
						break

					// Seek forward on Right Arrow key.
					case 39:
						// Only seek forward on right arrow key if the video hasn't ended.
						// If the video has ended then right arrow key will navigate to the next slide.
						if (video.isEnd() === false) {
							if (video.seek(true)) {
								event.preventDefault()
							}
						}
						break
				}
				return
			default:
				return
		}
	},
	canDownload(slide) {
		switch (slide.provider) {
			case undefined:
				return true
			default:
				return false
		}
	},
	getDownloadLink(slide) {
		switch (slide.provider) {
			case undefined:
				return slide.url
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
				style={style}
				className="rrui__slideshow__video"/>
		)
	}
}