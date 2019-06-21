import YouTube from './video-youtube'

import { describe, it } from './mocha'
import expectToEqual from './expectToEqual'

describe('video-youtube', () => {
	it('should parse YouTube video links with start time', async () => {
		expectToEqual(
			await YouTube.parse('https://www.youtube.com/watch?v=6CPXGQ0zoJE&t=20', {
				picture: false
			}),
			{
				"provider": "YouTube",
				"id": "6CPXGQ0zoJE",
				"startAt": 20
			}
		)
	})

	it('should parse shortened YouTube video links with start time', async () => {
		expectToEqual(
			await YouTube.parse('https://youtu.be/6CPXGQ0zoJE?t=21', {
				picture: false
			}),
			{
				"provider": "YouTube",
				"id": "6CPXGQ0zoJE",
				"startAt": 21
			}
		)
	})
})