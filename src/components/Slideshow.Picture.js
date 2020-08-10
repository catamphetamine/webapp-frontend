import React from 'react'
import classNames from 'classnames'

import Picture, {
	preloadImage,
	getFitSize,
	getPreferredSize,
	getAspectRatio,
	isVector
} from './Picture'

import Search from '../../assets/images/icons/menu/search-outline.svg'

// import GoogleIcon from '../../assets/images/icons/services/google-thin-monochrome.svg'
// import GoogleIcon from '../../assets/images/icons/services/google-monochrome.svg'

export default {
	allowChangeSlideOnClick: true,
	getMaxSize(slide) {
		return slide.picture
	},
	getAspectRatio(slide) {
		return getAspectRatio(slide.picture)
	},
	// isScaleDownAllowed(slide) {
	// 	return isVector(slide.picture)
	// },
	canOpenExternalLink(slide) {
		return true
	},
	getExternalLink(slide) {
		return slide.picture.url
	},
	getOtherActions(slide) {
		return [{
			name: 'searchInGoogle',
			icon: Search, // SearchInGoogleIcon
			link: `https://images.google.com/searchbyimage?image_url=${slide.picture.url}`
		}]
	},
	canRender(slide) {
		return slide.type === 'picture'
	},
	// preload(slide, width, height) {
	// 	return preloadImage(getPreferredSize(slide.picture, getFitSize(slide.picture, width, height)).url)
	// },
	render({
		ref,
		slide,
		onClick,
		tabIndex,
		width,
		height,
		// maxWidth,
		// maxHeight,
		// scale,
		style,
		className
	}) {
		// pixelRatioMultiplier={scale}
		// maxWidth={maxWidth}
		// maxHeight={maxHeight}
		return (
			<Picture
				ref={ref}
				picture={slide.picture}
				onClick={onClick}
				tabIndex={tabIndex}
				showLoadingIndicator
				showLoadingPlaceholder={false}
				width={width}
				height={height}
				style={style}
				className={classNames('rrui__slideshow__picture', className)}/>
		)
	}
}

// function SearchInGoogleIcon({ className }) {
// 	return (
// 		<div className={className}>
// 			<Search style={SEARCH_IN_GOOGLE_SEARCH_ICON_STYLE}/>
// 			<GoogleIcon style={SEARCH_IN_GOOGLE_GOOGLE_ICON_STYLE}/>
// 		</div>
// 	)
// }

// const SEARCH_IN_GOOGLE_SEARCH_ICON_STYLE = {
// 	width: '100%',
// 	height: '100%',
// }

// const SEARCH_IN_GOOGLE_GOOGLE_ICON_STYLE = {
// 	width: '40%',
// 	height: '40%',
// 	position: 'absolute',
// 	left: '22%',
// 	top: '22%'
// }

/**
 * Preloads a picture slide.
 * @param  {object} slide
 * @param  {object} slideshow
 * @return {Promise}
 */
export function preloadPictureSlide(slide) {
	const slideshowSize = window.SlideshowSize
	return preloadImage(getPreferredSize(
		slide.picture,
		getFitSize(
			slide.picture,
			slideshowSize.getMaxSlideWidth(),
			slideshowSize.getMaxSlideHeight()
		)
	).url)
}