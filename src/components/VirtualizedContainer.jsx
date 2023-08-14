import React, { useCallback, useEffect, useMemo, useRef } from "react"
import PropTypes from "prop-types"
import { Wrapper } from "./Wrapper"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import VirtualList from "react-tiny-virtual-list"
import styles from "./Virtualized.module.css"
import DroppableContainer from "./DroppableContainer"
import SortableItem from "./SortableItem"

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
    if (activeId && containerId) {
      const index = items[containerId].indexOf(activeId)
      return index !== -1 ? [index] : []
    }
    return []
  }, [activeId, containerId, items])

  const renderRow = useCallback(({ index, style }) => {
    const id = items[containerId][index]
    return (
      <SortableItem
        key={`${containerId}-${id}-sortable-item`}
        id={id}
        index={index}
        handle={handle}
        wrapperStyle={() => ({
          ...style,
        })}
        style={getItemStyles}
        disabled={isSortingContainer}
        renderItem={renderItem}
        containerId={containerId}
        getIndex={getIndex}
        useDragOverlay
      />
    )
  })

  useEffect(() => {
    if (virtualListRef) {
      virtualListRef?.current?.recomputeSizes()
    }
  }, [stickyIndices, containerId, lastOverId, activeId])

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
        <VirtualList
          ref={(node) => (virtualListRef.current = node)}
          width={375}
          height={600}
          className={styles.VirtualList}
          itemCount={itemCount}
          itemSize={62}
          stickyIndices={stickyIndices}
          renderItem={renderRow}
        />
      </SortableContext>
    </DroppableContainer>
  )
}

VirtualizedContainer.propTypes = {}

export default VirtualizedContainer
