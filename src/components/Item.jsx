import React, { useEffect } from "react"
import classNames from "classnames"

import styles from "./Item.module.css"
import { Remove } from "./Remove"
import { Handle } from "./Handle"
import { Card, ListItem } from "@mui/material"

export const Item = React.memo(
  React.forwardRef(
    (
      {
        color,
        dragOverlay,
        dragging,
        disabled,
        fadeIn,
        handle,
        handleProps,
        height,
        index,
        listeners,
        onRemove,
        renderItem,
        sorting,
        style,
        transition,
        transform,
        value,
        wrapperStyle,
        ...props
      },
      ref,
    ) => {
      useEffect(() => {
        if (!dragOverlay) {
          return
        }

        document.body.style.cursor = "grabbing"

        return () => {
          document.body.style.cursor = ""
        }
      }, [dragOverlay])
      return renderItem ? (
        renderItem({
          dragOverlay: Boolean(dragOverlay),
          dragging: Boolean(dragging),
          sorting: Boolean(sorting),
          index,
          fadeIn: Boolean(fadeIn),
          listeners,
          ref,
          style,
          transform,
          transition,
          value,
        })
      ) : (
        <Card
          variant="outlined"
          className={classNames(
            styles.Wrapper,
            fadeIn && styles.fadeIn,
            sorting && styles.sorting,
            dragOverlay && styles.dragOverlay,
          )}
          sx={{
            ...wrapperStyle,
            transition: [transition, wrapperStyle?.transition]
              .filter(Boolean)
              .join(", "),
            "--translate-x": transform ? `${Math.round(transform.x)}px` : undefined,
            "--translate-y": transform ? `${Math.round(transform.y)}px` : undefined,
            "--scale-x": transform?.scaleX ? `${transform.scaleX}` : undefined,
            "--scale-y": transform?.scaleY ? `${transform.scaleY}` : undefined,
            "--index": index,
            "--color": color,
          }}
          ref={ref}
        >
          <ListItem
            className={classNames(
              styles.Item,
              dragging && styles.dragging,
              handle && styles.withHandle,
              dragOverlay && styles.dragOverlay,
              disabled && styles.disabled,
              color && styles.color,
            )}
            sx={style}
            data-cypress="draggable-item"
            {...listeners}
            {...props}
            tabIndex={!handle ? 0 : undefined}
          >
            {value}
          </ListItem>
        </Card>
      )
    },
  ),
)
