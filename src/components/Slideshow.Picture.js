import React from 'react'

import Picture, {
	preloadImage,
	getPreferredSize,
	getAspectRatio,
	isVector
} from './Picture'

import Search from '../../assets/images/icons/menu/search-outline.svg'

// import GoogleIcon from '../../assets/images/icons/services/google-thin-monochrome.svg'
// import GoogleIcon from '../../assets/images/icons/services/google-monochrome.svg'

export default {
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
	preload(slide, width) {
		return preloadImage(getPreferredSize(slide.picture, width).url)
	},
	render({
		ref,
		slide,
		onClick,
		tabIndex,
		maxWidth,
		maxHeight,
		style
	}) {
		return (
			<Picture
				ref={ref}
				picture={slide.picture}
				onClick={onClick}
				tabIndex={tabIndex}
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