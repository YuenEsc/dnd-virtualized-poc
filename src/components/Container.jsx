import React, { forwardRef } from "react"
import classNames from "classnames"

import styles from "./Container.module.css"
import { Remove } from "./Remove"
import { Handle } from "./Handle"
import { Card, CardContent, CardHeader, Divider, Stack } from "@mui/material"

export const Container = forwardRef(
  (
    {
      children,
      columns = 1,
      handleProps,
      horizontal,
      hover,
      onClick,
      onRemove,
      label,
      placeholder,
      style,
      scrollable,
      shadow,
      unstyled,
      ...props
    },
    ref,
  ) => {
    const Component = onClick ? "button" : "div"

    return (
      <Card
        variant="outlined"
        {...props}
        ref={ref}
        style={{
          ...style,
          "--columns": columns,
        }}
        className={classNames(
          styles.Container,
          unstyled && styles.unstyled,
          horizontal && styles.horizontal,
          hover && styles.hover,
          placeholder && styles.placeholder,
          scrollable && styles.scrollable,
          shadow && styles.shadow,
        )}
        onClick={onClick}
        tabIndex={onClick ? 0 : undefined}
      >
        {label && (
          <>
            <CardHeader
              title={label}
              titleTypographyProps={{ variant: "subtitle1", fontWeight: 600 }}
              action={
                <>
                  {onRemove ? <Remove onClick={onRemove} /> : undefined}
                  <Handle {...handleProps} />
                </>
              }
            />
            <Divider />
          </>
        )}
        {placeholder ? (
          <CardContent>
            <Stack alignItems="center" justifyContent="center">
              {children}
            </Stack>
          </CardContent>
        ) : (
          children
        )}
      </Card>
    )
  },
)
