import React from 'react'
import PropTypes from 'prop-types'

import { videoShape } from '../PropTypes'
import { getEmbeddedVideoURL } from '../utility/video'

import './Video.css'

export default function Video({ video }) {
	if (video.source.provider) {
		let aspectRatio
		if (video.source.width && video.source.height) {
			aspectRatio = video.source.width / video.source.height
		} else {
			aspectRatio = 16 / 9
		}
		return (
			<div
				className="video"
				style={{ paddingBottom: 100 / aspectRatio + '%' }}>
				<iframe
					src={getEmbeddedVideoURL(video.id, video.source.provider)}
					width={width}
					height={height}
					frameBorder={0}
					allowFullScreen />
			</div>
		)
	}

	if (video.source.sourceType === 'file') {
		return null
	}

	return null
}

Video.propTypes = {
	video: videoShape.isRequired,
	width: PropTypes.number,
	height: PropTypes.number
}