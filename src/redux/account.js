import { ReduxModule } from 'react-website'

const redux = new ReduxModule()

export const getAccount = redux.action
(
	(id) => async http =>
	{
		return {
			id: 1,
			name: 'Alice Green',
			nameId: 'alice',
			user: {
				id: 123,
				firstName: 'Alex',
				lastName: 'Murphy'
			},
			data: {
				description: 'Modelling clay is any of a group of malleable substances used in building and sculpting. The material compositions and production processes vary considerably.',
				whereabouts: 'Portland, OR',
				links: [{
					url: 'https://facebook.com/alice',
					text: 'facebook.com/alice'
				}, {
					url: 'https://google.com',
					text: 'google.com'
				}]
			}
		}
	},
	'account'
)

export const uploadPicture = redux.action
(
	(file) => (http) => http.post(`/images/upload`, { file })
)

// export const setNewBackgroundPicture = redux.simpleAction
// (
// 	picture => picture,
// 	(state, picture) => ({
// 		...state,
// 		// uploadingNewBackgroundPicture : false,
// 		newBackgroundPicture : picture
// 	})
// )

// export const setNewAccountPicture = redux.simpleAction
// (
// 	picture => picture,
// 	(state, picture) => ({
// 		...state,
// 		// uploadingNewAccountPicture : false,
// 		newAccountPicture : picture
// 	})
// )

export const getLatestActivityTime = redux.action
(
	(id) => async http =>
	{
		return new Date()
		// return await http.get('/api/example/users')
	},
	'latestActivityTime'
)

export default redux.reducer()