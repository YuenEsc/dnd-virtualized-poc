import React, { useMemo, useRef } from "react"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import DroppableContainer from "./DroppableContainer"
import SortableItem from "./SortableItem"
import useVirtual from "react-cool-virtual"

const VirtualizedContainer = ({
  containerStyle,
  handleRemove,
  containerId,
  items,
  handle,
  getIndex,
  getItemStyles,
  isSortingContainer,
  activeId,
  minimal,
  columns,
  scrollable,
  strategy,
  renderItem,
  lastOverId,
}) => {
  const virtualListRef = useRef()
  const itemCount = items[containerId].length

  const stickyIndices = useMemo(() => {
    if (activeId) {
      const index = items[containerId].indexOf(activeId)
      return index !== -1 ? [index] : []
    }
    return []
  }, [activeId, containerId, items[containerId]])

  if (Array.isArray(stickyIndices) && stickyIndices.length !== 0) {
  }

  const {
    outerRef,
    innerRef,
    items: virtualizedItems,
  } = useVirtual({
    itemCount,
    itemSize: 62,
    stickyIndices, // The values must be provided in ascending order,
    scrollEasingFunction: () => 0,
  })

  return (
    <DroppableContainer
      key={`${containerId}-droppable-container`}
      id={containerId}
      label={minimal ? undefined : `Column ${containerId}`}
      columns={columns}
      items={items[containerId]}
      scrollable={scrollable}
      style={containerStyle}
      unstyled={minimal}
      onRemove={() => handleRemove(containerId)}
    >
      <SortableContext
        items={items[containerId]}
        strategy={verticalListSortingStrategy}
      >
        <div
          style={{ width: "348px", height: "600px", overflowY: "scroll" }}
          ref={outerRef}
        >
          <div ref={innerRef}>
            {virtualizedItems.map((virtualizedItem) => {
              const { index, size, start, isSticky } = virtualizedItem
              const id = items[containerId][index]
              let style = { height: `${size}px` }
              // Use the `isSticky` property to style the sticky item, that's it ✨
              style = isSticky
                ? {
                    ...style,
                    position: "sticky",
                    top: "0",
                    bottom: "0",
                  }
                : style

              return (
                <div
                  key={`${containerId}-${id}-draggable-item-${isSticky}-sticky`}
                  style={style}
                >
                  <SortableItem
                    id={id}
                    index={index}
                    handle={handle}
                    wrapperStyle={() => ({
                      height: `${size}px`,
                    })}
                    style={getItemStyles}
                    disabled={isSortingContainer}
                    renderItem={renderItem}
                    containerId={containerId}
                    getIndex={getIndex}
                    useDragOverlay
                  />
                </div>
              )
            })}
          </div>
        </div>
      </SortableContext>
    </DroppableContainer>
  )
}

VirtualizedContainer.propTypes = {}

export default VirtualizedContainer
