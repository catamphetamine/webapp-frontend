import {
	shape,
	arrayOf,
	number,
	string,
	bool,
	func,
	object,
	oneOf,
	oneOfType,
	instanceOf,
	elementType
} from 'prop-types'

const id = oneOfType([
	number,
	string
])

export const date = instanceOf(Date)

const pictureType = oneOf([
	'image/svg+xml',
	'image/jpeg',
	'image/gif',
	'image/png',
	'image/bmp',
	'image/webp'
])

const videoType = oneOf([
	'video/mp4',
	'video/ogg',
	'video/webm'
])

const audioType = oneOf([
	'audio/mpeg',
	'audio/ogg',
	'audio/flac',
	'audio/opus'
])

const coordinates = shape({
	latitude: number.isRequired,
	longitude: number.isRequired,
	altitude: number
})

export const picture = shape({
	// Picture MIME type.
	// Example: "image/jpeg".
	type: pictureType.isRequired,
	title: string,
	description: string,
	// Date the picture was created (taken) in the "local" timezone
	// of the place where the picture was created (taken).
	date: date,
	// Date the picture was created (taken) in "UTC0" timezone.
	dateUTC0: date,
	// GPS coordinates of the place where the photo was taken.
	coordinates,
	// Picture file size (in bytes).
	size: number,
	// Picture file URL.
	url: string.isRequired,
	// Picture dimensions.
	// Dimensions are also required for SVGs for calculating aspect ratio.
	width: number.isRequired,
	height: number.isRequired,
	// `true` if the image has transparent background.
	transparentBackground: bool,
	// Extra picture sizes (thumbnails).
	sizes: arrayOf(shape({
		// Thumbnail MIME type.
		// Example: "image/jpeg".
		type: pictureType.isRequired,
		url: string.isRequired,
		// Thumbnail dimensions.
		width: number.isRequired,
		height: number.isRequired
	}))
})

export const video = shape({
	title: string,
	description: string,
	// Date the video was created (taken) in the "local" timezone
	// of the place where the video was created (taken).
	date: date,
	// Date the video was created (taken) in "UTC0" timezone.
	dateUTC0: date,
	// GPS coordinates of the place where the video was taken.
	coordinates,
	// Video duration (in seconds).
	duration: number,
	startAt: number,
	width: number,
	height: number,
	aspectRatio: number,
	// Video thumbnail.
	picture: picture.isRequired,
	size: number,
	// Video file URL.
	url: string,
	// Video file MIME type.
	// Is required if `url` is present.
	// Example: "video/webm".
	type: videoType,
	provider: oneOf([
		'YouTube',
		'Vimeo'
	]),
	// YouTube/Vimeo video `id`.
	id: string
})

export const audio = shape({
	type: audioType.isRequired,
	url: string,
	provider: oneOf([
		'SoundCloud'
	]),
	id: string,
	author: string,
	title: string,
	description: string,
	date: date,
	duration: number,
	picture: picture,
	size: number,
	bitrate: number
})

export const postLinkBlock = shape({
	url: string.isRequired,
	title: string.isRequired,
	description: string.isRequired,
	image: string
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
	picture: picture
}

export const accountShape = shape(accountProperties)

export const accountShapeProfile = shape({
	...accountProperties,
	user: userShape,
	users: arrayOf(userShape),
	description: string,
	backgroundPicture: picture,
	whereabouts: string,
	links: arrayOf(shape({
		url: string.isRequired,
		text: string.isRequired
	}))
})

export const postText = string

export const postStyledText = shape({
	type: oneOf(['text']).isRequired,
	style: string.isRequired,
	content: oneOfType([
		string,
		object
	]).isRequired
})

export const postCode = shape({
	type: oneOf(['code']).isRequired,
	censored: bool,
	content: arrayOf(postInlineElement).isRequired
})

export const postEmoji = shape({
	type: oneOf(['emoji']).isRequired,
	name: string.isRequired,
	url: string.isRequired
})

const postNewLine = oneOf(['\n'])

export const postInlineContent = oneOfType([
	string,
	postNewLine,
	arrayOf(oneOfType([
		string,
		postNewLine,
		postStyledText,
		postEmoji,
		// quote's `content` is `postInlineContent` which would create a recursion.
		shape({
			type: oneOf(['quote']).isRequired
		}),
		// link's `content` is `postInlineContent` which would create a recursion.
		shape({
			type: oneOf(['link']).isRequired
		})
	]))
])

export const postInlineLink = shape({
	type: oneOf(['link']).isRequired,
	url: string.isRequired,
	content: postInlineContent.isRequired,
	contentGenerated: bool,
	attachment: postAttachment,
	service: string
})

export const postSubheading = shape({
	type: oneOf(['subheading']).isRequired,
	content: postInlineContent.isRequired
})

export const postSpoiler = shape({
	type: oneOf(['spoiler']).isRequired,
	content: postInlineContent.isRequired
})

export const postPostLinkShape = shape({
	type: oneOf(['post-link']).isRequired,
	postId: oneOfType([string, number]).isRequired,
	// threadId: oneOfType([string, number]),
	// boardId: oneOfType([string, number]),
	url: string.isRequired,
	content: postInlineContent
})

const social = shape({
	provider: oneOf([
		'Instagram',
		'Twitter'
	]).isRequired,
	id: string.isRequired,
	url: string,
	content: string,
	date: date,
	author: shape({
		id: string.isRequired,
		name: string,
		url: string,
		picture
	}),
	attachments: arrayOf(postAttachment)
})

export const postQuote = shape({
	type: oneOf(['quote']).isRequired,
	content: postInlineContent.isRequired,
	source: string,
	url: string
})

export const postInlineQuote = shape({
	type: oneOf(['quote']).isRequired,
	content: postInlineContent.isRequired,
	// The `generated` flag is only used in `post-link`s.
	generated: bool,
	// `block: true` emulates block appearance while staying inline.
	block: bool
})

export const postReadMore = shape({
	type: oneOf(['read-more']).isRequired
})

export const postInlineElement = oneOfType([
	postText,
	postStyledText,
	postInlineLink,
	postInlineQuote,
	postReadMore,
	postNewLine,
	postSpoiler,
	// Custom chan.
	postPostLinkShape
])

export const postParagraph = oneOfType([
	string,
	arrayOf(postInlineElement)
])

export const postList = shape({
	type: oneOf(['list']).isRequired,
	items: arrayOf(postInlineContent).isRequired
})

export const pictureAttachment = shape({
	id,
	type: oneOf(['picture']).isRequired,
	picture: picture.isRequired
})

export const videoAttachment = shape({
	id,
	type: oneOf(['video']).isRequired,
	video: video.isRequired
})

const audioAttachment = shape({
	id,
	type: oneOf(['audio']).isRequired,
	audio: audio.isRequired
})

export const socialAttachment = shape({
	type: oneOf(['social']).isRequired,
	social: social.isRequired
})

const linkAttachment = shape({
	id,
	type: oneOf(['link']).isRequired,
	link: postLinkBlock.isRequired
})

export const postFile = shape({
	name: string,
	ext: string,
	type: string,
	size: number,
	url: string.isRequired,
	picture: picture
})

export const fileAttachment = shape({
	id,
	type: oneOf(['file']),
	file: postFile.isRequired
})

export const postAttachment = oneOfType([
	pictureAttachment,
	videoAttachment,
	audioAttachment,
	socialAttachment,
	linkAttachment,
	fileAttachment
])

const postEmbeddedAttachmentProperties = {
	type: oneOf(['attachment']).isRequired,
	expand: bool,
	align: oneOf(['center'])
}

const postEmbeddedAttachment = oneOfType([
	shape({
		...postEmbeddedAttachmentProperties,
		attachmentId: number.isRequired
	}),
	shape({
		...postEmbeddedAttachmentProperties,
		attachment: postAttachment.isRequired
	})
])

export const postBlock = oneOfType([
	postSubheading,
	postParagraph,
	postList,
	postQuote,
	postEmbeddedAttachment,
	postReadMore
])

export const postContent = oneOfType([
	string,
	arrayOf(postBlock)
])

export const censoredText = oneOfType([
	string,
	arrayOf(oneOfType([
		string,
		postSpoiler
	]))
])

export const post = shape({
	id: id.isRequired,
	title: string,
	titleCensored: censoredText,
	content: postContent,
	createdAt: date,
	account: accountShape, //.isRequired,
	// commentsCount: number,
	replies: arrayOf(object), // .arrayOf(post)
	attachments: arrayOf(postAttachment)
})

export const postBadge = shape({
	ref: object,
	name: string.isRequired,
	icon: elementType,
	getIcon: func,
	getIconProps: func,
	title: func,
	condition: func.isRequired,
	content: elementType,
	onClick: func,
	isPushed: bool
})

export const postMessages = shape({
	moreActions: string,
	readMore: string,
	spoiler: string,
	reply: string,
	repliesCount: string,
	commentsCount: string
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})