import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from './Button'

import './Slideshow.Progress.css'

export default function SlideshowProgress({
	i,
	count,
	maxCountForDots,
	onShowSlide,
	onShowNextSlide,
	onGoToSlide,
	highContrast,
	isDisabled
}) {
	const goToSlide = useCallback(() => {
		const number = parseInt(prompt())
		if (!isNaN(number)) {
			onGoToSlide(number)
		}
	}, [onGoToSlide])
	if (count > maxCountForDots) {
		return (
			<Button
				onClick={goToSlide}
				tabIndex={-1}
				className="rrui__slideshow__progress-counter">
				<div className="rrui__slideshow__progress-counter-current">
					{i + 1}
				</div>
				<div className="rrui__slideshow__progress-counter-divider">
					/
				</div>
				<div className="rrui__slideshow__progress-counter-total">
					{count}
				</div>
			</Button>
		)
	}
	return (
		<ul className={classNames('rrui__slideshow__progress-dots', {
			'rrui__slideshow__progress-dots--high-contrast': highContrast
		})}>
			{createRange(count).map((_, j) => (
				<li key={j}>
					<Button
						onClick={() => {
							if (!isDisabled()) {
								onShowSlide(j)
							}
						}}
						tabIndex={-1}
						className={classNames('rrui__slideshow__progress-dot', {
							'rrui__slideshow__progress-dot--selected': j === i,
							'rrui__slideshow__progress-dot--high-contrast': highContrast
						})}>
					</Button>
				</li>
			))}
		</ul>
	)
}

SlideshowProgress.propTypes = {
	i: PropTypes.number.isRequired,
	count: PropTypes.number.isRequired,
	maxCountForDots: PropTypes.number.isRequired,
	onShowSlide: PropTypes.func.isRequired,
	onShowNextSlide: PropTypes.func.isRequired,
	onGoToSlide: PropTypes.func.isRequired,
	highContrast: PropTypes.bool,
	isDisabled: PropTypes.func.isRequired
}

SlideshowProgress.defaultProps = {
	maxCountForDots: 10
}

function createRange(N) {
	const range = new Array(N)
	for (let i = 1; i <= N; i++) {
		range[i - 1] = i
	}
	return range
}