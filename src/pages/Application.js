import React, { useEffect, useCallback } from 'react'
import PropTypes from 'prop-types'
import { useDispatch, useSelector } from 'react-redux'
import { Loading } from 'react-pages'

// Not importing `Tooltip.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-time-ago/Tooltip.css'
import 'react-pages/components/Loading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-pages/components/LoadingIndicator.css'

// `react-time-ago` English language.
import '../components/TimeAgo.en'

import Snackbar from '../components/Snackbar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import DeviceInfo from '../components/DeviceInfo'
import Slideshow from '../components/Slideshow'
import { loadYouTubeVideoPlayerApi } from '../components/YouTubeVideo'

import { closeSlideshow } from '../redux/slideshow'

import './Application.css'

export default function App({ children }) {
	const dispatch = useDispatch()
	const onCloseSlideshow = useCallback(() => dispatch(closeSlideshow()), [dispatch])
	const slideshowIndex = useSelector(({ slideshow }) => slideshow.index)
	const slideshowIsOpen = useSelector(({ slideshow }) => slideshow.isOpen)
	const slideshowPictures = useSelector(({ slideshow }) => slideshow.pictures)
	const slideshowMode = useSelector(({ slideshow }) => slideshow.slideshowMode)
	useEffect(() => {
		// Load YouTube video player API on application initialization.
		loadYouTubeVideoPlayerApi()
	}, [])
	return (
		<React.Fragment>
			{/* Page loading indicator */}
			<Loading/>

			{/* Pop-up messages */}
			<Snackbar/>

			{/* Detects touch capability and screen size. */}
			<DeviceInfo/>

			{/* Picture Slideshow */}
			{slideshowPictures &&
				<Slideshow
					i={slideshowIndex}
					isOpen={slideshowIsOpen}
					slideshowMode={slideshowMode}
					onClose={onCloseSlideshow}>
					{slideshowPictures}
				</Slideshow>
			}

			<div className="webpage document--background">
				<Header/>

				<div className="webpage__content">
					{ children }
				</div>

				<Footer/>
			</div>
		</React.Fragment>
	)
}

App.propTypes = {
	children: PropTypes.node.isRequired
}