import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import { Switch } from 'react-responsive-ui'

import { autoDarkMode } from '../../utility/style'

import {
	ContentSection,
	ContentSectionHeader
} from '../ContentSection'

export default function DarkModeSettings({
	messages,
	autoDarkModeValue,
	onAutoDarkModeChange,
	onSetDarkMode
}) {
	const _onAutoDarkModeChange = useCallback((value) => {
		onAutoDarkModeChange(value)
		autoDarkMode(value, onSetDarkMode)
	}, [onAutoDarkModeChange])
	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.darkMode.title}
			</ContentSectionHeader>

			<Switch
				value={autoDarkModeValue}
				onChange={_onAutoDarkModeChange}
				placement="left">
				{messages.settings.darkMode.auto}
			</Switch>
		</ContentSection>
	)
}

DarkModeSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	autoDarkModeValue: PropTypes.bool,
	onAutoDarkModeChange: PropTypes.func.isRequired,
	onSetDarkMode: PropTypes.func.isRequired
}