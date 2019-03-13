import generatePostPreview from './generatePostPreview'

import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

function getPostPreviewTest(post, options, expected) {
	if (Array.isArray(post)) {
		post = {
			content: post,
			attachments: []
		}
	}
	expectToEqual(generatePostPreview(post, options), expected)
}

describe('getPostText', () => {
	it('should return `undefined` if no preview is required (when post is small enough)', () => {
		expectToEqual(
			generatePostPreview(
				{
					content: [
						[
							'Abc'
						],
						[
							'Def'
						]
					]
				},
				{ limit: 100 }
			),
			undefined
		)
	})

	it('should truncate on whitespace when there\'re no ends of sentence', () => {
		expectToEqual(
			generatePostPreview(
				{
					content: [
						[
							'Thefirstsentence.'
						]
					]
				},
				{ limit: 10 }
			),
			[
				[
					'Thefirstse…',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate on whitespace when there\'re no ends of sentence (not a nested array)', () => {
		expectToEqual(
			generatePostPreview(
				{
					content: [
						'Thefirstsentence.'
					]
				},
				{ limit: 10 }
			),
			[
				[
					'Thefirstse…',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate at limit when when there\'re no ends of sentence or whitespace', () => {
		const content = [
			[
				'The firstsentence.'
			]
		]
		expectToEqual(
			generatePostPreview(
				{ content },
				{ limit: 5 }
			),
			[
				[
					'The …',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate on end of sentence mid-paragraph', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. The second sentence.'
				]
			],
			{
				limit: 26
			},
			[
				[
					'The first sentence.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate paragraphs at sentence end (exclamation mark)', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence! The second sentence.'
				]
			],
			{
				limit: 26
			},
			[
				[
					'The first sentence!',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should truncate paragraphs at sentence end (question mark)', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence? The second sentence.'
				]
			],
			{
				limit: 26
			},
			[
				[
					'The first sentence?',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should trim the preview', () => {
		getPostPreviewTest(
			[
				[
					'Text.',
					'\n',
					'\n',
					'\n',
					'\n'
				]
			],
			{
				limit: 50
			},
			[
				[
					'Text.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should not trim mid-paragraph if there\'s enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.',
					'\n',
					'The second sentence is a longer one. More text. More text. More text. More text. More text. More text. More text. More text.'
				]
			],
			{
				limit: 190
			},
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.',
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should trim mid-line if there\'s not enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first paragraph.'
				],
				[
					'The second paragraph is a longer one. Is a longer one.'
				]
			],
			{
				limit: 100
			},
			[
				[
					'The first paragraph.'
				],
				[
					'The second paragraph is a longer one.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should not trim mid-paragraph if there\'s enough text in a preview', () => {
		getPostPreviewTest(
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
				],
				[
					'The second sentence is a longer one. Some text. More text. More text. More text. More text. More text. More text. More text.'
				]
			],
			{
				limit: 190
			},
			[
				[
					'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should generate preview in case of embedded attachments', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'The first paragraph.'
					],
					[
						'The second paragraph.'
					]
				],
				attachments: [{
					id: 1,
					type: 'picture'
				}]
			},
			{
				limit: 260
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					'The first paragraph.'
				],
				{ type: 'read-more' }
			]
		)
	})

	it('should trim mid-paragraph when there\'s not enough text (skip embedded attachments when counting text length)', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					[
						'The first sentence. Some text. More text. More text. More text. More text. More text. More text. More text. More text.'
					]
				],
				attachments: [{
					id: 1,
					type: 'picture'
				}]
			},
			{
				limit: 300
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				[
					'The first sentence. Some text. More text. More text.',
					{ type: 'read-more' }
				]
			]
		)
	})

	it('should trim at embedded attachments', () => {
		getPostPreviewTest(
			{
				content: [
					{
						type: 'attachment',
						attachmentId: 1
					},
					{
						type: 'attachment',
						attachmentId: 2
					},
					{
						type: 'attachment',
						attachmentId: 3
					},
					[
						'The first sentence.'
					]
				],
				attachments: [
					{
						id: 1,
						type: 'picture'
					},
					{
						id: 2,
						type: 'video'
					},
					{
						id: 3,
						type: 'picture'
					}
				]
			},
			{
				limit: 450
			},
			[
				{
					type: 'attachment',
					attachmentId: 1
				},
				{
					type: 'attachment',
					attachmentId: 2
				},
				{ type: 'read-more' }
			]
		)
	})

	it('should trim mid-paragraph when non-text parts are used too (and insert ellipsis inside those non-text parts)', () => {
		getPostPreviewTest(
			[
				[
					'Text ',
					{
						type: 'spoiler',
						content: 'spoilerrr text'
					},
					' text text text. Another text.'
				]
			],
			{
				limit: 15
			},
			[
				[
					'Text ',
					{
						type: 'spoiler',
						content: 'spoilerrr …'
					},
					{ type: 'read-more' }
				]
			]
		)
	})
})