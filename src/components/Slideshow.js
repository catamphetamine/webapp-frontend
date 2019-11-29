import React, { useRef, useState, useCallback, useMemo, useEffect, useLayoutEffect } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import FocusLock from 'react-focus-lock'

import {
	getViewportWidth
} from '../utility/dom'

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
	const previousButton = useRef()
	const nextButton = useRef()
	const closeButton = useRef()

	let { thumbnailImage } = props
	if (thumbnailImage) {
		if (thumbnailImage.tagName.toLowerCase() !== 'img') {
			thumbnailImage = thumbnailImage.querySelector('img')
		}
	}

	const slide = props.children[props.i]

	const canAnimateScaleOpenClose =
		slide.type === 'picture' &&
		// Don't animate opening animated GIFs
		// because they can't be paused until they're expanded.
		// Considering that "scale" animation fades between
		// the enlarged preview and the original image
		// it could result in minor visual inconsistencies.
		slide.picture.type !== 'image/gif' &&
		thumbnailImage ? true : false

	const animateOpenCloseScale = useRef(canAnimateScaleOpenClose && props.animateOpenCloseScale)
	const overlayOpacity = useRef(
		props.mode === 'flow' && typeof props.overlayOpacityFlowMode !== undefined ?
		props.overlayOpacityFlowMode :
		props.overlayOpacity
	)
	const animateOpenClose = useRef(props.animateOpenClose)

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
			if (direction === 'next' && nextButton.current) {
				return nextButton.current.focus()
			} else if (direction === 'previous' && previousButton.current) {
				return previousButton.current.focus()
			} else if (direction === 'previous' && nextButton.current) {
				return nextButton.current.focus()
			} else if (closeButton.current) {
				// Close button is not rendered in inline mode, for example.
				return closeButton.current.focus()
			}
		}
		return container.current.focus()
	}, [])

	// Execute only once.
	useMemo(() => {
		const {
			animateOpenCloseSmallScreen,
			animateOpenCloseScaleSmallScreen,
			smallScreenMaxWidth,
			overlayOpacitySmallScreen
		} = props
		if (typeof window !== 'undefined' && smallScreenMaxWidth !== undefined) {
			if (getViewportWidth() <= smallScreenMaxWidth) {
				if (!animateOpenCloseScale.current && animateOpenCloseScaleSmallScreen && canAnimateScaleOpenClose) {
					animateOpenCloseScale.current = true
				}
				if (overlayOpacitySmallScreen !== undefined) {
					overlayOpacity.current = overlayOpacitySmallScreen
				}
				if (!animateOpenClose.current && animateOpenCloseSmallScreen) {
					animateOpenClose.current = true
				}
			}
		}
	}, [])

	const slideshow = useMemo(() => {
		return new Slideshow({
			...props,
			overlayOpacity: overlayOpacity.current,
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

	const animateOpen = animateOpenClose.current
	const animateClose = animateOpenClose.current || props.animateOpenCloseOnPanOut

	const [openingAnimationDuration, setOpeningAnimationDuration] = useState()
	const [hasStartedOpening, setHasStartedOpening] = useState(animateOpen ? false : true)
	const [hasFinishedOpening, setHasFinishedOpening] = useState(animateOpen ? false : true)

	const [closingAnimationDuration, setClosingAnimationDuration] = useState()
	const [hasStartedClosing, setHasStartedClosing] = useState(animateClose ? false : true)
	const [hasFinishedClosing, setHasFinishedClosing] = useState(animateClose ? false : true)

	// All pictures (including animated GIFs) are opened above their thumbnails.
	const shouldOffsetSlide = useRef(thumbnailImage && slide.type === 'picture')
	const [slideOffsetIndex, setSlideOffsetIndex] = useState(shouldOffsetSlide.current ? props.i : undefined)
	const [slideOffsetX, setSlideOffsetX] = useState(0)
	const [slideOffsetY, setSlideOffsetY] = useState(0)
	const [hasBeenMeasured, setHasBeenMeasured] = useState(props.inline ? false : true)
	// const animatesOpenClose = useMemo(() => thumbnailImage !== undefined, [])
	// const clearThumbnailImageOverlay = useRef()

	// Uses `useLayoutEffect()` instead of `useEffect()`
	// because it manipulates DOM Elements (animation).
	useLayoutEffect(() => {
		if (!hasBeenMeasured) {
			return
		}
		slideshow.unlock()
		const getSlideDOMNode = () => {
			return currentSlideContainerRef.current.firstChild
		}
		function applySlideOffset() {
			shouldOffsetSlide.current = true
			slideshow.onSlideChange(() => {
				if (shouldOffsetSlide.current) {
					shouldOffsetSlide.current = false
					setSlideOffsetIndex(undefined)
					setSlideOffsetX(0)
					setSlideOffsetY(0)
				}
			})
			return slideshow.hoverPicture.onOpen(getSlideDOMNode(), {
				thumbnailImage,
				// Not using `useState()` for `shouldOffsetSlide`
				// because the updated state value wouldn't be accessible
				// from within the Slideshow.
				getShouldOffsetSlide: () => shouldOffsetSlide.current,
				setSlideOffset: (x, y) => {
					setSlideOffsetX(x)
					setSlideOffsetY(y)
				}
			})
		}
		const shouldOffsetInitialSlide = slide.type === 'picture'
		if (animateOpen || animateClose) {
			let slideOffsetX
			let slideOffsetY
			if (shouldOffsetInitialSlide && thumbnailImage) {
				const result = applySlideOffset()
				slideOffsetX = result[0]
				slideOffsetY = result[1]
			}
			let _promise = Promise.resolve()
			if (animateOpen) {
				const transition = animateOpenCloseScale.current ? slideshow.scaleOpenCloseTransition : slideshow.openCloseTransition
				const {
					animationDuration,
					promise
				} = transition.onOpen(
					getSlideDOMNode(),
					{ thumbnailImage, slideOffsetX, slideOffsetY }
				)
				setOpeningAnimationDuration(animationDuration)
				setHasStartedOpening(true)
				slideshow.lock()
				_promise = promise.then(() => {
					setHasFinishedOpening(true)
					slideshow.unlock()
				})
			}
			_promise.then(() => {
				slideshow.onCloseAnimation(({ interaction }) => {
					let transition
					let slideImage = getSlideDOMNode().querySelector('img')
					if (animateOpenCloseScale.current) {
						// Sometimes for some reason the slide shows "image loading error",
						// in which case there's no `<img/>` element inside it.
						if (shouldOffsetSlide.current) {
							transition = slideshow.scaleOpenCloseTransition
						} else {
							// Fall back to the default open/close transition
							// if the original slide has already been changed.
							transition = slideshow.openCloseTransition
						}
					} else {
						if (animateOpenClose.current || (props.animateOpenCloseOnPanOut && interaction === 'pan')) {
							transition = slideshow.openCloseTransition
						}
					}
					if (!transition) {
						return
					}
					setHasStartedClosing(true)
					const {
						animationDuration,
						promise
					} = transition.onClose(
						getSlideDOMNode(),
						{ thumbnailImage, slideImage }
					)
					setClosingAnimationDuration(animationDuration)
					promise.then(() => setHasFinishedClosing(true))
					return {
						animationDuration,
						promise
					}
				})
			})
		}
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
		slideshow.onSlideChange(() => {
			setSlideOffsetIndex(undefined)
		})
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

	return render.call(
		// this.
		slideshow,
		props,
		overlayOpacity.current,
		animateOpen,
		animateClose,
		slideshowState,
		hasBeenMeasured,
		hasStartedOpening,
		hasFinishedOpening,
		openingAnimationDuration,
		hasStartedClosing,
		hasFinishedClosing,
		closingAnimationDuration,
		slideOffsetX,
		slideOffsetY,
		slideOffsetIndex,
		// refs.
		container,
		slidesRef,
		currentSlideRef,
		currentSlideContainerRef,
		previousButton,
		nextButton,
		closeButton
	)
}

function render(
	props,
	overlayOpacity,
	animateOpen,
	animateClose,
	slideshowState,
	hasBeenMeasured,
	hasStartedOpening,
	hasFinishedOpening,
	openingAnimationDuration,
	hasStartedClosing,
	hasFinishedClosing,
	closingAnimationDuration,
	slideOffsetX,
	slideOffsetY,
	slideOffsetIndex,
	// refs.
	container,
	slidesRef,
	currentSlideRef,
	currentSlideContainerRef,
	previousButton,
	nextButton,
	closeButton
) {
	const {
		inline,
		mode,
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
		showMoreControls
	} = slideshowState

	// `react-focus-lock` doesn't focus `<video/>` when cycling the Tab key.
	// https://github.com/theKashey/react-focus-lock/issues/61

	// Safari doesn't support pointer events.
	// https://caniuse.com/#feat=pointer
	// https://webkit.org/status/#?search=pointer%20events
	// onPointerDown={this.onPointerDown}
	// onPointerUp={this.onPointerUp}
	// onPointerMove={this.onPointerMove}
	// onPointerOut={this.onPointerOut}

	// React doesn't support setting up non-passive listeners.
	// https://github.com/facebook/react/issues/14856
	// onTouchMove={this.onTouchMove}
	// onWheel={this.onWheel}>

	// `tabIndex={ -1 }` makes the `<div/>` focusable.
	return (
		<FocusLock
			returnFocus={FOCUS_OPTIONS}
			autoFocus={false}>
			<div
				ref={container}
				tabIndex={-1}
				style={inline ? undefined : {
					// paddingRight: this.containerPaddingRight,
					// transitionDuration: this.getOverlayTransitionDuration(),
					// `this.props.overlayOpacity` is the default overlay opacity
					// and doesn't reflect the current overlay opacity.
					// Overlay opacity only changes when user swipes up/down
					// or left on the first slide or right on the last slide,
					// and slides get re-rendered only on `this.setState()`
					// which doesn't interfere with the opacity change.
					backgroundColor: this.getOverlayBackgroundColor(
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
					'rrui__slideshow--panning': this.isActuallyPanning
				})}
				onKeyDown={this.onKeyDown}
				onDragStart={this.onDragStart}
				onTouchStart={this.onTouchStart}
				onTouchEnd={this.onTouchEnd}
				onTouchCancel={this.onTouchCancel}
				onMouseDown={this.onPointerDown}
				onMouseUp={this.onPointerUp}
				onMouseMove={this.onPointerMove}
				onMouseLeave={this.onPointerOut}
				onClick={this.onBackgroundClick}>
				<div style={{ position: 'relative', width: '100%', height: '100%' }}>
					<ul
						ref={slidesRef}
						style={{
							// `will-change` performs the costly "Composite Layers"
							// operation at mount instead of when navigating through slides.
							// Otherwise that "Composite Layers" operation would take about
							// 30ms a couple of times sequentially causing a visual lag.
							willChange: 'transform',
							// transitionDuration: hasBeenMeasured ? this.getSlideRollTransitionDuration() : undefined,
							transform: hasBeenMeasured ? this.getSlideRollTransform() : undefined,
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
								{slidesShown[j] && this.getPluginForSlide(slide) &&
									this.getPluginForSlide(slide).render({
										slide,
										ref: i === j ? currentSlideRef : undefined,
										tabIndex: i === j ? 0 : -1,
										isCurrentSlide: i === j,
										autoPlay: slideIndexAtWhichTheSlideshowIsBeingOpened === j,
										mode,
										// `scale` is passed as `pixelRatioMultiplier` to `<Picture/>`.
										scale: this.getSlideScale(j),
										onClick: this.onSlideClick,
										maxWidth: this.getMaxSlideWidth(),
										maxHeight: this.getMaxSlideHeight(),
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
											// transform: this.getSlideScale(j) === 1 ? undefined : `scale(${this.getSlideScale(j)})`
											transform: slideOffsetIndex === j ? `translateX(${slideOffsetX}px) translateY(${slideOffsetY}px)` : undefined,
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
										// shouldUpscaleSmallSlides: this.shouldUpscaleSmallSlides()
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
						renderControls.call(
							this,
							slides,
							i,
							messages,
							showScaleButtons,
							showMoreControls,
							closeButton,
							previousButton,
							nextButton,
							highContrastControls
						)
					}
				</div>
			</div>
		</FocusLock>
	)
}

function renderControls(
	slides,
	i,
	messages,
	showScaleButtons,
	showMoreControls,
	closeButton,
	previousButton,
	nextButton,
	highContrastControls
) {
	const LeftArrowCounterForm = highContrastControls ? LeftArrowCounterformThickStroke : LeftArrowCounterform
	const RightArrowCounterForm = highContrastControls ? RightArrowCounterformThickStroke : RightArrowCounterform
	const CloseCounterForm = highContrastControls ? CloseCounterformThickStroke : CloseCounterform
	const EllipsisVerticalCounterForm = highContrastControls ? EllipsisVerticalCounterformThickStroke : EllipsisVerticalCounterform
	return (
		<React.Fragment>
			<ul className="rrui__slideshow__actions">
				{this.shouldShowMoreControls() && this.shouldShowScaleButtons() &&
					<li className={classNames('rrui__slideshow__action-item', {
						'rrui__slideshow__action-group': showScaleButtons
					})}>
						{showScaleButtons &&
							<button
								type="button"
								title={messages.actions.scaleDown}
								onClick={this.onScaleDown}
								className="rrui__button-reset rrui__slideshow__action">
								<Minus className="rrui__slideshow__action-icon"/>
							</button>
						}
						<button
							type="button"
							title={messages.actions.scaleReset}
							onClick={this.onScaleToggle}
							className="rrui__button-reset rrui__slideshow__action">
							<ScaleFrame className="rrui__slideshow__action-icon"/>
						</button>
						{showScaleButtons &&
							<button
								type="button"
								title={messages.actions.scaleUp}
								onClick={this.onScaleUp}
								className="rrui__button-reset rrui__slideshow__action">
								<Plus className="rrui__slideshow__action-icon"/>
							</button>
						}
					</li>
				}

				{this.shouldShowMoreControls() && this.shouldShowOpenExternalLinkButton() &&
					<li className="rrui__slideshow__action-item">
						<a
							target="_blank"
							title={messages.actions.openExternalLink}
							onKeyDown={clickTheLinkOnSpacebar}
							href={this.getPluginForSlide().getExternalLink(this.getCurrentSlide())}
							className="rrui__slideshow__action rrui__slideshow__action--link">
							<ExternalIcon className="rrui__slideshow__action-icon"/>
						</a>
					</li>
				}

				{/*this.shouldShowMoreControls() && this.shouldShowDownloadButton() &&
					<li className="rrui__slideshow__action-item">
						<a
							download
							target="_blank"
							title={messages.actions.download}
							onKeyDown={clickTheLinkOnSpacebar}
							href={this.getPluginForSlide().getDownloadUrl(this.getCurrentSlide())}
							className="rrui__slideshow__action rrui__slideshow__action--link">
							<Download className="rrui__slideshow__action-icon"/>
						</a>
					</li>
				*/}

				{this.shouldShowMoreControls() && this.getOtherActions().map(({ name, icon: Icon, link, action }) => {
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
										if (!this.slideshow.isLocked()) {
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
				{!this.shouldShowMoreControls() && this.hasHidableControls() && this.shouldShowShowMoreControlsButton() &&
					<li className="rrui__slideshow__action-item rrui__slideshow__action-item--toggle-controls">
						<button
							type="button"
							title={showMoreControls ? messages.actions.hideControls : messages.actions.showControls}
							onClick={this.onShowMoreControls}
							className={classNames('rrui__button-reset', 'rrui__slideshow__action', 'rrui__slideshow__action--counterform', {
								'rrui__slideshow__action--toggled': showMoreControls
							})}>
							<EllipsisVerticalCounterForm className="rrui__slideshow__action-icon"/>
						</button>
					</li>
				}

				{this.shouldShowCloseButton() &&
					<li className="rrui__slideshow__action-item rrui__slideshow__action-item--close">
						<button
							ref={closeButton}
							type="button"
							title={messages.actions.close}
							onClick={this.onClose}
							className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action--counterform">
							<CloseCounterForm className="rrui__slideshow__action-icon"/>
						</button>
					</li>
				}
			</ul>

			{slides.length > 1 && i > 0 && this.shouldShowPreviousNextButtons() &&
				<button
					ref={previousButton}
					type="button"
					title={messages.actions.previous}
					onClick={this.onShowPrevious}
					className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action--counterform rrui__slideshow__previous">
					<LeftArrowCounterForm className="rrui__slideshow__action-icon"/>
				</button>
			}

			{slides.length > 1 && i < slides.length - 1 && this.shouldShowPreviousNextButtons() &&
				<button
					ref={nextButton}
					type="button"
					title={messages.actions.next}
					onClick={this.onShowNext}
					className="rrui__button-reset rrui__slideshow__action rrui__slideshow__action rrui__slideshow__action--counterform rrui__slideshow__next">
					<RightArrowCounterForm className="rrui__slideshow__action-icon"/>
				</button>
			}

			{slides.length > 1 &&
				<div className="rrui__slideshow__progress rrui__slideshow__controls-center rrui__slideshow__controls-bottom">
					<SlideshowProgress
						i={i}
						count={slides.length}
						isDisabled={this.isLocked}
						onShowSlide={this.showSlide}
						onShowNextSlide={this.showNext}
						highContrast={highContrastControls}/>
				</div>
			}
		</React.Fragment>
	)
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