import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import Picture from './Picture'

import DefaultAccountPicture from '../../assets/images/account-picture.svg'

const DEFAULT_ACCOUNT_PICTURE =
{
	type: 'image/svg+xml',
	sizes: [{
		url : DefaultAccountPicture
	}]
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
				sizes={ picture ? picture.sizes : (account.data.picture ? account.data.picture.sizes : DEFAULT_ACCOUNT_PICTURE.sizes) }
				className={ classNames('account-picture', className) }/>
		)
	}
}