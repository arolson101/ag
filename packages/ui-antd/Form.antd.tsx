import { FormProps } from '@ag/core'
import { Form as AntdForm } from 'antd'
import React, { useCallback } from 'react'

export const Form = Object.assign(
  React.memo<FormProps>(props => {
    const { onSubmit: onSubmitProp, children } = props

    const onSubmit = useCallback(
      (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        onSubmitProp()
      },
      [onSubmitProp]
    )

    return (
      <AntdForm style={{ flex: 1 }} layout='vertical' onSubmit={onSubmit}>
        {children}
      </AntdForm>
    )
  }),
  {
    displayName: 'Form',
  }
)
