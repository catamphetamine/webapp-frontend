import { shape, arrayOf, number, string, object, oneOf, oneOfType } from 'prop-types'

const id = oneOfType([
	number,
	string
])

export const pictureShape = shape({
	type: oneOf([
		'image/svg+xml',
		'image/jpeg',
		'image/png'
	]).isRequired,
	sizes: arrayOf(shape({
		url: string.isRequired,
		// Dimensions are not required for SVGs.
		width: number,
		height: number
	})).isRequired
})

export const userShape = shape({
	id: id,
	firstName: string,
	lastName: string
})

const accountProperties = {
	id: id.isRequired,
	name: string.isRequired,
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

export const postShape = shape({
	id: id.isRequired,
	content: arrayOf(postPartShape).isRequired,
	account: accountShape.isRequired
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})