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
		'image/gif',
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
		'video/mp4',
		'video/ogg',
		'video/webm'
	]).isRequired,
	provider: oneOf(['file']).isRequired,
	sizes: arrayOf(shape({
		url: string.isRequired,
		width: number.isRequired,
		height: number.isRequired
	})).isRequired
})

export const videoShape = shape({
	title: string,
	description: string,
	duration: number,
	width: number,
	height: number,
	aspectRatio: number,
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
		'audio/ogg'
	]).isRequired,
	provider: oneOf(['file']).isRequired,
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

const linkShape = {
	url: string.isRequired,
	content: string.isRequired
}

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
	links: arrayOf(shape(linkShape))
})

export const postText = string

export const postStyledText = shape({
	type: oneOf(['text']).isRequired,
	style: string.isRequired,
	content: oneOfType([
		string,
		// postStyledText
		object
	]).isRequired
})

const postNewLine = oneOf(['\n'])

const postInlineElementContent = oneOfType([
	string,
	arrayOf([
		string,
		postNewLine,
		postStyledText
	])
])

export const postInlineLink = shape({
	type: oneOf(['link']).isRequired,
	...linkShape
})

export const postHeading = shape({
	type: oneOf(['heading']).isRequired,
	content: string.isRequired
})

export const postSpoiler = shape({
	type: oneOf(['spoiler']).isRequired,
	content: postInlineElementContent.isRequired
})

export const postPostLinkShape = shape({
	type: oneOf(['post-link']).isRequired,
	postId: string.isRequired,
	threadId: string.isRequired,
	...linkShape
})

export const postQuote = shape({
	type: oneOf(['quote']).isRequired,
	content: postInlineElementContent.isRequired,
	source: string,
	url: string
})

const postInlineQuote = shape({
	type: oneOf(['inline-quote']).isRequired,
	content: postInlineElementContent.isRequired
})

const postInlineElement = oneOfType([
	postText,
	postStyledText,
	postInlineLink,
	postInlineQuote,
	// Custom chan.
	postNewLine,
	postSpoiler,
	postPostLinkShape
])

export const postParagraph = oneOfType([
	string,
	arrayOf(postInlineElement)
])

export const postList = shape({
	type: oneOf(['list']).isRequired,
	items: arrayOf(postInlineElementContent).isRequired
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

export const postBlock = oneOfType([
	postHeading,
	postParagraph,
	postList,
	postQuote,
	postEmbeddedAttachmentShape
])

export const pictureAttachmentShape = shape({
	id,
	type: oneOf(['picture']).isRequired,
	picture: pictureShape.isRequired
})

export const videoAttachmentShape = shape({
	id,
	type: oneOf(['video']).isRequired,
	video: videoShape.isRequired
})

export const audioAttachmentShape = shape({
	id,
	type: oneOf(['audio']).isRequired,
	audio: audioShape.isRequired
})

export const linkAttachmentShape = shape({
	id,
	type: oneOf(['link']).isRequired,
	link: shape({
		title: string.isRequired,
		description: string.isRequired,
		url: string.isRequired,
		picture: pictureShape
	})
})

export const fileAttachmentShape = shape({
	id,
	name: string.isRequired,
	contentType: string,
	size: number,
	url: string.isRequired
})

export const postAttachmentShape = oneOfType([
	pictureAttachmentShape,
	videoAttachmentShape,
	audioAttachmentShape,
	linkAttachmentShape,
	fileAttachmentShape
])

export const postShape = shape({
	id: id.isRequired,
	title: string,
	content: oneOfType([
		string,
		arrayOf(postBlock)
	]),
	account: accountShape, //.isRequired,
	commentsCount: number,
	attachmentsCount: number,
	attachments: arrayOf(postAttachmentShape)
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})