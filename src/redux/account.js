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
			description: 'Modelling clay is any of a group of malleable substances used in building and sculpting. The material compositions and production processes vary considerably.',
			data: {
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

export const getAccountPosts = redux.action
(
	(id) => async http =>
	{
		return [{
			id: 1,
			date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
			account: {
				id: 1,
				name: 'Alice Green',
				nameId: 'alice'
			},
			content: [
				'A craft or trade is a pastime or a profession that requires particular skills and knowledge of skilled work. In a historical sense, particularly the Middle Ages and earlier, the term is usually applied to people occupied in small-scale production of goods, or their maintenance, for example by tinkers. The traditional term craftsman is nowadays often replaced by artisan and rarely by craftsperson (craftspeople).',
				'Historically, the more specialized crafts with high value products tended to concentrate in urban centers and formed guilds. The skill required by their professions and the need to be permanently involved in the exchange of goods often demanded a generally higher level of education, and craftsmen were usually in a more privileged position than the peasantry in societal hierarchy. The households of craftsmen were not as self-sufficient as those of people engaged in agricultural work and therefore had to rely on the exchange of goods. Some crafts, especially in areas such as pottery, woodworking, and the various stages of textile production, could be practiced on a part-time basis by those also working in agriculture, and often formed part of village life.'
			]
		}, {
			id: 2,
			date: new Date(),
			account: {
				id: 1,
				name: 'Alice Green',
				nameId: 'alice'
			},
			content: [
				'Once an apprentice of a craft had finished his apprenticeship, he would become a journeyman searching for a place to set up his own shop and make a living. After he set up his own shop, he could then call himself a master of his craft.',
				'This system of a stepwise approach to mastery of a craft, which includes the obtainment of a certain amount of education and the learning of skills, has survived in some countries of the world until today. But crafts have undergone deep structural changes during and since the end of the Industrial Revolution. The mass production of goods by large-scale industry has limited crafts to market segments in which industry\'s modes of functioning or its mass-produced goods would not or cannot satisfy the preferences of potential buyers. Moreover, as an outcome of these changes, craftspeople today increasingly make use of semi-finished components or materials and adapt these to their customers\' requirements or demands and, if necessary, to the environments of their customers. Thus, they participate in a certain division of labour between industry and craft.'
			]
		}]
	},
	'posts'
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