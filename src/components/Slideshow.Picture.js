import React from 'react'

import Picture, {
	preloadImage,
	getPreferredSize,
	getAspectRatio,
	getMaxSize as getMaxPictureSize,
	isVector
} from './Picture'

import Search from '../../assets/images/icons/menu/search-outline.svg'

// import GoogleIcon from '../../assets/images/icons/services/google-thin-monochrome.svg'
// import GoogleIcon from '../../assets/images/icons/services/google-monochrome.svg'

export default {
	getMaxSize(slide) {
		return getMaxPictureSize(slide)
	},
	getAspectRatio(slide) {
		return getAspectRatio(slide)
	},
	// isScaleDownAllowed(slide) {
	// 	return isVector(slide)
	// },
	canDownload(slide) {
		return true
	},
	getDownloadLink(slide) {
		return slide.sizes[slide.sizes.length - 1].url
	},
	getOtherActions(slide) {
		return [{
			name: 'searchInGoogle',
			icon: Search, // SearchInGoogleIcon
			link: `https://images.google.com/searchbyimage?image_url=${slide.sizes[slide.sizes.length - 1].url}`
		}]
	},
	canRender(slide) {
		return slide.sizes !== undefined
	},
	preload(slide, width) {
		return preloadImage(getPreferredSize(slide.sizes, width).url)
	},
	render({
		ref,
		slide,
		onClick,
		maxWidth,
		maxHeight,
		style
	}) {
		// fit={shouldUpscaleSmallSlides ? 'contain' : 'scale-down'}
		// onClick={onClickPrecise}
		return (
			<Picture
				ref={ref}
				picture={slide}
				onClick={onClick}
				showLoadingIndicator
				fit="scale-down"
				maxWidth={maxWidth}
				maxHeight={maxHeight}
				style={style}
				className="rrui__slideshow__picture"/>
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