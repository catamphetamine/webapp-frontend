import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { ChromePicker } from 'react-color'
import { Expandable } from 'react-responsive-ui'

export default function ColorPicker()
{
	return (
		<Expandable>
			<ChromePicker/>
		</Expandable>
	)
}