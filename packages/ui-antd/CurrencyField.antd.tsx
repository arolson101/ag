import { CurrencyFieldProps } from '@ag/core/context'
import { useField, useForm } from '@ag/util'
import { Form, InputNumber } from 'antd'
import React, { useCallback } from 'react'

export const CurrencyField = Object.assign(
  React.memo<CurrencyFieldProps>(function _CurrencyField(props) {
    const { field: name, label, placeholder, flex, disabled } = props
    const [field, { error, touched }] = useField<number>(name)
    const form = useForm()

    const onChange = useCallback(
      (value: number | undefined) => {
        form.change(name, value)
      },
      [form, name]
    )

    return (
      <Form.Item
        validateStatus={touched && error ? 'error' : undefined}
        help={touched && error}
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
