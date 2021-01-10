import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from './Button'

import './Slideshow.PaginationNumeric.css'

export default function SlideshowPaginationNumeric({
	i,
	count,
	onGoToSlide,
	highContrast,
	isDisabled,
	className
}) {
	const goToSlide = useCallback(() => {
		const number = parseInt(prompt())
		if (!isNaN(number)) {
			onGoToSlide(number)
		}
	}, [onGoToSlide])
	return (
		<Button
			onClick={goToSlide}
			className={classNames(className, 'Slideshow-PaginationNumeric')}>
			<div className="Slideshow-PaginationNumericCurrent">
				{i + 1}
			</div>
			<div className="Slideshow-PaginationNumericDivider">
				/
			</div>
			<div className="Slideshow-PaginationNumericTotal">
				{count}
			</div>
		</Button>
	)
}

SlideshowPaginationNumeric.propTypes = {
	i: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	onGoToSlide: PropTypes.func.isRequired,
	highContrast: PropTypes.bool,
	isDisabled: PropTypes.func.isRequired,
	className: PropTypes.string
}
