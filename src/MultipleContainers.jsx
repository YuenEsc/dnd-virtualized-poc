import React, { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useDroppable,
  useSensors,
  useSensor,
  MeasuringStrategy,
  defaultDropAnimationSideEffects,
} from "@dnd-kit/core"
import { arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { coordinateGetter as multipleContainersCoordinateGetter } from "./multipleContainersKeyboardCoordinates"

import { createRange } from "./utils/route"
import { Item } from "./components/Item"
import VirtualizedContainer from "./components/VirtualizedContainer"
import DroppableContainer from "./components/DroppableContainer"
import { useCollisionDetectionStrategy } from "./useCollisionDetectionStrategy"

const dropAnimation = {
  sideEffects: defaultDropAnimationSideEffects({
    styles: {
      active: {
        opacity: "0.5",
      },
    },
  }),
}

export const TRASH_ID = "void"
const PLACEHOLDER_ID = "placeholder"
const empty = []

export function MultipleContainers({
  itemCount = 500,
  columns,
  handle = false,
  items: initialItems,
  containerStyle,
  coordinateGetter = multipleContainersCoordinateGetter,
  getItemStyles = () => ({}),
  wrapperStyle = () => ({}),
  minimal = false,
  modifiers,
  renderItem,
  strategy = verticalListSortingStrategy,
  trashable = false,
  vertical = false,
  scrollable,
}) {
  const [items, setItems] = useState(
    () =>
      initialItems ?? {
        A: createRange(itemCount, (index) => `A${index + 1}`),
        B: createRange(itemCount, (index) => `B${index + 1}`),
        C: createRange(itemCount, (index) => `C${index + 1}`),
        D: createRange(itemCount, (index) => `D${index + 1}`),
      },
  )
  const [containers, setContainers] = useState(Object.keys(items))
  const [activeId, setActiveId] = useState(null)
  const [overId, setOverId] = useState(null)
  const lastOverId = useRef(null)
  const recentlyMovedToNewContainer = useRef(false)
  const isSortingContainer = activeId ? containers.includes(activeId) : false

  const cancelDrop = async ({ active, over }) => {
    return true
  }

  /**
   * Custom collision detection strategy optimized for multiple containers
   *
   * - First, find any droppable containers intersecting with the pointer.
   * - If there are none, find intersecting containers with the active draggable.
   * - If there are no intersecting containers, return the last matched intersection
   *
   */
  const collisionDetectionStrategy = useCollisionDetectionStrategy({
    activeId,
    items,
    lastOverId,
    recentlyMovedToNewContainer,
  })
  const [clonedItems, setClonedItems] = useState(null)
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter,
    }),
  )
  const findContainer = (id) => {
    if (id in items) {
      return id
    }

    return Object.keys(items).find((key) => items[key].includes(id))
  }

  const getIndex = (id) => {
    const container = findContainer(id)

    if (!container) {
      return -1
    }

    const index = items[container].indexOf(id)
    return index
  }

  const onDragCancel = () => {
    if (clonedItems) {
      // Reset items to their original state in case items have been
      // Dragged across containers
      setItems(clonedItems)
    }

    setActiveId(null)
    setClonedItems(null)
  }

  const onDragStart = ({ active }) => {
    setActiveId(active.id)
    setClonedItems(items)
  }

  const onDragOver = ({ active, over }) => {
    const overId = over?.id

    if (overId == null || active.id in items) {
      return
    }

    const overContainer = findContainer(overId)
    const activeContainer = findContainer(active.id)

    if (!overContainer || !activeContainer) {
      return
    }

    if (activeContainer !== overContainer) {
      setItems((items) => {
        const activeItems = items[activeContainer]
        const overItems = items[overContainer]
        const overIndex = overItems.indexOf(overId)
        const activeIndex = activeItems.indexOf(active.id)
        if (activeIndex === -1) return items
        let newIndex

        if (overId in items) {
          newIndex = overItems.length + 1
        } else {
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height

          const modifier = isBelowOverItem ? 1 : 0
          newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1
        }

        recentlyMovedToNewContainer.current = true

        return {
          ...items,
          [activeContainer]: items[activeContainer].filter(
            (item) => item !== active.id,
          ),
          [overContainer]: [
            ...items[overContainer].slice(0, newIndex),
            items[activeContainer][activeIndex],
            ...items[overContainer].slice(newIndex, items[overContainer].length),
          ],
        }
      })
    }
  }

  const onDragEnd = ({ active, over }) => {
    if (active.id in items && over?.id) {
      setContainers((containers) => {
        const activeIndex = containers.indexOf(active.id)
        const overIndex = containers.indexOf(over.id)

        return arrayMove(containers, activeIndex, overIndex)
      })
    }

    const activeContainer = findContainer(active.id)

    if (!activeContainer) {
      setActiveId(null)
      return
    }

    const overId = over?.id

    if (overId == null) {
      setActiveId(null)
      return
    }

    if (overId === TRASH_ID) {
      setItems((items) => ({
        ...items,
        [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
      }))
      setActiveId(null)
      return
    }

    if (overId === PLACEHOLDER_ID) {
      const newContainerId = getNextContainerId()

      setContainers((containers) => [...containers, newContainerId])
      setItems((items) => ({
        ...items,
        [activeContainer]: items[activeContainer].filter((id) => id !== activeId),
        [newContainerId]: [active.id],
      }))
      setActiveId(null)
      return
    }

    const overContainer = findContainer(overId)

    if (overContainer) {
      const activeIndex = items[activeContainer].indexOf(active.id)
      const overIndex = items[overContainer].indexOf(overId)

      if (activeIndex !== overIndex) {
        setItems((items) => ({
          ...items,
          [overContainer]: arrayMove(items[overContainer], activeIndex, overIndex),
        }))
      }
    }

    setActiveId(null)
  }

  useEffect(() => {
    requestAnimationFrame(() => {
      recentlyMovedToNewContainer.current = false
    })
  }, [items])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={collisionDetectionStrategy}
      measuring={{
        droppable: {
          strategy: MeasuringStrategy.WhileDragging,
        },
      }}
      cancelDrop={({ over, active }) => {}}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragEnd={onDragEnd}
      onDragCancel={onDragCancel}
      modifiers={modifiers}
    >
      <div
        style={{
          display: "inline-grid",
          boxSizing: "border-box",
          padding: 20,
          gridAutoFlow: vertical ? "row" : "column",
        }}
      >
        {containers.map((containerId) => {
          return (
            <VirtualizedContainer
              key={containerId}
              containerStyle={containerStyle}
              handleRemove={handleRemove}
              containerId={containerId}
              items={items}
              handle={handle}
              getIndex={getIndex}
              getItemStyles={getItemStyles}
              isSortingContainer={isSortingContainer}
              activeId={activeId}
              minimal={minimal}
              strategy={strategy}
              scrollable={scrollable}
              columns={columns}
              renderItem={renderItem}
              lastOverId={lastOverId}
            />
          )
        })}
        {minimal ? undefined : (
          <DroppableContainer
            id={`${PLACEHOLDER_ID}${activeId}`}
            disabled={isSortingContainer}
            items={empty}
            onClick={handleAddColumn}
            placeholder
          >
            + Add column
          </DroppableContainer>
        )}
      </div>
      {createPortal(
        <DragOverlay adjustScale={false}>
          {activeId ? (
            <Item
              value={activeId}
              handle={handle}
              style={getItemStyles({
                id: activeId,
                containerId: findContainer(activeId),
                index: getIndex(activeId),
                overIndex: -1,
                isSorting: true,
                isDragging: true,
                isDragOverlay: true,
              })}
              wrapperStyle={{
                height: "62px",
              }}
              color={getColor(activeId)}
              dragOverlay
            />
          ) : null}
        </DragOverlay>,
        document.body,
      )}
    </DndContext>
  )

  function handleRemove(containerID) {
    setContainers((containers) => containers.filter((id) => id !== containerID))
  }

  function handleAddColumn() {
    const newContainerId = getNextContainerId()

    setContainers((containers) => [...containers, newContainerId])
    setItems((items) => ({
      ...items,
      [newContainerId]: [],
    }))
  }

  function getNextContainerId() {
    const containerIds = Object.keys(items)
    const lastContainerId = containerIds[containerIds.length - 1]

    return String.fromCharCode(lastContainerId.charCodeAt(0) + 1)
  }
}

function Trash({ id }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed",
        left: "50%",
        marginLeft: -150,
        bottom: 20,
        width: 300,
        height: 60,
        borderRadius: 5,
        border: "1px solid",
        borderColor: isOver ? "red" : "#DDD",
      }}
    >
      Drop here to delete
    </div>
  )
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
