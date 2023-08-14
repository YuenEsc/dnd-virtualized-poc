import React, { forwardRef } from "react"
import { Action } from "./Action"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"

export const Handle = forwardRef((props, ref) => {
  return (
    <Action ref={ref} cursor="grab" {...props}>
      <DragIndicatorIcon />
    </Action>
  )
})
