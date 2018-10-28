import { shape, arrayOf, number, string, object, oneOf, oneOfType, instanceOf } from 'prop-types'

const id = oneOfType([
	number,
	string
])

const date = instanceOf(Date)

export const pictureShape = shape({
	type: oneOf([
		'image/svg+xml',
		'image/jpeg',
		'image/png',
		'image/webp'
	]).isRequired,
	title: string,
	description: string,
	date: date,
	dateUTC0: date,
	coordinates: shape({
		latitude: number,
		longitude: number,
		altitude: number
	}),
	sizes: arrayOf(shape({
		url: string.isRequired,
		// Dimensions are also required for SVGs for calculating aspect ratio.
		width: number.isRequired,
		height: number.isRequired
	})).isRequired
})

const providerVideoSourceShape = shape({
	provider: string.isRequired,
	id: string.isRequired
})

const fileVideoSourceShape = shape({
	type: oneOf([
		'video/mp4'
	]).isRequired,
	sourceType: oneOf(['file']).isRequired,
	sizes: arrayOf(shape({
		url: string.isRequired,
		width: number.isRequired,
		height: number.isRequired
	})).isRequired
})

export const videoShape = shape({
	title: string,
	description: string,
	width: number,
	height: number,
	duration: number,
	picture: pictureShape.isRequired,
	source: oneOfType([
		providerVideoSourceShape,
		fileVideoSourceShape
	]).isRequired
})

const providerAudioSourceShape = shape({
	provider: string.isRequired,
	id: string.isRequired
})

const fileAudioSourceShape = shape({
	type: oneOf([
		'audio/mpeg',
		'audio/ogg',
	]).isRequired,
	sourceType: oneOf(['file']).isRequired,
	sizes: arrayOf(shape({
		url: string.isRequired,
		bitrate: number.isRequired
	})).isRequired
})

export const audioShape = shape({
	author: string.isRequired,
	title: string.isRequired,
	description: string,
	picture: pictureShape,
	source: oneOfType([
		providerAudioSourceShape,
		fileAudioSourceShape
	]).isRequired
})

const linkShape = shape({
	url: string.isRequired,
	text: string.isRequired
})

export const personShape = shape({
	id: id.isRequired,
	firstName: string,
	lastName: string,
	middleName: string,
	gender: string,
	birthDate: date,
	country: string,
	state: string,
	city: string
})

export const userShape = shape({
	id: id.isRequired,
	email: string,
	phone: string,
	blockedAt: date,
	blockedBy: id,
	blockedReason: string,
	// person: personShape,
	// account: accountShape.isRequired
})

const accountProperties = {
	id: id.isRequired,
	name: string,
	firstName: string,
	lastName: string,
	idAlias: string,
	picture: pictureShape
}

export const accountShape = shape(accountProperties)

export const accountShapeProfile = shape({
	...accountProperties,
	user: userShape,
	users: arrayOf(userShape),
	description: string,
	backgroundPicture: pictureShape,
	whereabouts: string,
	links: arrayOf(shape({
		url: string.isRequired,
		text: string.isRequired
	}))
})

export const postTextShape = string

export const postLinkShape = shape({
	type: oneOf(['link']).isRequired,
	link: linkShape.isRequired
})

export const postHeadingShape = shape({
	type: oneOf(['heading']).isRequired,
	heading: shape({
		text: string.isRequired
	}).isRequired
})

export const postParagraphShape = string

export const postListShape = shape({
	type: oneOf(['list']).isRequired,
	list: shape({
		items: arrayOf(string).isRequired
	}).isRequired
})

export const postQuoteShape = shape({
	type: oneOf(['quote']).isRequired,
	quote: shape({
		text: string.isRequired,
		source: string,
		url: string
	}).isRequired
})

// export const postPictureShape = shape({
// 	type: oneOf(['picture']).isRequired,
// 	picture: pictureShape.isRequired
// })

// export const postVideoShape = shape({
// 	type: oneOf(['video']).isRequired,
// 	video: videoShape.isRequired
// })

// export const postAudioShape = shape({
// 	type: oneOf(['audio']).isRequired,
// 	audio: audioShape.isRequired
// })

export const postEmbeddedAttachmentShape = shape({
	type: oneOf(['attachment']).isRequired,
	attachmentId: number.isRequired
})

export const postPartShape = oneOfType([
	postHeadingShape,
	postParagraphShape,
	postListShape,
	postQuoteShape,
	postEmbeddedAttachmentShape,
	arrayOf(oneOfType([
		postTextShape,
		postLinkShape
	]))
])

export const pictureAttachmentShape = shape({
	id: id.isRequired,
	type: oneOf(['picture']).isRequired,
	picture: pictureShape.isRequired
})

export const videoAttachmentShape = shape({
	id: id.isRequired,
	type: oneOf(['video']).isRequired,
	video: videoShape.isRequired
})

export const audioAttachmentShape = shape({
	id: id.isRequired,
	type: oneOf(['audio']).isRequired,
	audio: audioShape.isRequired
})

export const linkAttachmentShape = shape({
	id: id.isRequired,
	type: oneOf(['link']).isRequired,
	link: shape({
		title: string.isRequired,
		description: string.isRequired,
		url: string.isRequired,
		picture: pictureShape
	})
})

export const postAttachmentShape = oneOfType([
	pictureAttachmentShape,
	videoAttachmentShape,
	audioAttachmentShape,
	linkAttachmentShape
])

export const postShape = shape({
	id: id.isRequired,
	content: oneOfType([
		string,
		arrayOf(postPartShape)
	]).isRequired,
	account: accountShape.isRequired,
	attachments: arrayOf(postAttachmentShape)
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})