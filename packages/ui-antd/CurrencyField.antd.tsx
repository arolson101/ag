import { CurrencyFieldProps } from '@ag/core'
import { Form, InputNumber } from 'antd'
import { useField, useFormikContext } from 'formik'
import React, { useCallback } from 'react'

export const CurrencyField = Object.assign(
  React.memo<CurrencyFieldProps>(props => {
    const { field: name, label, placeholder, flex, disabled } = props
    const [field, { error }] = useField(name)
    const formik = useFormikContext<any>()

    const onChange = useCallback(
      (value: number | undefined) => {
        formik.setFieldValue(name, value)
      },
      [formik, name]
    )

    return (
      <Form.Item
        validateStatus={error ? 'error' : undefined}
        help={error}
        label={label}
        style={{ flex }}
      >
        <InputNumber
          {...field}
          placeholder={placeholder}
          formatter={formatter}
          disabled={disabled}
          onChange={onChange}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'CurrencyField',
  }
)

const formatter = (value: string | number | undefined) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
