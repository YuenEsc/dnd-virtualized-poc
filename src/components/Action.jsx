import React, { forwardRef, CSSProperties } from "react"
import classNames from "classnames"
import { IconButton } from "@mui/material"

export const Action = forwardRef(
  ({ active, className, cursor, style, ...props }, ref) => {
    return (
      <IconButton
        ref={ref}
        {...props}
        tabIndex={0}
        sx={{
          ...style,
          cursor,
          "--fill": active?.fill,
          "--background": active?.background,
        }}
      />
    )
  },
)
