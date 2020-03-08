import React, { useRef, useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FocusLock from 'react-focus-lock'

// // `body-scroll-lock` has been modified a bit, see the info in the header of the file.
// import {
// 	disableBodyScroll,
// 	enableBodyScroll,
// 	clearAllBodyScrollLocks
// } from '../utility/body-scroll-lock'

import {
	isTouchDevice,
	isMediumScreenSizeOrLarger
} from './DeviceInfo'

import SlideshowProgress from './Slideshow.Progress'
import Slideshow, { PLUGINS } from './Slideshow.Core'
export { isSlideSupported } from './Slideshow.Core'
import SlideshowSize from './Slideshow.Size'

// import Download from '../../assets/images/icons/download-cloud.svg'
import ExternalIcon from '../../assets/images/icons/external.svg'
import LeftArrow from '../../assets/images/icons/left-arrow-minimal.svg'
import RightArrow from '../../assets/images/icons/right-arrow-minimal.svg'
import ScaleFrame from '../../assets/images/icons/scale-frame.svg'
import Plus from '../../assets/images/icons/plus.svg'
import Minus from '../../assets/images/icons/minus.svg'
import Close from '../../assets/images/icons/close.svg'
import LeftArrowCounterform from '../../assets/images/icons/left-arrow-minimal-counterform.svg'
import RightArrowCounterform from '../../assets/images/icons/right-arrow-minimal-counterform.svg'
import CloseCounterform from '../../assets/images/icons/close-counterform.svg'
import EllipsisVerticalCounterform from '../../assets/images/icons/ellipsis-vertical-counterform.svg'

import LeftArrowCounterformThickStroke from '../../assets/images/icons/left-arrow-minimal-counterform-thick-stroke.svg'
import RightArrowCounterformThickStroke from '../../assets/images/icons/right-arrow-minimal-counterform-thick-stroke.svg'
import CloseCounterformThickStroke from '../../assets/images/icons/close-counterform-thick-stroke.svg'
import EllipsisVerticalCounterformThickStroke from '../../assets/images/icons/ellipsis-vertical-counterform-thick-stroke.svg'

import './Slideshow.css'

export default function SlideshowWrapper(props) {
	props = {
		...props,
		headerHeight: props.header && props.header.offsetHeight,
		footerHeight: props.footer && props.footer.offsetHeight
	}
	// `window.SlideshowSize` is used in `preloadPictureSlide()` in `Slideshow.Picture.js`.
	window.SlideshowSize = new SlideshowSize(null, props)
	if (props.isOpen) {
		return <SlideshowComponent {...props}/>
	} else {
		return null
	}
}

function SlideshowComponent(props) {
	const container = useRef()
	const slidesRef = useRef()
	const currentSlideRef = useRef()
	const currentSlideContainerRef = useRef()
	const previousButtonRef = useRef()
	const nextButtonRef = useRef()
	const closeButtonRef = useRef()

	const slide = props.children[props.i]

	// Emulates `forceUpdate()`
	const [unusedState, setUnusedState] = useState()
	const forceUpdate = useCallback(() => setUnusedState({}), [])

	useEffect(() => {
		if (unusedState) {
			slideshow.onAfterRerender()
		}
	}, [unusedState])

	const focus = useCallback((direction = 'next') => {
		if (currentSlideRef.current.focus) {
			if (currentSlideRef.current.focus() !== false) {
				return
			}
		}
		if (!isTouchDevice()) {
			if (direction === 'next' && nextButtonRef.current) {
				return nextButtonRef.current.focus()
			} else if (direction === 'previous' && previousButtonRef.current) {
				return previousButtonRef.current.focus()
			} else if (direction === 'previous' && nextButtonRef.current) {
				return nextButtonRef.current.focus()
			} else if (closeButtonRef.current) {
				// Close button is not rendered in inline mode, for example.
				return closeButtonRef.current.focus()
			}
		}
		return container.current.focus()
	}, [])

	const slideshow = useMemo(() => {
		return new Slideshow({
			...props,
			getSlideDOMNode: () => currentSlideRef.current && currentSlideContainerRef.current.firstChild,
			// getSlideElement: () => currentSlideRef.current && currentSlideRef.current.getDOMNode && currentSlideRef.current.getDOMNode(),
			onPanStart: () => container.current.classList.add('rrui__slideshow--panning'),
			onPanEnd: () => container.current.classList.remove('rrui__slideshow--panning'),
			setOverlayTransitionDuration: (duration) => container.current.style.transitionDuration = duration,
			setOverlayBackgroundColor: (color) => container.current.style.backgroundColor = color,
			setSlideRollTransitionDuration: (duration) => slidesRef.current.style.transitionDuration = duration + 'ms',
			setSlideRollTransform: (transform) => slidesRef.current.style.transform = transform,
			isRendered: () => slidesRef.current !== undefined,
			getWidth: () => slidesRef.current.clientWidth,
			getHeight: () => slidesRef.current.clientHeight,
			isOverlay: (element) => element.classList.contains('rrui__slideshow__slide'),
			isSmallScreen: () => !isMediumScreenSizeOrLarger(),
			isTouchDevice,
			isButton
		})
	}, [])

	const [slideshowState, setSlideshowState] = useState(slideshow.getState())
	slideshow.onStateChange(setSlideshowState)

	const prevSlideIndex = useRef(slideshowState.i)
	const [hasBeenMeasured, setHasBeenMeasured] = useState(props.inline ? false : true)

	// Uses `useLayoutEffect()` instead of `useEffect()`
	// because it manipulates DOM Elements (animation).
	useLayoutEffect(() => {
		if (!hasBeenMeasured) {
			return
		}
		slideshow.unlock()
		slideshow.animateOpenClose()
	}, [hasBeenMeasured])

	useEffect(() => {
		const { i } = slideshowState
		const iPrevious = prevSlideIndex.current
		if (i !== iPrevious) {
			focus(i > iPrevious ? 'next' : 'previous')
			prevSlideIndex.current = i
		}
	})

	// Uses `useLayoutEffect()` instead of `useEffect()`
	// because after this hook has been run an "inline"
	// slideshow re-renders now that it has access
	// to `this.getSlideshowWidth()`/`this.getSlideshowHeight()`.
	// If the slideshow was fullscreen-only then this subsequent
	// re-render wouldn't be required. But for an `inline` slideshow it would.
	useLayoutEffect(() => {
		// `slidesRef.current` is now available for `this.getSlideshowWidth()`.
		// Also updates container padding-right for scrollbar width compensation.
		setHasBeenMeasured(true)
	}, [])

	useEffect(() => {
		const { fullScreen } = props
		// Focus is now handled by `react-focus-lock`.
		// if (document.activeElement) {
		// 	this.returnFocusTo = document.activeElement
		// }
		focus()
		// if (!inline) {
		// 	// Without this in iOS Safari body content would scroll.
		// 	// https://medium.com/jsdownunder/locking-body-scroll-for-all-devices-22def9615177
		// 	const scrollBarWidth = getScrollBarWidth()
		// 	disableBodyScroll(container.current, {
		// 		// Apply the scrollbar-compensating padding immediately when setting
		// 		// body's `overflow: hidden` to prevent "jitter" ("jank") (visual lag).
		// 		// (for the `<body/>`)
		// 		reserveScrollBarGap: true,
		// 		onBodyOverflowHide: () => {
		// 			// Apply the scrollbar-compensating padding immediately when setting
		// 			// body's `overflow: hidden` to prevent "jitter" ("jank") (visual lag).
		// 			// (for the slideshow `position: fixed` layer)
		// 			if (container.current) {
		// 				container.current.style.paddingRight = scrollBarWidth + 'px'
		// 				// Render the slideshow with scrollbar-compensating padding in future re-renders.
		// 				this.containerPaddingRight = scrollBarWidth + 'px'
		// 			}
		// 		}
		// 	})
		// }
		if (fullScreen) {
			slideshow.fullscreen.enterFullscreen(container.current)
		}
		slideshow.init({ container: container.current })
		slideshow.rerender = forceUpdate
		return () => {
			// Focus is now handled by `react-focus-lock`.
			// if (this.returnFocusTo) {
			// 	this.returnFocusTo.focus()
			// }
			// if (!inline) {
			// 	// Disable `body-scroll-lock` (as per their README).
			// 	enableBodyScroll(container.current)
			// 	clearAllBodyScrollLocks()
			// }
			slideshow.cleanUp()
			// if (clearThumbnailImageOverlay.current) {
			// 	clearThumbnailImageOverlay.current()
			// }
		}
	}, [])

	return SlideshowComponent_({
		slideshow,
		props,
		slideshowState,
		hasBeenMeasured,
		// refs.
		container,
		slidesRef,
		currentSlideRef,
		currentSlideContainerRef,
		previousButtonRef,
		nextButtonRef,
		closeButtonRef
	})
}

function SlideshowComponent_({
	slideshow: _this,
	props,
	slideshowState,
	hasBeenMeasured,
	// refs.
	container,
	slidesRef,
	currentSlideRef,
	currentSlideContainerRef,
	previousButtonRef,
	nextButtonRef,
	closeButtonRef
}) {
	const {
		inline,
		mode,
		animateOpen,
		animateClose,
		overlayOpacity,
		showScaleButtons,
		highContrastControls,
		slideCardMinOverlayOpacity,
		messages,
		children: slides
	} = props

	const {
		i,
		slidesShown,
		slideIndexAtWhichTheSlideshowIsBeingOpened,
		showMoreControls,
		hasStartedOpening,
		hasFinishedOpening,
		openingAnimationDuration,
		hasStartedClosing,
		hasFinishedClosing,
		closingAnimationDuration,
		slideOffsetX,
		slideOffsetY,
		slideOffsetIndex
	} = slideshowState

	// `react-focus-lock` doesn't focus `<video/>` when cycling the Tab key.
	// https://github.com/theKashey/react-focus-lock/issues/61

	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={_this.onPointerDown}
	// onPointerUp={_this.onPointerUp}
	// onPointerMove={_this.onPointerMove}
	// onPointerOut={_this.onPointerOut}

	// React doesn't support setting up non-passive listeners.
	// https://github.com/facebook/react/issues/14856
	// onTouchMove={_this.onTouchMove}
	// onWheel={_this.onWheel}>

	// `tabIndex={ -1 }` makes the `<div/>` focusable.
	return (
		<FocusLock
			returnFocus={FOCUS_OPTIONS}
			autoFocus={false}>
			<div
				ref={container}
				tabIndex={-1}
				style={inline ? undefined : {
					// paddingRight: _this.containerPaddingRight,
					// transitionDuration: _this.getOverlayTransitionDuration(),
					// `_this.props.overlayOpacity` is the default overlay opacity
					// and doesn't reflect the current overlay opacity.
					// Overlay opacity only changes when user swipes up/down
					// or left on the first slide or right on the last slide,
					// and slides get re-rendered only on `_this.setState()`
					// which doesn't interfere with the opacity change.
					backgroundColor: _this.getOverlayBackgroundColor(
						hasStartedOpening ?
							(hasFinishedOpening ?
								(hasStartedClosing && animateClose ? 0 : overlayOpacity) :
								overlayOpacity
							) :
							(animateOpen ? 0 : overlayOpacity)
					),
					transition: hasStartedOpening ?
						(hasFinishedOpening ?
							(hasStartedClosing && animateClose ? `background-color ${closingAnimationDuration}ms` : undefined) :
							`background-color ${openingAnimationDuration}ms`
						) :
						undefined
				}}
				className={classNames('rrui__slideshow', {
					'rrui__slideshow--fullscreen': !inline,
					'rrui__slideshow--panning': _this.isActuallyPanning
				})}
				onKeyDown={_this.onKeyDown}
				onDragStart={_this.onDragStart}
				onTouchStart={_this.onTouchStart}
				onTouchEnd={_this.onTouchEnd}
				onTouchCancel={_this.onTouchCancel}
				onMouseDown={_this.onPointerDown}
				onMouseUp={_this.onPointerUp}
				onMouseMove={_this.onPointerMove}
				onMouseLeave={_this.onPointerOut}
				onClick={_this.onBackgroundClick}>
				<div style={INNER_CONTAINER_STYLE}>
					<ul
						ref={slidesRef}
						style={{
							// `will-change` performs the costly "Composite Layers"
							// operation at mount instead of when navigating through slides.
							// Otherwise that "Composite Layers" operation would take about
							// 30ms a couple of times sequentially causing a visual lag.
							willChange: 'transform',
							// transitionDuration: hasBeenMeasured ? _this.getSlideRollTransitionDuration() : undefined,
							transform: hasBeenMeasured ? _this.getSlideRollTransform() : undefined,
							opacity: hasBeenMeasured ? 1 : 0
						}}
						className="rrui__slideshow__slides">
						{hasBeenMeasured && slides.map((slide, j) => (
							<li
								key={j}
								ref={j === i ? currentSlideContainerRef : undefined}
								className={classNames('rrui__slideshow__slide', {
									'rrui__slideshow__slide--current': i === j,
									'rrui__slideshow__slide--card': overlayOpacity < slideCardMinOverlayOpacity
								})}>
								{slidesShown[j] && _this.getPluginForSlide(slide) &&
									_this.getPluginForSlide(slide).render({
										slide,
										ref: i === j ? currentSlideRef : undefined,
										tabIndex: i === j ? 0 : -1,
										isCurrentSlide: i === j,
										autoPlay: slideIndexAtWhichTheSlideshowIsBeingOpened === j,
										mode,
										// // `scale` is passed as `pixelRatioMultiplier` to `<Picture/>`.
										// scale: _this.getSlideScale(j),
										onClick: _this.onSlideClick,
										width: _this.getCurrentSlideWidth() * _this.getSlideScale(j),
										height: _this.getCurrentSlideHeight() * _this.getSlideScale(j),
										style: {
											/* Can be scaled via `style="transform: scale(...)". */
											// transition: 'transform 120ms ease-out',
											// Scaling is done via a CSS transform.
											// The reason for that is having a CSS transition animation.
											// The right way of doing scaling would be by scaling
											// `maxWidth` and `maxHeight`, but that wouldn't be
											// as performant when animating as CSS transitions.
											// For `<img/>`s it doesn't make any difference
											// whether they're scaled via a CSS transform
											// or by scaling `width` and `height`.
											// Same's for `<video/>`s.
											// transform: _this.getSlideScale(j) === 1 ? undefined : `scale(${_this.getSlideScale(j)})`
											transform: _this.getSlideTransform(j),
											// Adjacent slides have `box-shadow`.
											// If its `opacity` isn't animated during open/close
											// then the non-smoothness is noticeable.
											transition: j === i ? undefined : (
												hasStartedOpening ?
													(hasFinishedOpening ?
														(hasStartedClosing && animateClose ? `opacity ${closingAnimationDuration}ms` : undefined) :
														`opacity ${openingAnimationDuration}ms`
													) :
													undefined
											),
											opacity: j === i ? undefined : (
												hasStartedOpening ?
													(hasFinishedOpening ?
														(hasStartedClosing && animateClose ? 0 : undefined) :
														1
													) :
													(animateOpen ? 0 : undefined)
											)
										}
										// shouldUpscaleSmallSlides: _this.shouldUpscaleSmallSlides()
									})
								}
							</li>
						))}
					</ul>

					{(
						hasStartedOpening ?
							(hasFinishedOpening ?
								(hasStartedClosing && animateClose ? false : true) :
								true
							) :
							(animateOpen ? false : true)
					) &&
						<Controls
							slideshow={_this}
							slides={slides}
							i={i}
							messages={messages}
							showScaleButtons={showScaleButtons}
							showMoreControls={showMoreControls}
							closeButtonRef={closeButtonRef}
							previousButtonRef={previousButtonRef}
							nextButtonRef={nextButtonRef}
							highContrastControls={highContrastControls}/>
					}
				</div>
			</div>
		</FocusLock>
	)
}

SlideshowComponent_.propTypes = {
	slideshow: PropTypes.object.isRequired,
	props: PropTypes.object.isRequired,
	overlayOpacity: PropTypes.number,
	animateOpen: PropTypes.bool,
	animateClose: PropTypes.bool,
	slideshowState: PropTypes.object.isRequired,
	hasBeenMeasured: PropTypes.bool,
	hasStartedOpening: PropTypes.bool,
	hasFinishedOpening: PropTypes.bool,
	openingAnimationDuration: PropTypes.number,
	hasStartedClosing: PropTypes.bool,
	hasFinishedClosing: PropTypes.bool,
	closingAnimationDuration: PropTypes.number,
	slideOffsetX: PropTypes.number,
	slideOffsetY: PropTypes.number,
	slideOffsetIndex: PropTypes.number,
	// refs.
	container: PropTypes.object.isRequired,
	slidesRef: PropTypes.object.isRequired,
	currentSlideRef: PropTypes.object.isRequired,
	currentSlideContainerRef: PropTypes.object.isRequired,
	previousButtonRef: PropTypes.object.isRequired,
	nextButtonRef: PropTypes.object.isRequired,
	closeButtonRef: PropTypes.object.isRequired
}

function Controls({
	slideshow: _this,
	slides,
	i,
	messages,
	showScaleButtons,
	showMoreControls,
	closeButtonRef,
	previousButtonRef,
	nextButtonRef,
	highContrastControls
}) {
	const LeftArrowCounterForm = highContrastControls ? LeftArrowCounterformThickStroke : LeftArrowCounterform
	const RightArrowCounterForm = highContrastControls ? RightArrowCounterformThickStroke : RightArrowCounterform
	const CloseCounterForm = highContrastControls ? CloseCounterformThickStroke : CloseCounterform
	const EllipsisVerticalCounterForm = highContrastControls ? EllipsisVerticalCounterformThickStroke : EllipsisVerticalCounterform
	return (
		<React.Fragment>
			<ul className="rrui__slideshow__actions">
				{_this.shouldShowMoreControls() && _this.shouldShowScaleButtons() &&
					<li className={classNames('rrui__slideshow__action-item', {
						'rrui__slideshow__action-group': showScaleButtons
					})}>
						{showScaleButtons &&
							<button
								type="button"
								title={messages.actions.scaleDown}
								onClick={_this.onScaleDown}
								className="rrui__button-reset rrui__slideshow__action">
								<Minus className="rrui__slideshow__action-icon"/>
							</button>
						}
						<button
							type="button"
							title={messages.actions.scaleReset}
							onClick={_this.onScaleToggle}
							className="rrui__button-reset rrui__slideshow__action">
							<ScaleFrame className="rrui__slideshow__action-icon"/>
						</button>
						{showScaleButtons &&
							<button
								type="button"
								title={messages.actions.scaleUp}
								onClick={_this.onScaleUp}
								className="rrui__button-reset rrui__slideshow__action">
								<Plus className="rrui__slideshow__action-icon"/>
							</button>
						}
					</li>
				}

				{_this.shouldShowMoreControls() && _this.shouldShowOpenExternalLinkButton() &&
					<li className="rrui__slideshow__action-item">
						<a
							target="_blank"
							title={messages.actions.openExternalLink}
							onKeyDown={clickTheLinkOnSpacebar}
							href={_this.getPluginForSlide().getExternalLink(_this.getCurrentSlide())}
							className="rrui__slideshow__action rrui__slideshow__action--link">
							<ExternalIcon className="rrui__slideshow__action-icon"/>
						</a>
					</li>
				}

				{/*_this.shouldShowMoreControls() && _this.shouldShowDownloadButton() &&
					<li className="rrui__slideshow__action-item">
						<a
							download
							target="_blank"
							title={messages.actions.download}
							onKeyDown={clickTheLinkOnSpacebar}
							href={_this.getPluginForSlide().getDownloadUrl(_this.getCurrentSlide())}
							className="rrui__slideshow__action rrui__slideshow__action--link">
							<Download className="rrui__slideshow__action-icon"/>
						</a>
					</li>
				*/}

				{_this.shouldShowMoreControls() && _this.getOtherActions().map(({ name, icon: Icon, link, action }) => {
					const icon = <Icon className={`rrui__slideshow__action-icon rrui__slideshow__action-icon--${name}`}/>
					return (
						<li key={name} className="rrui__slideshow__action-item">
							{link &&
								<a
									target="_blank"
									href={link}
									title={messages.actions[name]}
									className="rrui__slideshow__action rrui__slideshow__action--link">
									{icon}
								</a>
							}
							{!link &&
								<button
									type="button"
									onClick={(event) => {
										if (!_this.slideshow.isLocked()) {
											action(event)
										}
									}}
									title={messages.actions[name]}
									className="rrui__button-reset rrui__slideshow__action">
									{icon}
								</button>
							}
						</li>
					)
				})}

				{/* "Show/Hide controls" */}
				{/* Is visible only on small screens. */}
				{!_this.shouldShowMoreControls() && _this.hasHidableControls() && _this.shouldShowShowMoreControlsButton() &&
					<li className="rrui__slideshow__action-item rrui__slideshow__action-item--toggle-controls">
						<button
							type="button"
							title={showMoreControls ? messages.actions.hideControls : messages.actions.showControls}
							onClick={_this.onShowMoreControls}
							className={classNames('rrui__button-reset', 'rrui__slideshow__action', 'rrui__slideshow__action--counterform', {
								'rrui__slideshow__action--toggled': showMoreControls
							})}>
							<EllipsisVerticalCounterForm className="rrui__slideshow__action-icon"/>
						</button>
					</li>
				}

				{_this.shouldShowCloseButton() &&
					<li className="rrui__slideshow__action-item rrui__slideshow__action-item--close">
						<button
							ref={closeButtonRef}
							type="button"
							title={messages.actions.close}
							onClick={_this.onClose}
							className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action--counterform">
							<CloseCounterForm className="rrui__slideshow__action-icon"/>
						</button>
					</li>
				}
			</ul>

			{slides.length > 1 && i > 0 && _this.shouldShowPreviousNextButtons() &&
				<button
					ref={previousButtonRef}
					type="button"
					title={messages.actions.previous}
					onClick={_this.onShowPrevious}
					className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action--counterform rrui__slideshow__previous">
					<LeftArrowCounterForm className="rrui__slideshow__action-icon"/>
				</button>
			}

			{slides.length > 1 && i < slides.length - 1 && _this.shouldShowPreviousNextButtons() &&
				<button
					ref={nextButtonRef}
					type="button"
					title={messages.actions.next}
					onClick={_this.onShowNext}
					className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action rrui__slideshow__action--counterform rrui__slideshow__next">
					<RightArrowCounterForm className="rrui__slideshow__action-icon"/>
				</button>
			}

			{slides.length > 1 &&
				<div className="rrui__slideshow__progress rrui__slideshow__controls-center rrui__slideshow__controls-bottom">
					<SlideshowProgress
						i={i}
						count={slides.length}
						isDisabled={_this.isLocked}
						onShowSlide={_this.showSlide}
						onShowNextSlide={_this.showNext}
						highContrast={highContrastControls}/>
				</div>
			}
		</React.Fragment>
	)
}

Controls.propTypes = {
	slides,
	i,
	messages,
	showScaleButtons,
	showMoreControls,
	closeButtonRef: PropTypes.object,
	previousButtonRef: PropTypes.object,
	nextButtonRef: PropTypes.object,
	highContrastControls: PropTypes.bool,
	slideshow: PropTypes.object.isRequired
}

SlideshowComponent.propTypes = {
	messages: PropTypes.object.isRequired,
	onClose: PropTypes.func.isRequired,
	i: PropTypes.number.isRequired,
	// Set to `true` to open slideshow in inline mode (rather than in a modal).
	inline: PropTypes.bool.isRequired,
	// Set to `true` to open slideshow in "native" browser fullscreen mode.
	fullScreen: PropTypes.bool.isRequired,
	overlayOpacity: PropTypes.number.isRequired,
	overlayOpacityFlowMode: PropTypes.number,
	// overlayOpenCloseAnimationDuration: PropTypes.number.isRequired,
	// previousNextClickRatio: PropTypes.number.isRequired,
	closeOnOverlayClick: PropTypes.bool.isRequired,
	closeOnSlideClick: PropTypes.bool,
	panOffsetThreshold: PropTypes.number.isRequired,
	emulatePanResistanceOnClose: PropTypes.bool.isRequired,
	slideInDuration: PropTypes.number.isRequired,
	minSlideInDuration: PropTypes.number.isRequired,
	showScaleButtons: PropTypes.bool.isRequired,
	scaleStep: PropTypes.number.isRequired,
	minScaledSlideRatio: PropTypes.number.isRequired,
	mouseWheelScaleFactor: PropTypes.number.isRequired,
	// minInitialScale: PropTypes.number.isRequired,
	fullScreenFitPrecisionFactor: PropTypes.number.isRequired,
	margin: PropTypes.number.isRequired,
	minMargin: PropTypes.number.isRequired,
	animateOpenClose: PropTypes.bool,
	animateOpenCloseSmallScreen: PropTypes.bool,
	animateOpenCloseOnPanOut: PropTypes.bool,
	animateOpenCloseScaleSmallScreen: PropTypes.bool,
	smallScreenMaxWidth: PropTypes.number,
	mode: PropTypes.oneOf(['flow']),
	showControls: PropTypes.bool.isRequired,
	highContrastControls: PropTypes.bool,
	slideCardMinOverlayOpacity: PropTypes.number.isRequired,
	showPagination: PropTypes.bool,
	thumbnailImage: PropTypes.any, // `Element` is not defined on server side. // PropTypes.instanceOf(Element),
	header: PropTypes.any, // `Element` is not defined on server side. // PropTypes.instanceOf(Element),
	plugins: PropTypes.arrayOf(PropTypes.shape({
		getMaxSize: PropTypes.func.isRequired,
		getAspectRatio: PropTypes.func.isRequired,
		getOtherActions: PropTypes.func,
		preload: PropTypes.func,
		minInitialScale: PropTypes.number,
		allowChangeSlideOnClick: PropTypes.bool,
		// isScaleDownAllowed: PropTypes.func.isRequired,
		canOpenExternalLink: PropTypes.func,
		getExternalLink: PropTypes.func,
		canSwipe: PropTypes.func,
		// hasCloseButtonClickingIssues: PropTypes.func,
		// capturesArrowKeys: PropTypes.func,
		onKeyDown: PropTypes.func,
		canRender: PropTypes.func.isRequired,
		render: PropTypes.func.isRequired,
		// showCloseButtonForSingleSlide: PropTypes.bool
	})).isRequired,
	children: PropTypes.arrayOf(PropTypes.any).isRequired
}

SlideshowComponent.defaultProps = {
	i: 0,
	inline: false,
	fullScreen: false,
	overlayOpacity: 0.85,
	// overlayOpenCloseAnimationDuration: 0,
	// // previousNextClickRatio: 0.33,
	// previousNextClickRatio: 0,
	closeOnOverlayClick: true,
	panOffsetThreshold: 5,
	emulatePanResistanceOnClose: false,
	slideInDuration: 500,
	minSlideInDuration: 150,
	showScaleButtons: true,
	showControls: true,
	slideCardMinOverlayOpacity: 0.2,
	scaleStep: 0.5,
	minScaledSlideRatio: 0.1,
	mouseWheelScaleFactor: 0.33,
	// minInitialScale: 0.5,
	fullScreenFitPrecisionFactor: 0.875,
	margin: 0.025, // %
	minMargin: 10, // px
	plugins: PLUGINS,
	messages: {
		actions: {
			//
		}
	}
}

SlideshowWrapper.propTypes = {
	...SlideshowComponent.propTypes,
	children: PropTypes.arrayOf(PropTypes.any)
}

SlideshowWrapper.defaultProps = SlideshowComponent.defaultProps

// function getTranslateX(element) {
// 	return getComputedStyle(element).transform.match(/\d+/g)[4]
// }

function clickTheLinkOnSpacebar(event) {
	switch (event.keyCode) {
		// "Spacebar".
		// Play video
		case 32:
			event.preventDefault()
			event.target.click()
	}
}

function isButton(element) {
	if (element.classList && element.classList.contains('rrui__slideshow__action')) {
		return true
	}
	// `<button/>` tag name didn't work on "Open external link" hyperlink
	// and also did reset dragging on Video slides (which are buttons).
	// if (element.tagName === 'BUTTON') {
	// 	return true
	// }
	if (element.parentNode) {
		return isButton(element.parentNode)
	}
	return false
}

const FOCUS_OPTIONS = {
	preventScroll: true
}

const INNER_CONTAINER_STYLE = {
	position: 'relative',
	width: '100%',
	height: '100%'
}

window.Slideshow = {
	willOpen(onCancel) {
		if (this.openRequest) {
			this.openRequest.cancel()
		}
		return this.openRequest = {
			cancel() {
				this.cancelled = true
				onCancel()
			}
		}
	}
}