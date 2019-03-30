import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

import combineQuotes from './combineQuotes'

describe('combineQuotes', () => {
	it('should work in edge cases (no content)', () => {
		const content = undefined
		combineQuotes(content)
		expectToEqual(content, undefined)
	})

	it('should work in edge cases (empty content)', () => {
		const content = []
		combineQuotes(content)
		expectToEqual(content, [])
	})

	it('should work in edge cases (string content)', () => {
		const content = 'Abc'
		combineQuotes(content)
		expectToEqual(content, 'Abc')
	})

	it('should work in edge cases (array of string content)', () => {
		const content = ['Abc']
		combineQuotes(content)
		expectToEqual(content, ['Abc'])
	})

	it('should only combine quotes starting on a new line', () => {
		const content = [
			[
				'123',
				{
					type: 'inline-quote',
					content: 'abc'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'def'
				}
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					'123',
					{
						type: 'inline-quote',
						content: 'abc'
					},
					'\n',
					{
						type: 'inline-quote',
						content: 'def'
					}
				]
			]
		)
	})

	it('should combine quotes (start of paragraph)', () => {
		const content = [
			[
				{
					type: 'inline-quote',
					content: 'abc'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'def'
				}
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					{
						type: 'inline-quote',
						content: [
							'abc',
							'\n',
							'def'
						]
					}
				]
			]
		)
	})

	it('should combine quotes (starting on a new line)', () => {
		const content = [
			[
				'123',
				'\n',
				{
					type: 'inline-quote',
					content: 'abc'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'def'
				},
				'\n',
				'456'
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					'123',
					'\n',
					{
						type: 'inline-quote',
						content: [
							'abc',
							'\n',
							'def'
						]
					},
					'\n',
					'456'
				]
			]
		)
	})

	it('should combine quotes (nested content)', () => {
		const content = [
			[
				{
					type: 'inline-quote',
					content: [
						{
							type: 'text',
							style: 'bold',
							content: 'abc'
						}
					]
				},
				'\n',
				{
					type: 'inline-quote',
					content: [
						{
							type: 'text',
							style: 'italic',
							content: 'def'
						}
					]
				}
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					{
						type: 'inline-quote',
						content: [
							{
								type: 'text',
								style: 'bold',
								content: 'abc'
							},
							'\n',
							{
								type: 'text',
								style: 'italic',
								content: 'def'
							}
						]
					}
				]
			]
		)
	})

	it('should only combine quotes separated by new line character', () => {
		const content = [
			[
				{
					type: 'inline-quote',
					content: 'abc'
				},
				{
					type: 'inline-quote',
					content: 'def'
				}
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					{
						type: 'inline-quote',
						content: 'abc'
					},
					{
						type: 'inline-quote',
						content: 'def'
					}
				]
			]
		)
	})

	it('should only combine quotes of same kind', () => {
		const content = [
			[
				{
					type: 'inline-quote',
					content: 'abc'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'def',
					kind: 'inverse'
				}
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					{
						type: 'inline-quote',
						content: 'abc'
					},
					'\n',
					{
						type: 'inline-quote',
						content: 'def',
						kind: 'inverse'
					}
				]
			]
		)
	})

	it('should combine more than two quotes', () => {
		const content = [
			[
				'123',
				'\n',
				{
					type: 'inline-quote',
					content: 'abc'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'def'
				},
				'\n',
				{
					type: 'inline-quote',
					content: 'ghi'
				},
				'\n',
				'456'
			]
		]
		combineQuotes(content)
		expectToEqual(
			content,
			[
				[
					'123',
					'\n',
					{
						type: 'inline-quote',
						content: [
							'abc',
							'\n',
							'def',
							'\n',
							'ghi'
						]
					},
					'\n',
					'456'
				]
			]
		)
	})
})