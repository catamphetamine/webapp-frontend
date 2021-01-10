import React from 'react'
import PropTypes from 'prop-types'

import SlideshowPagination from './Slideshow.Pagination'
import SlideshowActions from './Slideshow.Actions'
import DragAndScaleModeControls from './Slideshow.DragAndScaleModeControls'
import SlideshowPropTypes from './Slideshow.PropTypes'

import { Button } from './Button'

// import LeftArrow from '../../assets/images/icons/left-arrow-minimal.svg'
// import RightArrow from '../../assets/images/icons/right-arrow-minimal.svg'

import LeftArrowCounterform from '../../assets/images/icons/left-arrow-minimal-counterform.svg'
import RightArrowCounterform from '../../assets/images/icons/right-arrow-minimal-counterform.svg'

import LeftArrowCounterformThickStroke from '../../assets/images/icons/left-arrow-minimal-counterform-thick-stroke.svg'
import RightArrowCounterformThickStroke from '../../assets/images/icons/right-arrow-minimal-counterform-thick-stroke.svg'

import './Slideshow.Controls.css'

export default function SlideshowControls({
	slideshow,
	slides,
	i,
	scale,
	messages,
	dragAndScaleMode,
	showActions,
	showScaleButtons,
	showMoreControls,
	showPagination,
	goToSource,
	closeButtonRef,
	previousButtonRef,
	nextButtonRef,
	highContrastControls
}) {
	const LeftArrowCounterForm = highContrastControls ? LeftArrowCounterformThickStroke : LeftArrowCounterform
	const RightArrowCounterForm = highContrastControls ? RightArrowCounterformThickStroke : RightArrowCounterform
	return (
		<div className="Slideshow-Controls">
			<DragAndScaleModeControls
				slideshow={slideshow}
				messages={messages}
				scale={scale}
				dragAndScaleMode={dragAndScaleMode}/>

			{showActions &&
				<SlideshowActions
					slideshow={slideshow}
					slides={slides}
					i={i}
					messages={messages}
					showScaleButtons={showScaleButtons}
					showMoreControls={showMoreControls}
					goToSource={goToSource}
					closeButtonRef={closeButtonRef}
					highContrastControls={highContrastControls}/>
			}

			{showActions && slides.length > 1 && i > 0 && slideshow.shouldShowPreviousNextButtons() &&
				<Button
					ref={previousButtonRef}
					title={messages.actions.previous}
					onClick={slideshow.onShowPrevious}
					className="Slideshow-Action Slideshow-Action--counterform Slideshow-Previous">
					<LeftArrowCounterForm className="Slideshow-ActionIcon"/>
				</Button>
			}

			{showActions && slides.length > 1 && i < slides.length - 1 && slideshow.shouldShowPreviousNextButtons() &&
				<Button
					ref={nextButtonRef}
					title={messages.actions.next}
					onClick={slideshow.onShowNext}
					className="Slideshow-Action Slideshow-Action--counterform Slideshow-Next">
					<RightArrowCounterForm className="Slideshow-ActionIcon"/>
				</Button>
			}

			{slides.length > 1 && showPagination &&
				<SlideshowPagination
					i={i}
					count={slides.length}
					isDisabled={slideshow.isLocked}
					onGoToSlide={slideshow.goToSlide}
					highContrast={highContrastControls}
					paginationDotsMaxSlidesCount={slideshow.props.paginationDotsMaxSlidesCount}
					className="Slideshow-ControlGroup--center Slideshow-ControlGroup--bottom"/>
			}
		</div>
	)
}

SlideshowControls.propTypes = {
	slides: SlideshowPropTypes.slides,
	i: PropTypes.number.isRequired,
	scale: PropTypes.number.isRequired,
	showActions: PropTypes.bool,
	messages: SlideshowPropTypes.messages.isRequired,
	dragAndScaleMode: PropTypes.bool,
	showScaleButtons: PropTypes.bool,
	showMoreControls: PropTypes.bool,
	showPagination: PropTypes.bool,
	goToSource: PropTypes.func,
	closeButtonRef: PropTypes.object,
	previousButtonRef: PropTypes.object,
	nextButtonRef: PropTypes.object,
	highContrastControls: PropTypes.bool,
	slideshow: PropTypes.object.isRequired
}