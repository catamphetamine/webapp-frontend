import React, { useCallback, useMemo } from 'react'
import PropTypes from 'prop-types'
import { Select } from 'react-responsive-ui'

import {
	FONT_SIZES,
	applyFontSize
} from '../../utility/style'

import {
	ContentSection,
	ContentSectionHeader
} from '../ContentSection'

export default function FontSizeSettings({
	messages,
	value,
	onChange
}) {
	const saveFontSize = useCallback((fontSize) => {
		applyFontSize(fontSize)
		onChange(fontSize)
	}, [onChange])

	const options = useMemo(() => {
		return FONT_SIZES.map((fontSize) => ({
			value: fontSize,
			label: messages.settings.fontSize[fontSize]
		}))
	}, [messages])

	return (
		<ContentSection>
			<ContentSectionHeader lite>
				{messages.settings.fontSize.title}
			</ContentSectionHeader>
			<Select
				value={value}
				options={options}
				onChange={saveFontSize}/>
		</ContentSection>
	)
}

FontSizeSettings.propTypes = {
	messages: PropTypes.object.isRequired,
	value: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired
}