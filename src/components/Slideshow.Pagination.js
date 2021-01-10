import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from './Button'

import SlideshowPaginationDots from './Slideshow.PaginationDots'
import SlideshowPaginationNumeric from './Slideshow.PaginationNumeric'

import './Slideshow.Pagination.css'

export default function SlideshowPagination({
	i,
	count,
	paginationDotsMaxSlidesCount,
	onShowSlide,
	onShowNextSlide,
	onGoToSlide,
	highContrast,
	isDisabled,
	...rest
}) {
	const Component = count > paginationDotsMaxSlidesCount
		? SlideshowPaginationNumeric
		: SlideshowPaginationDots
	return (
		<Component
			{...rest}
			i={i}
			count={count}
			onGoToSlide={onGoToSlide}
			highContrast={highContrast}
			isDisabled={isDisabled}/>
	)
}

SlideshowPagination.propTypes = {
	i: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	paginationDotsMaxSlidesCount: PropTypes.number.isRequired,
	onShowSlide: PropTypes.func.isRequired,
	onShowNextSlide: PropTypes.func.isRequired,
	onGoToSlide: PropTypes.func.isRequired,
	highContrast: PropTypes.bool,
	isDisabled: PropTypes.func.isRequired
}