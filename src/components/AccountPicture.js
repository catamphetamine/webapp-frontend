import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Picture from './Picture'

import './AccountPicture.css'

import DefaultAccountPicture from '../../assets/images/account-picture.svg'

const DEFAULT_ACCOUNT_PICTURE =
{
	type: 'image/svg+xml',
	url: DefaultAccountPicture,
	width: 1,
	height: 1
}

export default class AccountPicture extends React.Component
{
	static propTypes =
	{
		picture   : PropTypes.object,
		account   : PropTypes.object.isRequired,
		style     : PropTypes.object,
		className : PropTypes.string,

		// These two are for `upload picture` to work
		picture   : PropTypes.object
	}

	render()
	{
		const
		{
			picture,
			account,
			className,
			...rest
		}
		= this.props

		return (
			<Picture
				{...rest}
				picture={ picture || account.picture || DEFAULT_ACCOUNT_PICTURE }
				className={ classNames('account-picture', className) }/>
		)
	}
}