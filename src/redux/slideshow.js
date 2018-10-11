import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const openSlideshow = redux.simpleAction
(
	(pictures, index) => ({ pictures, index }),
	(state, event) => ({
		...state,
		pictures: event.pictures,
		index: event.index,
		isOpen: true
	})
)

export const closeSlideshow = redux.simpleAction
(
	() => ({}),
	(state, event) => ({
		...state,
		pictures: undefined,
		index: undefined,
		isOpen: false
	})
)

export default redux.reducer()