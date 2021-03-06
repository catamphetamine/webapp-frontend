import { ReduxModule } from 'react-pages'

const redux = new ReduxModule()

export const getAccount = redux.action
(
	(id) => async http => http.get(`api://accounts/${id}`),
	'account'
)

export const getAccountPosts = redux.action
(
	(id) => async http => {
		const posts = await http.get(`api://accounts/${id}/posts`)
		for (const post of posts) {
			post.author = post.account
			post.account = undefined
		}
		return posts
	},
	'posts'
)

export const uploadPicture = redux.action
(
	(file) => (http) => http.post(`api://images/upload`, { file })
)

// export const setNewBackgroundPicture = redux.simpleAction(
// 	(state, picture) => ({
// 		...state,
// 		// uploadingNewBackgroundPicture : false,
// 		newBackgroundPicture : picture
// 	})
// )

// export const setNewAccountPicture = redux.simpleAction(
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
	},
	'latestActivityTime'
)

export default redux.reducer()