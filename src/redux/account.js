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
				{
					type: 'heading',
					heading: {
						text: 'Craft'
					}
				},
				`
					A craft or trade is a pastime or a profession
					that requires particular skills and knowledge
					of skilled work.
				`,
				{
					type: 'attachment',
					attachmentId: 5
				},
				{
					type: 'quote',
					quote: {
						text: 'Every child is an artist. The problem is how to remain an artist once we grow up.',
						source: 'Pablo Picasso',
						url: 'https://google.com'
					}
				},
				{
					type: 'list',
					list: {
						items: [
							'Coffee',
							'Tea',
							'Milk'
						]
					}
				},
				[
					`
						In a
					`,
					{
						type: 'link',
						link: {
							text: 'historical',
							url: 'https://google.com'
						}
					},
					`
						sense, particularly
						the Middle Ages and earlier, the term is usually
						applied to people occupied in small-scale production of goods,
						or their maintenance, for example by tinkers.
					`
				],
				{
					type: 'attachment',
					attachmentId: 6
				},
				`
					The traditional term craftsman is nowadays often replaced by artisan
					and rarely by craftsperson (craftspeople).
				`,
				'Historically, the more specialized crafts with high value products tended to concentrate in urban centers and formed guilds. The skill required by their professions and the need to be permanently involved in the exchange of goods often demanded a generally higher level of education, and craftsmen were usually in a more privileged position than the peasantry in societal hierarchy. The households of craftsmen were not as self-sufficient as those of people engaged in agricultural work and therefore had to rely on the exchange of goods. Some crafts, especially in areas such as pottery, woodworking, and the various stages of textile production, could be practiced on a part-time basis by those also working in agriculture, and often formed part of village life.'
			],
			attachments: [{
				id: 1,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 2,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 3,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg',
						width: 1280,
						height: 720
						// Vertical image.
						// url: 'https://pp.userapi.com/c844417/v844417210/ea738/18xV5BPN9Lg.jpg',
						// width: 864,
						// height: 1296
					}]
				}
			}, {
				id: 21,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 22,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 23,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg',
						width: 1280,
						height: 720
						// Vertical image.
						// url: 'https://pp.userapi.com/c844417/v844417210/ea738/18xV5BPN9Lg.jpg',
						// width: 864,
						// height: 1296
					}]
				}
			}, {
				id: 31,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/jq1M-EQZblU/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 32,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/DMmi7_P8XKo/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 33,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/Jhd_r-mI1_M/maxresdefault.jpg',
						width: 1280,
						height: 720
						// Vertical image.
						// url: 'https://pp.userapi.com/c844417/v844417210/ea738/18xV5BPN9Lg.jpg',
						// width: 864,
						// height: 1296
					}]
				}
			}, {
				id: 4,
				type: 'video',
				video: {
					"source": {
						"provider": "YouTube",
						"id": "P3DGwyl0mJQ"
					},
					"picture": {
						"type": "image/jpeg",
						"sizes": [{
							"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",
							"width": 1280,
							"height": 720
						}]
					}
				}
			}, {
				id: 5,
				type: 'video',
				video: {
					"source": {
						"provider": "YouTube",
						"id": "FlSUQFTRfAw"
					},
					"picture": {
						"type": "image/jpeg",
						"sizes": [{
							"url": "https://img.youtube.com/vi/FlSUQFTRfAw/maxresdefault.jpg",
							"width": 1280,
							"height": 720
						}]
					}
				}
			}, {
				id: 6,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/fU8XLCOjRdw/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}]
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
			],
			attachments: [{
				id: 1,
				type: 'picture',
				picture: {
					type: 'image/jpeg',
					sizes: [{
						url: 'https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg',
						width: 1280,
						height: 720
					}]
				}
			}, {
				id: 2,
				type: 'video',
				video: {
					"title": "Dewhorn",
					"description": "A young boy escapes to the woods to indulge his fantasies but finds himself consumed by them, longing to return home.<br />\n<br />\nBased on the song \"Dewhorn\" by Tispur.<br />\n<br />\nLittle Boy - Alasdair McLenna<br />\nMother - Juliana McLenna<br />\nSchool Teacher - Kyra Bernauer<br />\nBuried Muse - Samwise Carlson<br />\nForest Spirit - Easton Dufur<br />\nExtras - Baron Wilson, Grayson Carter, Liam Sweeney, Desmond McLenna<br />\n<br />\nDirector + Writer: Brandon Kapelow<br />\nProducers: Matthew Wordell, Jesse Hays, Brandon Kapelow<br />\nEP: Jennifer Goodridge<br />\nAssoc. Producers: Charlie Balch, Laurel Thomson, Loren Hill<br />\n1st AD: Jesse Hays<br />\n<br />\nDP: Luke Orlando<br />\n1st AC: Lila Streicher<br />\nDrone Pilot: Matthew Wordell<br />\nSteadicam: Brandon Kapelow<br />\n<br />\nProd. Coordinator: Izze Rump<br />\nPAs: James Richardson, Parker Nettles, Aaron Rodriguez, Sara Greyfox, Louie Bash<br />\n<br />\nWatercolor Animation: Bobby Moser<br />\n<br />\nProduction Designer: Alyssa Pearson<br />\nArt Director: Caitlin Goff<br />\nCostume & Creature Design: Odette Mattha<br />\nWardrobe Stylist: Bronwyn Leslie<br />\nSet Decorator: Kyra Bernauer<br />\n<br />\nEditor: Brandon Kapelow<br />\nSound Design: Jackie! Zhou<br />\nSound Mixer: Tucker Grindstaff<br />\n<br />\nHarp - Matthew Tutsky<br />\nViolin - Brynn Givans<br />\nViola - Judah Claffey<br />\nCello - Jake Saunders<br />\n<br />\nThe Mill, Chicago<br />\nVFX Producer - Mike Pullan<br />\nColor EP - Laurie Adrianopoli<br />\nColor Producer - Dan Butler<br />\nColorist - Mikey Pehanich<br />\nCompositor - Jonny Freeman<br />\nNuke Artist - Ruth Meridjen<br />\nColor Assist - Lindsey Mazur<br />\n<br />\nDI - Cinelicious<br />\nDI Producer - Estelle Mataranga<br />\nFilm Processing & Scanning - Fotokem, Pro8mm<br />\n<br />\nSpecial Thanks - Ben McLenna, Spencer Creigh, Laurel Thomson, Mishka Kornai, Ariel Fisher, Drew Heskett, Fotokem, Judy Engle, Nico Aguilar, Kevin Calero, Pro8mm, Heidi Parker, Eric Gilbert, Cinelicious, Dan Carr, Nick Roney, Matt Carter, The Mill, Dan Thomas, Edwards Greenhouse, Luke Lucas, Sean Conaty, Duck Club, Kylie George MacEntee, Kauai Moliterno, Chef Amy, Alex Satterlee, Erin Sweeney, Erich Wilhelm Zander, Beyond Ideas, Thomas Wilson, Daniel Frantz, Eastside Camera, Kaelin Wilson, John McGrath, Brigette Nelson",
					"width": 1920,
					"height": 1080,
					"duration": 399,
					"source": {
						"provider": "Vimeo",
						"id": "289902998"
					},
					"picture": {
						"type": "image/jpeg",
						"sizes": [{
							"url": "https://i.vimeocdn.com/video/726258668_640.jpg",
							"width": 640,
							"height": 360
						}]
					}
				}
			}, {
				id: 3,
				type: 'video',
				video: {
					"source": {
						"provider": "YouTube",
						"id": "P3DGwyl0mJQ"
					},
					"picture": {
						"type": "image/jpeg",
						"sizes": [{
							"url": "https://img.youtube.com/vi/P3DGwyl0mJQ/maxresdefault.jpg",
							"width": 1280,
							"height": 720
						}]
					}
				}
			}]
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