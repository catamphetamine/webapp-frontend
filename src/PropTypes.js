import { shape, arrayOf, number, string, object, oneOf, oneOfType } from 'prop-types'

const id = oneOfType([
	number,
	string
]).isRequired

export const userShape = shape({
	id,
	firstName: string,
	lastName: string
})

export const accountShape = shape({
	id,
	name: string.isRequired,
	user: userShape,
	banner: string,
	data: shape({
		palette: shape({
			background: string
		})
	}).isRequired
})

export const locationShape = shape({
	pathname: string.isRequired,
	query: object.isRequired
})