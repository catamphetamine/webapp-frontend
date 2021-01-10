/**
 * Originally based on `long-press-event` by @author John Doherty <www.johndoherty.info>:
 * https://github.com/john-doherty/long-press-event/blob/master/src/long-press-event.js
 * on 17 Aug, 2020.
 *
 * @license MIT
 */

import React, { useCallback, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'

const isTouch = typeof window !== 'undefined' && (
	('ontouchstart' in window) ||
	(navigator.MaxTouchPoints > 0) ||
	(navigator.msMaxTouchPoints > 0)
)

export default function OnLongPress({
	touch,
	delay,
	onLongPress,
	suppressClickEvent,
	maxMoveDistanceX,
	maxMoveDistanceY,
	children
}) {
	// Local timer object based on `requestAnimationFrame()`.
	const timer = useRef(null)

	// Pointer x position when long press started.
	const startX = useRef()
	// Pointer y position when long press started.
	const startY = useRef()
	// // Pointer down event target when long press started.
	// const target = useRef()

	const clearValues = useCallback(() => {
		startX.current = 0
		startY.current = 0
		// target.current = undefined
	}, [])

	clearValues()

	const clearLongPressTimer = useCallback(() => {
		clearRequestTimeout(timer.current)
		timer.current = null
	}, [])

	const onLongPressCancel = useCallback(() => {
		clearValues()
		clearLongPressTimer()
	}, [
		clearValues,
		clearLongPressTimer
	])

	/**
	 * Fires the 'long-press' event on element.
	 * @param {MouseEvent|TouchEvent} originalEvent The original event being fired
	 * @returns {void}
	 */
	const fireLongPressEvent = useCallback(({ clientX, clientY, target }) => {
		// const initialTarget = target.current
		clearValues()

		// Fire the long-press event
		onLongPress({
			clientX,
			clientY,
			target
		})

		if (suppressClickEvent) {
			// Temporarily intercept and clear the next click.
			const clickUpEvent = isTouch ? 'touchend' : 'mouseup'
			document.addEventListener(clickUpEvent, function cancelClickUpEvent(event) {
				document.removeEventListener(clickUpEvent, cancelClickUpEvent, true)
				cancelEvent(event)
			}, true)
		}
	}, [
		clearValues,
		onLongPress,
		suppressClickEvent
	])

	/**
	 * Starts the long press timer.
	 * @param {event} event - event object
	 * @returns {void}
	 */
	const startLongPressTimer = useCallback((event) => {
		// target.current = event.target

		const clientX = isTouch ? event.touches[0].clientX : event.clientX
		const clientY = isTouch ? event.touches[0].clientY : event.clientY
		const target = isTouch ? event.touches[0].target : event.target

		// A new `event` is constructed here.
		// Reusing the original `event` would causes React warning:
		// "Warning: This synthetic event is reused for performance reasons".
		// In React 17, that warning would no longer be present though.
		const _event = {
			clientX,
			clientY,
			target
		}

		timer.current = requestTimeout(
			() => fireLongPressEvent(_event),
			delay
		)
	}, [
		fireLongPressEvent,
		delay
	])

	/**
	 * Starts the timer on mouse down and logs current position.
	 * @param {object} event - browser event object
	 * @returns {void}
	 */
	const onLongPressStart = useCallback((event) => {
		// Shouldn't be already in the process of a "long press".
		// Could happen, for example, when `onMouseDown` is triggered
		// after `onPointerDown`.
		if (timer.current) {
			return
		}
		// if (filterTarget) {
		// 	if (!filterTarget(event.target)) {
		// 		return
		// 	}
		// }
		startX.current = event.clientX
		startY.current = event.clientY
		// target.current = event.target
		startLongPressTimer(event)
	}, [
		startLongPressTimer,
		// filterTarget
	])

	const onMouseDown = useCallback((event) => {
		// Only activates on left mouse button.
		if (event.button === 0) {
			onLongPressStart(event)
		}
	}, [
		onLongPressStart
	])

	const onTouchStart = useCallback((event) => {
		// Ignore multitouch.
		if (event.touches.length > 1) {
			// Reset.
			return onLongPressCancel()
		}
		onLongPressStart(event)
	}, [
		onLongPressStart,
		onLongPressCancel
	])

	/**
	 * If the mouse moves n pixels during long-press, cancel the timer.
	 * @param {object} event - browser event object
	 * @returns {void}
	 */
	const onLongPressMove = useCallback((event) => {
		// Calculate total number of pixels the pointer has moved.
		const diffX = Math.abs(startX.current - event.clientX)
		const diffY = Math.abs(startY.current - event.clientY)

		// If pointer has moved more than allowed,
		// cancel the long-press timer and therefore the event.
		if (diffX >= maxMoveDistanceX || diffY >= maxMoveDistanceY) {
			onLongPressCancel()
		}
	}, [
		maxMoveDistanceX,
		maxMoveDistanceY,
		onLongPressCancel
	])

	useEffect(() => {
		// Hook events that clear a pending long press event.
		// The `capture: true` flag here is so that no element
		// beneath in the DOM tree could possibly `.stopPropagation()`
		// os such events. Not that anyone would do anything like that anyway.
		// But, for example, if there's a scrollable element beneath in the DOM tree,
		// then `wheel` event would reach the top level, but `scroll` event wouldn't.
		// Maybe on mobile devices, where there's no `wheel` event, the `capture: true`
		// flag is required so that there's any event at all when the user scrolls
		// a descendant element.
		// https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
		document.addEventListener('wheel', onLongPressCancel, true)
		document.addEventListener('scroll', onLongPressCancel, true)
		return () => {
			document.removeEventListener('wheel', onLongPressCancel, true)
			document.removeEventListener('scroll', onLongPressCancel, true)
		}
	}, [])

	let handlers
	if (isTouch) {
		handlers = {
			onTouchStart,
			onTouchEnd: onLongPressCancel,
			onTouchMove: onLongPressMove,
			// "Touch cancel" event is triggered, for example, when a touch is moved off-screen.
			// https://alxgbsn.co.uk/2011/12/23/different-ways-to-trigger-touchcancel-in-mobile-browsers/
			onTouchCancel: onLongPressCancel
		}
	} else {
		// Could also support pointer events:
		// https://github.com/john-doherty/long-press-event/issues/19
		handlers = {
			onMouseDown,
			onMouseUp: onLongPressCancel,
			onMouseMove: onLongPressMove,
			onMouseLeave: onLongPressCancel,
			// Safari doesn't support pointer events,
			// so they're duplicated by the mouse events above.
			// https://caniuse.com/#feat=pointer
			// https://webkit.org/status/#?search=pointer%20events
			// Because there're already mouse event listeners,
			// pointer event listeners fire as duplicates of those.
			// `onLongPressStart` handles that by checking if a timer is already running.
			// `onLongPressCancel` operation is also irrelevant of whether
			// a long press is currently in progress or not.
			// `onLongPressMove` operation is also irrelevant of whether it's called
			// with the same coordinates twice.
			onPointerDown: onLongPressStart,
			onPointerUp: onLongPressCancel,
			onPointerMove: onLongPressMove,
			// `PointerOut` event is fired for several reasons including:
			// * Pointer is moved out of the hit test boundaries of an element.
			// * Firing the pointerup event for a device that does not support hover.
			// * After firing the `pointercancel` event.
			// * When a pen stylus leaves the hover range detectable by the digitizer.
			onPointerOut: onLongPressCancel
		}
	}

	handlers.onDragStart = onLongPressCancel

	React.Children.only(children)

	if (touch && !isTouch) {
		return children
	}

	return React.cloneElement(children, handlers)
}

OnLongPress.propTypes = {
	/**
	 * Pass `true` to only handle touch events.
	 * @type {number}
	 */
	touch: PropTypes.bool,

	/**
	 * The duration a user has to "press" in order for a long press event to get triggered.
	 * @type {number}
	 */
	delay: PropTypes.number.isRequired,

	/**
	 * The handler function that gets called on long press.
	 * The `event` argument is passed: `{ clientX, clientY, target }`.
	 * @type {function}
	 */
	onLongPress: PropTypes.func.isRequired,

	/**
	 * If `true`, will suppress the `click` event on long press.
	 * @type {boolean}
	 */
	suppressClickEvent: PropTypes.bool,

	/**
	 * Maximum number of X pixels the mouse can move during long press before it is canceled.
	 * @type {number}
	 */
	maxMoveDistanceX: PropTypes.number.isRequired,

	/**
	 * Maximum number of Y pixels the mouse can move during long press before it is canceled.
	 * @type {number}
	 */
	maxMoveDistanceY: PropTypes.number.isRequired,

	/**
	 * The wrapped element that will be listening to "long press" events.
	 */
	children: PropTypes.node.isRequired
}

OnLongPress.defaultProps = {
	delay: 400,
	maxMoveDistanceX: 10,
	maxMoveDistanceY: 10
}

/**
* Cancels the current event
* @param {object} event - browser event object
* @returns {void}
*/
function cancelEvent(event) {
	event.stopImmediatePropagation()
	event.preventDefault()
	event.stopPropagation()
}

/**
 * Behaves the same as setTimeout except uses requestAnimationFrame() where possible for better performance.
 * @param {function} fn The callback function.
 * @param {number} delay The delay in milliseconds.
 * @returns {object} result.
 */
function requestTimeout(fn, delay) {
	if (!window.requestAnimationFrame && !window.webkitRequestAnimationFrame &&
		!(window.mozRequestAnimationFrame && window.mozCancelRequestAnimationFrame) && // Firefox 5 ships without cancel support
		!window.oRequestAnimationFrame && !window.msRequestAnimationFrame) {
		return window.setTimeout(fn, delay)
	}

	// `requestAnimationFrame()` shim by Paul Irish.
	const requestAnimFrame = window.requestAnimationFrame ||
		window.webkitRequestAnimationFrame ||
		window.mozRequestAnimationFrame ||
		window.oRequestAnimationFrame ||
		window.msRequestAnimationFrame
		// || (callback) => window.setTimeout(callback, 1000 / 60)

	const result = {}
	const startedAt = Date.now()
	function loop() {
		if (Date.now() - startedAt >= delay) {
			fn.call()
		} else {
			result.value = requestAnimFrame(loop)
		}
	}

	result.value = requestAnimFrame(loop)
	return result
}

/**
 * Behaves the same as clearTimeout except uses cancelRequestAnimationFrame() where possible for better performance.
 * @param {object} result — `requestTimeout()` result.
 * @returns {void}
 */
function clearRequestTimeout(result) {
	if (result) {
		window.cancelAnimationFrame ? window.cancelAnimationFrame(result.value) :
		window.webkitCancelAnimationFrame ? window.webkitCancelAnimationFrame(result.value) :
		window.webkitCancelRequestAnimationFrame ? window.webkitCancelRequestAnimationFrame(result.value) : /* Support for legacy API */
		window.mozCancelRequestAnimationFrame ? window.mozCancelRequestAnimationFrame(result.value) :
		window.oCancelRequestAnimationFrame	? window.oCancelRequestAnimationFrame(result.value) :
		window.msCancelRequestAnimationFrame ? window.msCancelRequestAnimationFrame(result.value) :
		clearTimeout(result);
	}
}