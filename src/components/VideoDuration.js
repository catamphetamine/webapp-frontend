import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import PictureBadge from './PictureBadge'

import './VideoDuration.css'

export default function VideoDuration({ duration }) {
	return (
		<PictureBadge
			placement="bottom-right"
			className={classNames('Video-duration', {
				'Video-duration--time': duration
			})}>
			{duration ? formatVideoDuration(duration) : '▶'}
		</PictureBadge>
	)
}

VideoDuration.propTypes = {
	duration: PropTypes.number,
	children: PropTypes.string
}

function formatVideoDuration(seconds) {
	let minutes = Math.floor(seconds / 60)
	seconds = seconds % 60
	const hours = Math.floor(minutes / 60)
	minutes = minutes % 60
	if (hours === 0) {
		return minutes + ':' + formatTwoPositions(seconds)
	}
	return hours + ':' + formatTwoPositions(minutes) + ':' + formatTwoPositions(seconds)
}

function formatTwoPositions(number) {
	if (number < 10) {
		return '0' + number
	}
	return number
}