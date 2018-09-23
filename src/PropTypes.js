import { shape, arrayOf, number, string, object, oneOf, oneOfType, instanceOf } from 'prop-types'

const id = oneOfType([
	number,
	string
])

export const pictureShape = shape({
	type: oneOf([
		'image/svg+xml',
		'image/jpeg',
		'image/png',
		'image/webp'
	]).isRequired,
	sizes: arrayOf(shape({
		url: string.isRequired,
		// Dimensions are not required for SVGs.
		width: number,
		height: number
	})).isRequired
})

const providerVideoSourceShape = shape({
	provider: string.isRequired,
	id: string.isRequired,
	width: number.isRequired,
	height: number.isRequired
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
	picture: pictureShape,
	source: oneOfType([
		providerAudioSourceShape,
		fileAudioSourceShape
	]).isRequired
})

export const personShape = shape({
	id: id.isRequired,
	firstName: string,
	lastName: string,
	middleName: string,
	gender: string,
	birthDate: instanceOf(Date),
	country: string,
	state: string,
	city: string
})

export const userShape = shape({
	id: id.isRequired,
	email: string,
	phone: string,
	blockedAt: instanceOf(Date),
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
	nameId: string,
	picture: pictureShape
}

export const accountShape = shape(accountProperties)

export const accountShapeProfile = shape({
	...accountProperties,
	user: userShape,
	users: arrayOf(userShape),
	description: string,
	data: shape({
		backgroundPicture: pictureShape,
		whereabouts: string,
		links: arrayOf(shape({
			url: string.isRequired,
			text: string.isRequired
		}))
	}).isRequired
})

const linkShape = shape({
	type: oneOf(['link']).isRequired,
	url: string.isRequired,
	text: string.isRequired
})

export const listShape = shape({
	type: oneOf(['list']).isRequired,
	items: arrayOf(string).isRequired
})

const postPartShape = oneOfType([
	string,
	listShape,
	arrayOf(oneOfType([
		string,
		linkShape
	]))
])

const pictureAttachmentShape = shape({
	type: oneOf(['picture']).isRequired,
	picture: pictureShape.isRequired
})

const videoAttachmentShape = shape({
	type: oneOf(['video']).isRequired,
	video: videoShape.isRequired
})

const audioAttachmentShape = shape({
	type: oneOf(['audio']).isRequired,
	audio: audioShape.isRequired
})

const linkAttachmentShape = shape({
	type: oneOf(['link']).isRequired,
	link: linkShape.isRequired
})

export const postShape = shape({
	id: id.isRequired,
	content: arrayOf(postPartShape).isRequired,
	account: accountShape.isRequired,
	attachments: arrayOf(oneOfType([
		pictureAttachmentShape,
		videoAttachmentShape,
		audioAttachmentShape,
		linkAttachmentShape
	]))
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})