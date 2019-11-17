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

export default function AccountPicture({
	picture,
	account,
	className,
	...rest
}) {
	return (
		<Picture
			{...rest}
			picture={ picture || account.picture || DEFAULT_ACCOUNT_PICTURE }
			className={ classNames('account-picture', className) }/>
	)
}

AccountPicture.propTypes =
{
	picture   : PropTypes.object,
	account   : PropTypes.object.isRequired,
	style     : PropTypes.object,
	className : PropTypes.string
}