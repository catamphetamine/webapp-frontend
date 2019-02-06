import getPostText, { removePostLinks, removeQuotes } from './getPostText'

import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'

function getPostTextTest(content, options, text) {
	if (text === undefined) {
		text = options
		options = {}
	}
	const attachments = options.attachments
	delete options.attachments
	expectToEqual(getPostText({ content, attachments }, options), text)
}

describe('getPostText', () => {
	it('should get post text', () => {
		getPostTextTest(
			'Abc',
			'Abc'
		)

		getPostTextTest(
			['Abc'],
			'Abc'
		)

		getPostTextTest(
			[['Abc']],
			'Abc'
		)

		getPostTextTest(
			['Abc', 'Def'],
			'Abc\n\nDef'
		)

		getPostTextTest(
			[['Abc', 'Def']],
			'AbcDef'
		)

		getPostTextTest(
			[['Abc', '\n', 'Def']],
			'Abc\nDef'
		)
	})

	it('should exclude quotes when "excludeQuotes" is "true"', () => {
		getPostTextTest(
			[
				[
					{
						type: 'inline-quote',
						content: 'Quote'
					},
					'\n',
					'Abc'
				]
			],
			{
				excludeQuotes: true
			},
			'Abc'
		)

		getPostTextTest(
			[
				{
					type: 'quote',
					content: 'Quote'
				},
				[
					'Abc'
				]
			],
			{
				excludeQuotes: true
			},
			'Abc'
		)
	})

	it('shouldn\'t exclude quotes when "excludeQuotes" is not passed', () => {
		getPostTextTest(
			[
				[
					{
						type: 'inline-quote',
						content: 'Quote'
					},
					'\n',
					'Abc'
				]
			],
			'«Quote»\nAbc'
		)
	})

	it('should get post text from nested blocks', () => {
		getPostTextTest(
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
			],
			'Google link\nAbc'
		)

		getPostTextTest(
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
			],
			'«Google link»\nAbc'
		)
	})

	it('should get post text when attachments are embedded (no messages passed)', () => {
		getPostTextTest(
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
			{
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
			{
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}],
				messages: {
					attachmentPicture: 'Picture',
					attachmentVideo: 'Video'
				}
			},
			'Abc\n\nVideo\n\nDef\n\nPicture\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments have titles)', () => {
		getPostTextTest(
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
			{
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
				}],
				messages: {
					attachmentPicture: 'Picture',
					attachmentVideo: 'Video'
				}
			},
			'Abc\n\nVideo Title\n\nDef\n\nPicture Title\n\nGhi'
		)
	})

	it('should get post text when attachments are embedded (messages passed) (attachments not found)', () => {
		getPostTextTest(
			[
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
			{
				attachments: [{
					id: 1,
					type: 'video',
					video: {}
				}, {
					id: 2,
					type: 'picture',
					picture: {}
				}],
				messages: {
					attachmentPicture: 'Picture',
					attachmentVideo: 'Video'
				}
			},
			'Abc\n\nDef\n\nGhi'
		)
	})
})

function removePostLinksTest(content, text) {
	expectToEqual(removePostLinks(content), text)
}

describe('removePostLinks', () => {
	it('should remove post links', () => {
		removePostLinksTest(
			[
				{
					type: 'post-link',
					content: 'Сообщение'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'Quote'
				},
				'\n',
				'abc'
			],
			[
				{
					type: 'inline-quote',
					content: 'Quote'
				},
				'\n',
				'abc'
			]
		)
	})

	it('should remove post links and their autogenerated inline quotes', () => {
		removePostLinksTest(
			[
				{
					type: 'post-link',
					content: 'Сообщение'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'Quote',
					autogenerated: true
				},
				'\n',
				'abc'
			],
			[
				'abc'
			]
		)

		removePostLinksTest(
			[
				{
					type: 'post-link',
					content: 'Сообщение'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'Quote',
					autogenerated: true
				},
				'\n',
				{
					type: 'post-link',
					content: 'Сообщение'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'Quote',
					autogenerated: true
				},
				'\n',
				'abc'
			],
			[
				'abc'
			]
		)
	})
})

function removeQuotesTest(content, text) {
	expectToEqual(removeQuotes(content), text)
}

describe('removeQuotes', () => {
	it('should remove quotes', () => {
		removeQuotesTest(
			[
				'123',
				{
					type: 'quote',
					content: 'Сообщение'
				},
				[
					'Abc',
					'\n',
					'Def'
				]
			],
			[
				'123',
				[
					'Abc',
					'\n',
					'Def'
				]
			]
		)
	})

	it('should remove inline quotes', () => {
		removeQuotesTest(
			[
				'Abc',
				'\n',
				{
					type: 'inline-quote',
					content: 'Quote'
				},
				'\n',
				'Def'
			],
			[
				'Abc',
				'\n',
				'Def'
			]
		)
	})
})