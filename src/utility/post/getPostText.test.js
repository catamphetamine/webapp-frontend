import getPostText from './getPostText'

import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

function getPostTextTest(post, options, text) {
	if (text === undefined) {
		text = options
		options = {}
	}
	expectToEqual(getPostText(post, options), text)
}

describe('getPostText', () => {
	it('should get post text', () => {
		getPostTextTest(
			{
				content: 'Abc'
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: ['Abc']
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: [['Abc']]
			},
			'Abc'
		)

		getPostTextTest(
			{
				content: ['Abc', 'Def']
			},
			'Abc\n\nDef'
		)

		getPostTextTest(
			{
				content: [['Abc', 'Def']]
			},
			'AbcDef'
		)

		getPostTextTest(
			{
				content: [['Abc', '\n', 'Def']]
			},
			'Abc\nDef'
		)
	})

	it('should trim whitespace', () => {
		getPostTextTest(
			{
				content: [
					[
						"Embrace the 2d edition",
						"\n",
						"\n",
						"HIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification).",
						"\n"
					]
				]
			},
			"Embrace the 2d edition\n\nHIS GENERAL ISN'T JUST ABOUT SLAVE TRAINERS OTHER GENRES OF GAMES FIT HERE ALSO (Please read the next part for further clarification)."
		)
	})

	it('should exclude quotes when "excludeQuotes" is "true"', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'inline-quote',
							content: 'Quote'
						},
						'\n',
						'Abc'
					]
				]
			},
			{
				excludeQuotes: true
			},
			'Abc'
		)

		getPostTextTest(
			{
				content:
				[
					{
						type: 'quote',
						content: 'Quote'
					},
					[
						'Abc'
					]
				]
			},
			{
				excludeQuotes: true
			},
			'Abc'
		)
	})

	it('shouldn\'t exclude quotes when "excludeQuotes" is not passed', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'inline-quote',
							content: 'Quote'
						},
						'\n',
						'Abc'
					]
				]
			},
			'«Quote»\nAbc'
		)
	})

	it('should get post text from nested blocks', () => {
		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'text',
							style: 'bold',
							content: [
								{
									type: 'link',
									url: 'https://google.com',
									content: 'Google'
								},
								' ',
								{
									type: 'text',
									style: 'italic',
									content: 'link'
								}
							]
						},
						'\n',
						'Abc'
					]
				]
			},
			'Google link\nAbc'
		)

		getPostTextTest(
			{
				content:
				[
					[
						{
							type: 'quote',
							content: [
								{
									type: 'link',
									url: 'https://google.com',
									content: 'Google'
								},
								' ',
								{
									type: 'text',
									style: 'italic',
									content: 'link'
								}
							]
						},
						'\n',
						'Abc'
					]
				]
			},
			'«Google link»\nAbc'
		)
	})

	it('should get post text when attachments are embedded (no messages passed)', () => {
		getPostTextTest(
			{
				content:
				[
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed)', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				}
			},
			'Abc\n\nVideo\n\nDef\n\nPicture\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments have titles)', () => {
		getPostTextTest(
			{
				content:
				[
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				}
			},
			'Abc\n\nVideo Title\n\nDef\n\nPicture Title\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments not found)', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 3
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 4
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				}
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should skip embedded attachments when "skipAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				},
				skipAttachments: true
			},
			'Abc\n\nDef\n\nGhi'
		)
	})

	it('should skip untitled attachments when "skipUntitledAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'Def'
					],
					{
						type: 'attachment',
						attachmentId: 2
					},
					[
						'Ghi'
					]
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				},
				skipUntitledAttachments: true
			},
			'Abc\n\nDef\n\nPicture Title\n\nGhi'
		)
	})

	it('should return attachment title when there\'s no post text and "skipAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					}
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {
						title: 'Video Title'
					}
				}, {
					id: 2,
					type: 'picture',
					picture: {
						title: 'Picture Title'
					}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				},
				skipAttachments: true
			},
			'Video Title'
		)
	})

	it('should return attachment placeholder when there\'s no post text and the attachment is untitled and "skipAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					}
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				},
				skipAttachments: true
			},
			'Video'
		)
	})

	it('shouldn\'t return attachment placeholder when there\'s no post text and "ignoreAttachments" is "true"', () => {
		getPostTextTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					}
				],
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				},
				ignoreAttachments: true
			},
			''
		)
	})

	it('should get post text when social attachments are present', () => {
		getPostTextTest(
			{
				content: [
					[
						'Abc'
					],
					{
						type: 'attachment',
						attachmentId: 1
					}
				],
				attachments: [{
					id: 1,
					type: 'social',
					social: {
						provider: 'Instagram',
						content: 'My favorite cat from tonight\'s episode- a true winner. #newgirl',
						url: 'https://www.instagram.com/p/V8UMy0LjpX/',
						author: {
							name: 'Zooey Deschanel',
							id: 'zooeydeschanel',
							url: 'https://www.instagram.com/zooeydeschanel'
						},
						date: new Date('2013-02-20T06:17:14+00:00'),
						attachments: [{
							type: 'picture',
							picture: {
								type: 'image/jpeg',
								width: 612,
								height: 612,
								url: 'https://scontent-arn2-1.cdninstagram.com/vp/fe285833a2d6da37c81165bc7e03f8d8/5D3E22F2/t51.2885-15/e15/11262720_891453137565191_1495973619_n.jpg?_nc_ht=scontent-arn2-1.cdninstagram.com'
							}
						}]
					}
				}]
			},
			{
				messages: {
					picture: 'Picture',
					video: 'Video'
				}
			},
			'Abc\n\nZooey Deschanel (@zooeydeschanel): My favorite cat from tonight\'s episode- a true winner. #newgirl'
		)
	})
})