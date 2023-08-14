import React from "react"
import { Action } from "./Action"
import CloseIcon from "@mui/icons-material/Close"
export function Remove(props) {
  return (
    <Action
      {...props}
      active={{
        fill: "rgba(255, 70, 70, 0.95)",
        background: "rgba(255, 70, 70, 0.1)",
      }}
    >
      <CloseIcon />
    </Action>
  )
}
