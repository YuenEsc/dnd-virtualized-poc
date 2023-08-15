import { useSortable } from "@dnd-kit/sortable"
import { Item } from "./Item"
import React, { memo, useEffect, useState } from "react"

function SortableItem({
  disabled,
  id,
  index,
  handle,
  renderItem,
  style,
  containerId,
  getIndex,
  useDragOverlay,
  wrapperStyle,
}) {
  const {
    active,
    attributes,
    isDragging,
    isSorting,
    listeners,
    overIndex,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    over,
  } = useSortable({
    id,
  })
  const mounted = useMountStatus()
  const mountedWhileDragging = isDragging && !mounted

  return (
    <Item
      ref={disabled ? undefined : setNodeRef}
      value={id}
      dragging={isDragging}
      sorting={isSorting}
      handle={handle}
      handleProps={handle ? { ref: setActivatorNodeRef } : undefined}
      index={index}
      wrapperStyle={wrapperStyle?.({ index, isDragging, active, id })}
      style={style({
        index,
        value: id,
        isDragging,
        isSorting,
        overIndex: over ? getIndex(over.id) : overIndex,
        containerId,
      })}
      color={getColor(id)}
      transition={transition}
      transform={transform}
      fadeIn={mountedWhileDragging}
      listeners={listeners}
      renderItem={renderItem}
      dragOverlay={!useDragOverlay && isDragging}
      disabled={disabled}
      data-index={index}
      data-id={id}
      {...attributes}
    />
  )
}

export default memo(SortableItem)

function useMountStatus() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    const timeout = setTimeout(() => setIsMounted(true), 500)

    return () => clearTimeout(timeout)
  }, [])

  return isMounted
}

function getColor(id) {
  switch (String(id)[0]) {
    case "A":
      return "#7193f1"
    case "B":
      return "#ffda6c"
    case "C":
      return "#00bcd4"
    case "D":
      return "#ef769f"
  }

  return undefined
}
