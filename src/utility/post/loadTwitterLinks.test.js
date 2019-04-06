import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'

import loadTwitterLinks from './loadTwitterLinks'

const messages = {
	link: 'Link'
}

describe('loadTwitterLinks', () => {
	it('should not load Twitter links when there\'re no links', async () => {
		let post = {}
		expectToEqual(
			await loadTwitterLinks(post),
			false
		)
		expectToEqual(
			post,
			{}
		)

		post = {
			content: [
				[
					'Abc'
				]
			]
		}
		expectToEqual(
			await loadTwitterLinks(post),
			false
		)
		expectToEqual(
			post,
			{
				content: [
					[
						'Abc'
					]
				]
			}
		)
	})

	it('should load Twitter links', async () => {
		const post = {
			content: [
				[
					'Abc ',
					{
						type: 'link',
						url: 'https://twitter.com/HaloCodex/status/1049097736211980288',
						service: 'twitter',
						content: 'HaloCodex/1049097736211980288'
					},
					' def'
				]
			]
		}
		expectToEqual(
			await loadTwitterLinks(post, { messages }),
			true
		)
		expectToEqual(
			post,
			{
				content: [
					[
						'Abc ',
						{
							type: 'link',
							url: 'https://twitter.com/HaloCodex/status/1049097736211980288',
							service: 'twitter',
							content: 'HaloCodex (@HaloCodex): The Halo 2 voice acting was amazing. @joestaten @MartyTheElder  #Halo2 (link)',
							"attachment": {
								"type": "social",
								"provider": "Twitter",
								"text": "The Halo 2 voice acting was amazing. @joestaten @MartyTheElder  #Halo2 (link)",
								"date": new Date(2018, 9, 8)
							}
						},
						' def'
					]
				]
			}
		)
	})
})