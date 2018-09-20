import { shape, arrayOf, number, string, object, oneOf, oneOfType } from 'prop-types'

const id = oneOfType([
	number,
	string
]).isRequired

export const pictureShape = shape({
	sizes: arrayOf(shape({
		url: string.isRequired,
		// Dimensions are not required for SVGs.
		width: number,
		height: number
	})).isRequired
})

export const userShape = shape({
	id,
	firstName: string,
	lastName: string
})

export const accountShape = shape({
	id,
	name: string.isRequired,
	nameId: string,
	user: userShape,
	banner: string,
	data: shape({
		picture: pictureShape,
		backgroundPicture: pictureShape,
		description: string,
		whereabouts: string,
		links: arrayOf(shape({
			url: string.isRequired,
			text: string.isRequired
		}))
	}).isRequired
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})