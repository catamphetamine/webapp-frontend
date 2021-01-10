import React, { useCallback } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import { Button } from './Button'

// import Close from '../../assets/images/icons/close.svg'
// import Download from '../../assets/images/icons/download-cloud.svg'
import ExternalIcon from '../../assets/images/icons/external.svg'

import ScaleFrame from '../../assets/images/icons/scale-frame.svg'
import Plus from '../../assets/images/icons/plus.svg'
import Minus from '../../assets/images/icons/minus.svg'

import CloseCounterform from '../../assets/images/icons/close-counterform.svg'
import EllipsisVerticalCounterform from '../../assets/images/icons/ellipsis-vertical-counterform.svg'

import CloseCounterformThickStroke from '../../assets/images/icons/close-counterform-thick-stroke.svg'
import EllipsisVerticalCounterformThickStroke from '../../assets/images/icons/ellipsis-vertical-counterform-thick-stroke.svg'

import GoToIconCounterform from '../../assets/images/icons/go-to-counterform.svg'
// import SearchIcon from '../../assets/images/icons/search.svg'

import './Slideshow.Actions.css'

export default function SlideshowActions({
	slideshow,
	slides,
	i,
	showScaleButtons,
	showMoreControls,
	messages,
	goToSource,
	closeButtonRef,
	highContrastControls
}) {
	const CloseCounterForm = highContrastControls ? CloseCounterformThickStroke : CloseCounterform
	const EllipsisVerticalCounterForm = highContrastControls ? EllipsisVerticalCounterformThickStroke : EllipsisVerticalCounterform
	const onGoToSource = useCallback(() => {
		goToSource(slides[i])
	}, [goToSource, slides, i])
	return (
		<ul className="Slideshow-Actions">
			{slideshow.shouldShowMoreControls() && slideshow.shouldShowScaleButtons() &&
				<li className={classNames('Slideshow-ActionWrapper', {
					'Slideshow-ActionWrapper--group': showScaleButtons
				})}>
					{showScaleButtons &&
						<Button
							title={messages.actions.scaleDown}
							onClick={slideshow.onScaleDown}
							className="Slideshow-Action">
							<Minus className="Slideshow-ActionIcon"/>
						</Button>
					}
					<Button
						title={messages.actions.scaleReset}
						onClick={slideshow.onScaleToggle}
						className="Slideshow-Action">
						<ScaleFrame className="Slideshow-ActionIcon"/>
					</Button>
					{showScaleButtons &&
						<Button
							title={messages.actions.scaleUp}
							onClick={slideshow.onScaleUp}
							className="Slideshow-Action">
							<Plus className="Slideshow-ActionIcon"/>
						</Button>
					}
				</li>
			}

			{slideshow.shouldShowMoreControls() && slideshow.shouldShowOpenExternalLinkButton() &&
				<li className="Slideshow-ActionWrapper">
					<a
						target="_blank"
						title={messages.actions.openExternalLink}
						onKeyDown={clickTheLinkOnSpacebar}
						href={slideshow.getPluginForSlide().getExternalLink(slideshow.getCurrentSlide())}
						className="Slideshow-Action Slideshow-Action--link">
						<ExternalIcon className="Slideshow-ActionIcon"/>
					</a>
				</li>
			}

			{/*slideshow.shouldShowMoreControls() && slideshow.shouldShowDownloadButton() &&
				<li className="Slideshow-ActionWrapper">
					<a
						download
						target="_blank"
						title={messages.actions.download}
						onKeyDown={clickTheLinkOnSpacebar}
						href={slideshow.getPluginForSlide().getDownloadUrl(slideshow.getCurrentSlide())}
						className="Slideshow-Action Slideshow-Action--link">
						<Download className="Slideshow-ActionIcon"/>
					</a>
				</li>
			*/}

			{slideshow.shouldShowMoreControls() && slideshow.getOtherActions().map(({ name, icon: Icon, link, action }) => {
				const icon = <Icon className={`Slideshow-ActionIcon Slideshow-ActionIcon--${name}`}/>
				return (
					<li key={name} className="Slideshow-ActionWrapper">
						{link &&
							<a
								target="_blank"
								href={link}
								title={messages.actions[name]}
								className="Slideshow-Action Slideshow-Action--link">
								{icon}
							</a>
						}
						{!link &&
							<Button
								onClick={(event) => {
									if (!slideshow.slideshow.isLocked()) {
										action(event)
									}
								}}
								title={messages.actions[name]}
								className="Slideshow-Action">
								{icon}
							</Button>
						}
					</li>
				)
			})}

			{/* "Go to source" */}
			{goToSource &&
				<li className="Slideshow-ActionWrapper">
					<Button
						title={messages.actions.goToSource}
						onClick={onGoToSource}
						className="Slideshow-Action Slideshow-Action--counterform">
						<GoToIconCounterform className="Slideshow-ActionIcon"/>
					</Button>
				</li>
			}

			{/* "Show/Hide controls" */}
			{/* Is visible only on small screens. */}
			{!slideshow.shouldShowMoreControls() && slideshow.hasHidableControls() && slideshow.shouldShowShowMoreControlsButton() &&
				<li className="Slideshow-ActionWrapper Slideshow-ActionWrapper--toggle-controls">
					<Button
						title={showMoreControls ? messages.actions.hideControls : messages.actions.showControls}
						onClick={slideshow.onShowMoreControls}
						className={classNames('Slideshow-Action', 'Slideshow-Action--counterform', {
							'Slideshow-Action--toggled': showMoreControls
						})}>
						<EllipsisVerticalCounterForm className="Slideshow-ActionIcon"/>
					</Button>
				</li>
			}

			{slideshow.shouldShowCloseButton() &&
				<li className="Slideshow-ActionWrapper">
					<Button
						ref={closeButtonRef}
						title={messages.actions.close}
						onClick={slideshow.onRequestClose}
						className="Slideshow-Action Slideshow-Action--counterform">
						<CloseCounterForm className="Slideshow-ActionIcon"/>
					</Button>
				</li>
			}
		</ul>
	)
}

SlideshowActions.propTypes = {
	slides,
	i,
	slideshow: PropTypes.object.isRequired,
	showScaleButtons,
	showMoreControls,
	messages,
	goToSource: PropTypes.func,
	closeButtonRef: PropTypes.object,
	CloseCounterForm: PropTypes.elementType.isRequired,
	EllipsisVerticalCounterForm: PropTypes.elementType.isRequired
}

function clickTheLinkOnSpacebar(event) {
	switch (event.keyCode) {
		// "Spacebar".
		// Play video
		case 32:
			event.preventDefault()
			event.target.click()
	}
}