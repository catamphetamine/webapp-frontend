import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { meta, Loading } from 'react-website'
import { DragAndDrop } from 'react-responsive-ui'

// Not importing `Tooltip.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-time-ago/Tooltip.css'
import 'react-website/components/Loading.css'
// Not importing `LoadingIndicator.css` because
// it's already loaded as part of `react-responsive-ui`.
// import 'react-website/components/LoadingIndicator.css'

// `react-time-ago` English language.
import TimeAgo from 'javascript-time-ago'
import en from 'javascript-time-ago/locale/en'
TimeAgo.locale(en)

import Snackbar from '../components/Snackbar'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Slideshow from '../components/Slideshow'

import { closeSlideshow } from '../redux/slideshow'

import './Application.css'

@meta(state => ({
	site_name   : 'WebApp',
	title       : 'WebApp',
	description : 'A generic web application boilerplate',
	image       : 'https://www.google.ru/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png',
	locale      : 'ru_RU',
	locales     : ['ru_RU', 'en_US']
}))
@DragAndDrop()
@connect(({ slideshow }) => ({
	slideshowIndex: slideshow.index,
	slideshowIsOpen: slideshow.isOpen,
	slideshowPictures: slideshow.pictures
}), {
	closeSlideshow
})
export default class App extends Component
{
	static propTypes =
	{
		children : PropTypes.node.isRequired
	}

	render()
	{
		const {
			slideshowIndex,
			slideshowIsOpen,
			slideshowPictures,
			closeSlideshow,
			children
		} = this.props

		return (
			<div>
				{/* Page loading indicator */}
				<Loading/>

				{/* Pop-up messages */}
				<Snackbar/>

				{/* Picture Slideshow */}
				<Slideshow
					i={slideshowIndex}
					isOpen={slideshowIsOpen}
					onClose={closeSlideshow}>
					{slideshowPictures}
				</Slideshow>

				<div className="webpage">
					<Header/>

					<div className="webpage__content">
						{ children }
					</div>

					<Footer/>
				</div>
			</div>
		)
	}
}