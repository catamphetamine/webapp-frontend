import { describe, it } from '../mocha'
import expectToEqual from '../expectToEqual'
import parseServiceLink from './parseServiceLink'

describe('parseServiceLink', () => {
	it('should parse popular service links', () => {
		expectToEqual(
			parseServiceLink('https://discord.gg/2HPKEW'),
			{
				service: 'discord',
				text: '2HPKEW'
			}
		)

		expectToEqual(
			parseServiceLink('https://instagram.com/modoku._/'),
			{
				service: 'instagram',
				text: 'modoku._'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/profile.php?id=100006433235253'),
			{
				service: 'facebook',
				text: '100006433235253'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/durov'),
			{
				service: 'facebook',
				text: 'durov'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.facebook.com/people/Lada-Murasheva/100008147402555'),
			{
				service: 'facebook',
				text: 'Lada-Murasheva'
			}
		)

		expectToEqual(
			parseServiceLink('https://vk.com/name'),
			{
				service: 'vk',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('https://vk.com/id12345'),
			{
				service: 'vk',
				text: '12345'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/watch?v=0P8b81M9OWw'),
			{
				service: 'youtube',
				text: '0P8b81M9OWw'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/user/ChristopherOdd'),
			{
				service: 'youtube',
				text: 'ChristopherOdd'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/channel/UCTyA1ortyWPc1uLF5cbzluA/videos'),
			{
				service: 'youtube',
				text: 'UCTyA1ortyWPc1uLF5cbzluA'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/c/SkylineTV/live'),
			{
				service: 'youtube',
				text: 'SkylineTV/live'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/user/ChristopherOdd/videos'),
			{
				service: 'youtube',
				text: 'ChristopherOdd'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.youtube.com/playlist?list=PLDzNGonyeoUtBqYuqku0QqNwk2mcSlV_n'),
			{
				service: 'youtube',
				text: 'playlist/PLDzNGonyeoUtBqYuqku0QqNwk2mcSlV_n'
			}
		)

		expectToEqual(
			parseServiceLink('http://youtu.be/My2FRPA3Gf8'),
			{
				service: 'youtube',
				text: 'My2FRPA3Gf8'
			}
		)

		expectToEqual(
			parseServiceLink('https://m.youtube.com/watch?v=yModCU1OVHY'),
			{
				service: 'youtube',
				text: 'yModCU1OVHY'
			}
		)

		expectToEqual(
			parseServiceLink('http://vimeo.com/name'),
			{
				service: 'vimeo',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://vimeo.com/25451551'),
			{
				service: 'vimeo',
				text: '25451551'
			}
		)

		expectToEqual(
			parseServiceLink('https://twitter.com/name'),
			{
				service: 'twitter',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('https://twitter.com/name/status/1234567890000000000'),
			{
				service: 'twitter',
				text: 'name/1234567890000000000'
			}
		)

		expectToEqual(
			parseServiceLink('https://t.me/joinchat/B9VagUi23u76uoO2SBFGWw'),
			{
				service: 'telegram',
				text: 'B9VagUi23u76uoO2SBFGWw'
			}
		)

		expectToEqual(
			parseServiceLink('https://teleg.run/dvachannel'),
			{
				service: 'telegram',
				text: 'dvachannel'
			}
		)

		expectToEqual(
			parseServiceLink('https://t.me/name'),
			{
				service: 'telegram',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://archivach.org/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.cf/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.ng/thread/68360/'),
			{
				service: 'arhivach',
				text: '68360'
			}
		)

		expectToEqual(
			parseServiceLink('http://arhivach.ng/?tags=3420'),
			{
				service: 'arhivach',
				text: '3420'
			}
		)

		expectToEqual(
			parseServiceLink('http://github.com/name/'),
			{
				service: 'github',
				text: 'name'
			}
		)

		expectToEqual(
			parseServiceLink('http://github.com/name/repo'),
			{
				service: 'github',
				text: 'name/repo'
			}
		)

		expectToEqual(
			parseServiceLink('https://2ch.hk/b/'),
			{
				service: '2ch',
				text: '/b/'
			}
		)

		expectToEqual(
			parseServiceLink('https://2ch.hk/v/res/3541116.html'),
			{
				service: '2ch',
				text: '/v/3541116'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4chan.org/f/'),
			{
				service: '4chan',
				text: '/f/'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4channel.org/a/thread/184737891#q184737891'),
			{
				service: '4chan',
				text: '/a/184737891'
			}
		)

		expectToEqual(
			parseServiceLink('http://boards.4chan.org/a/thread/184737891#q184737891'),
			{
				service: '4chan',
				text: '/a/184737891'
			}
		)
	})

	it('should parse google search links', () => {
		expectToEqual(
			parseServiceLink('https://www.google.ru/search?newwindow=1&safe=off&source=hp&ei=X_uDXK6aEJvSmwWL9bHYCg&q=query+test&btnK=%D0%9F%D0%BE%D0%B8%D1%81%D0%BA+%D0%B2+Google&oq=afsd&gs_l=psy-ab.3..0l5j0i10l2j0j0i10j0.823.991..1224...0.0..0.50.240.5......0....1..gws-wiz.....0..35i39j0i131j0i67.tfbc4QOAKPM'),
			{
				service: 'google',
				text: 'query test'
			}
		)
	})

	it('should parse google docs links', () => {
		expectToEqual(
			parseServiceLink('https://docs.google.com/spreadsheets/d/1CXMrCVI3GfwHu8wObTixAlpA3ftjs87lkX017SaVl6I/edit#gid=0'),
			{
				service: 'google',
				text: 'spreadsheets/1CXMrCVI3GfwHu8wObTixAlpA3ftjs87lkX017SaVl6I'
			}
		)

		expectToEqual(
			parseServiceLink('https://docs.google.com/document/d/1-XMrCVI3GfwHu8wObTixAlpA3ftjs87lkX017SaVl6I'),
			{
				service: 'google',
				text: 'document/1-XMrCVI3GfwHu8wObTixAlpA3ftjs87lkX017SaVl6I'
			}
		)
	})

	it('should parse google maps links', () => {
		expectToEqual(
			parseServiceLink('https://www.google.com/maps/@55.7456141,37.6462423,3a,75y,338.07h,80.99t/data=!3m6!1e1!3m4!1sSSc62Yvxzck88DABkvTQBA!2e0!7i13312!8i6656'),
			{
				service: 'google',
				text: 'maps/@55.7456141,37.6462423,3a,75y,338.07h,80.99t'
			}
		)
	})

	it('should parse yandex search links', () => {
		expectToEqual(
			parseServiceLink('https://yandex.ru/search/?text=%D0%90%D0%B1%D0%B2&lr=213'),
			{
				service: 'yandex',
				text: 'Абв'
			}
		)
	})

	it('should parse yandex maps links', () => {
		expectToEqual(
			parseServiceLink('https://yandex.ru/maps/213/moscow/?l=stv%2Csta&ll=37.672836%2C55.727706&panorama%5Bdirection%5D=40.453518%2C0.000000&panorama%5Bpoint%5D=37.692410%2C55.776097&panorama%5Bspan%5D=120.000000%2C66.095178&z=10.8'),
			{
				service: 'yandex',
				text: 'maps/37.672836,55.727706'
			}
		)
	})

	it('should parse `twitch.tv` links', () => {
		expectToEqual(
			parseServiceLink('https://www.twitch.tv/videos/251041651'),
			{
				service: 'twitch',
				text: 'videos/251041651'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.twitch.tv/honeymad/'),
			{
				service: 'twitch',
				text: 'honeymad'
			}
		)

		expectToEqual(
			parseServiceLink('https://www.twitch.tv/honeymad/videos'),
			{
				service: 'twitch',
				text: 'honeymad/videos'
			}
		)
	})
})