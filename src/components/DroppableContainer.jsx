import { defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable"
import { Container } from "./Container"
import { CSS } from "@dnd-kit/utilities"
import React from "react"

const animateLayoutChanges = (args) =>
  defaultAnimateLayoutChanges({ ...args, wasDragging: true })
const DroppableContainer = ({
  children,
  columns = 1,
  disabled,
  id,
  items,
  style,
  ...props
}) => {
  return (
    <Container columns={columns} {...props}>
      {children}
    </Container>
  )
}

export default DroppableContainer
