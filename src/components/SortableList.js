import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import PropTypes from 'prop-types'

/**
 * A similar demo:
 * https://codepen.io/bsehovac/pen/zyvger
 * Demo:
 * https://codepen.io/catamphetamine/pen/qBWxEQX
 *
 * `ItemComponent` must accept `dragging: boolean` property.
 */
export default function SortableList({
	value: items,
	onChange,
	component: Component,
	itemComponent: ItemComponent,
	animationDuration,
	animationEasing,
	...rest
}) {
	const list = useRef()
	const [dragging, setDragging] = useState()
	const [willEndDragging, setWillEndDragging] = useState()
	const [initialItems, _] = useState(items)
	const [itemsOrder, setItemsOrder] = useState(items.map((item, i) => i))
	const touchId = useRef()
	const dragMoveHandler = useRef()
	const draggedItemPosition = useRef()
	const itemShiftsY = useRef()

	useEffect(() => {
		// Don't know why is this here.
		const onTouchMove = () => {}
		window.addEventListener('touchmove', onTouchMove)
		return () => {
			window.removeEventListener('touchmove', onTouchMove)
		}
	}, [])

	const onDragStart = useCallback((node, y, touch) => {
		if (dragging) {
			return
		}
		// The list requires at least two items in order to be sortable.
		if (items.length === 1) {
			return
		}
		const item = getItem(list.current, node)
		if (!item) {
			return
		}
		const [itemNode, position] = item
		setDragging({
			touch,
			initialPosition: position,
			// Using `.getBoundingClientRect()` instead of `.offsetHeight`/`.offsetTop`
			// because `.offsetXxx` values don't know how to work with fractional pixels.
			// Fractional pixels (for example, `0.5`) are used on "retina" screens.
			itemHeights: Array.prototype.map.call(list.current.childNodes, node => node.getBoundingClientRect().height),
			itemSpacing: list.current.childNodes[1].getBoundingClientRect().top - list.current.childNodes[0].getBoundingClientRect().bottom,
			itemTopOffset: itemNode.getBoundingClientRect().top - list.current.childNodes[0].getBoundingClientRect().top,
			dragStartY: y
		})
		draggedItemPosition.current = {
			previous: position,
			new: position,
			shiftY: 0
		}
		itemShiftsY.current = items.map(_ => 0)
	}, [dragging])

	const onMouseDown = useCallback((event) => {
		// Left mouse button only.
		if (event.button !== 0) {
			return
		}
		onDragStart(event.target, event.pageY)
	}, [onDragStart])

	const onTouchStart = useCallback((event) => {
		// Single touch only.
		if (event.touches.length > 1) {
			return
		}
		const touch = event.changedTouches[0]
		onDragStart(event.target, touch.pageY, touch.identifier)
	}, [onDragStart])

	const onDragMove = useCallback((event) => {
		if (!dragging) {
			return
		}

		let y
		if (dragging.touch !== undefined) {
			for (const touch of event.changedTouches) {
				if (touch.identifier === dragging.touch) {
					y = touch.pageY
					break
				}
			}
		} else {
			y = event.pageY
		}

		if (y === undefined) {
			return
		}

		event.preventDefault()

		const movedY = y - dragging.dragStartY
		const draggedItemOffsetTop = dragging.itemTopOffset + movedY

		const position = getDraggedItemPosition(
			dragging.itemHeights,
			dragging.itemSpacing,
			draggedItemOffsetTop,
			dragging.initialPosition
		)

		const draggedItemHeight = dragging.itemHeights[dragging.initialPosition]

		// Update list items' positions.
		itemShiftsY.current = items.map((_, j) => {
			if (j < dragging.initialPosition) {
				if (j >= position) {
					return draggedItemHeight + dragging.itemSpacing
				} else {
					return 0
				}
			} else if (j > dragging.initialPosition) {
				if (j <= position) {
					return -1 * (draggedItemHeight + dragging.itemSpacing)
				} else {
					return 0
				}
			} else {
				return movedY
			}
		})

		// Apply item shifts Y.
		let i = 0
		while (i < items.length) {
			list.current.childNodes[i].style.transform = `translateY(${itemShiftsY.current[i]}px)`
			i++
		}

		draggedItemPosition.current = {
			previous: dragging.initialPosition,
			new: position,
			shiftY: getDraggedItemPositionY(
				dragging.itemHeights,
				dragging.itemSpacing,
				dragging.initialPosition,
				position
			) - getDraggedItemPositionY(
				dragging.itemHeights,
				dragging.itemSpacing,
				dragging.initialPosition,
				dragging.initialPosition
			)
		}
	}, [dragging])

	const onDragEnd = useCallback(() => {
		setDragging()
		setWillEndDragging(true)
		const newItemsOrder = getNewItemsOrder(
			itemsOrder,
			draggedItemPosition.current.previous,
			draggedItemPosition.current.new
		)
		setTimeout(() => {
			setWillEndDragging(false)
			setItemsOrder(newItemsOrder)
			onChange(newItemsOrder.map(i => initialItems[i]))
		}, animationDuration)
	}, [itemsOrder])

	const onMouseUp = useCallback((event) => {
		if (event.which !== 1) {
			return
		}
		onDragEnd()
	}, [onDragEnd])

	const onTouchEnd = useCallback((event) => {
		for (const touch of event.changedTouches) {
			if (touch.identifier === touchId.current) {
				onDragEnd()
				return
			}
		}
	}, [onDragEnd])

	useEffect(() => {
		if (dragging) {
			dragMoveHandler.current = onDragMove
			if (dragging.touch !== undefined) {
				touchId.current = dragging.touch
				window.addEventListener('touchmove', dragMoveHandler.current, { passive: false })
				window.addEventListener('touchend', onTouchEnd)
			} else {
				window.addEventListener('mousemove', dragMoveHandler.current, { passive: false })
				window.addEventListener('mouseup', onMouseUp)
			}
		} else {
			if (touchId.current !== undefined) {
				touchId.current = undefined
				window.removeEventListener('touchmove', dragMoveHandler.current, { passive: false })
				window.removeEventListener('touchend', onTouchEnd)
			} else {
				window.removeEventListener('mousemove', dragMoveHandler.current, { passive: false })
				window.removeEventListener('mouseup', onMouseUp)
			}
			dragMoveHandler.current = undefined
		}
	}, [dragging])

	useEffect(() => {
		if (willEndDragging) {
			// Reset dragged item position.
			list.current.childNodes[draggedItemPosition.current.previous].style.transform = `translateY(${
				draggedItemPosition.current.shiftY
			}px)`
		}
	}, [willEndDragging])

	return (
		<Component
			{...rest}
			ref={list}
			onTouchStart={onTouchStart}
			onMouseDown={onMouseDown}>
			{itemsOrder.map((i, position) => (
				<ItemComponent
					key={i}
					dragging={dragging}
					style={(dragging || willEndDragging) ? getItemStyle(
						position === draggedItemPosition.current.previous,
						itemShiftsY.current[position],
						willEndDragging,
						animationDuration,
						animationEasing
					) : TRANSFORM_NONE}>
					{items[i]}
				</ItemComponent>
			))}
		</Component>
	)
}

SortableList.propTypes = {
	value: PropTypes.arrayOf(PropTypes.any).isRequired,
	onChange: PropTypes.func.isRequired,
	component: PropTypes.elementType.isRequired,
	itemComponent: PropTypes.elementType.isRequired,
	animationDuration: PropTypes.number.isRequired,
	animationEasing: PropTypes.string.isRequired
}

const TRANSFORM_NONE = { transform: 'none' }

function getItemStyle(isDragged, shiftY, willEndDragging, animationDuration, animationEasing) {
	const style = {
		transition: `all ${animationDuration}ms ${animationEasing}`
	}
	if (isDragged) {
		style.zIndex = 1
		if (!willEndDragging) {
			style.transition = undefined
		}
	} else {
		style.transform = `translateY(${shiftY}px)`
	}
	return style
}

const ListComponent = React.forwardRef(({ children, ...rest }, ref) => (
	<div ref={ref} {...rest}>
		{children}
	</div>
))

SortableList.defaultProps = {
	component: ListComponent,
	animationDuration: 200,
	animationEasing: 'ease-out'
}

// Supports "handle" element inside a list item.
function getItem(list, node) {
	let childNode
	while (node) {
		if (node === list) {
			if (childNode) {
				let i = 0
				while (i < node.childNodes.length) {
					if (node.childNodes[i] === childNode) {
						return [childNode, i]
					}
					i++
				}
			}
			break
		}
		childNode = node
		node = node.parentElement
	}
}

function getDraggedItemPosition(itemHeights, itemSpacing, draggedItemOffsetTop, initialPosition) {
	const scanLineY = draggedItemOffsetTop + itemHeights[initialPosition] / 2 + itemSpacing / 2
	let y = 0
	let i = 0
	let subtractOwnPosition = 0
	while (i < itemHeights.length) {
		y += itemHeights[i] + itemSpacing
		if (scanLineY <= y) {
			return i
		}
		i++
	}
	return itemHeights.length - 1
}

function getDraggedItemPositionY(itemHeights, itemSpacing, initialPosition, position) {
	let top = 0
	let j = 0
	while (j < position) {
		if (j === initialPosition) {
			position++
		} else {
			top += itemHeights[j] + itemSpacing
		}
		j++
	}
	return top
}

function getNewItemsOrder(itemsOrder, fromPosition, toPosition) {
	if (toPosition < fromPosition) {
		return itemsOrder.slice(0, toPosition)
			.concat(itemsOrder[fromPosition])
			.concat(itemsOrder.slice(toPosition, fromPosition))
			.concat(itemsOrder.slice(fromPosition + 1))
	}
	if (toPosition > fromPosition) {
		return itemsOrder.slice(0, fromPosition)
			.concat(itemsOrder.slice(fromPosition + 1, toPosition + 1))
			.concat(itemsOrder[fromPosition])
			.concat(itemsOrder.slice(toPosition + 1))
	}
	return itemsOrder.slice()
}