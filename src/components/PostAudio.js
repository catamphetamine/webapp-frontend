import React from 'react'
import PropTypes from 'prop-types'
import { audio } from '../PropTypes'

import './PostAudio.css'

export default function PostAudio({ audio }) {
	if (!audio.provider) {
		return <PostAudioFile audio={audio} className="post__audio"/>
	}
	console.error(`Unsupported audio provider: "${audio.provider}`)
	return (
		<div className="post__audio">
			{audio.author}
			{audio.author && ' — '}
			{audio.title}
		</div>
	)
}

PostAudio.propTypes = {
	audio: audio.isRequired
}

function PostAudioFile({ audio, className }) {
	return (
		<section className={className}>
			<audio controls>
				<source
					type={audio.type}
					src={audio.url}/>
			</audio>
			<h1>
				{audio.author}
				{audio.author && ' — '}
				{audio.title}
			</h1>
		</section>
	)
}

PostAudioFile.propTypes = {
	audio: audio.isRequired,
	className: PropTypes.string
}

export const EXAMPLE_1 = {
	author: 'U.N.K.L.E.',
	title: 'Looking For The Rain ft. Mark Lanegan',
	type: 'audio/ogg',
	bitrate: 92 * 1024 * 8,
	url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Toreador_song_cleaned.ogg'
}

export const EXAMPLE_2 = {
	author: 'U.N.K.L.E.',
	title: 'Looking For The Rain ft. Mark Lanegan',
	description: 'The video for Looking for the Rain was created by filming a variety of subjects from nature, such as water, crystals and plants. The footage was composited in several stages to eventually form a moving tunnel of light that features synchronised repetition and bilateral symmetry.',
	date: new Date(),
	duration: 358,
	picture: {
		type: 'image/jpeg',
		width: 640,
		height: 360,
		url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/55/UNKLE.jpg/640px-UNKLE.jpg'
	},
	type: 'audio/ogg',
	bitrate: 92 * 1024 * 8,
	url: 'https://upload.wikimedia.org/wikipedia/commons/4/40/Toreador_song_cleaned.ogg'
}