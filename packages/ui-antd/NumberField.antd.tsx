import { NumberFieldProps } from '@ag/core/context'
import { useField } from '@ag/util'
import { Form, InputNumber } from 'antd'
import debug from 'debug'
import React from 'react'

const log = debug('NumberField.antd')

export const NumberField = Object.assign(
  React.memo<NumberFieldProps>(function _NumberField(props) {
    const { field: name, label, flex, disabled, min, max, integer, step } = props
    const [field, { error, touched }] = useField(name)
    const value = +field.value

    const validateStatus = touched && error ? 'error' : undefined
    return (
      <Form.Item
        validateStatus={validateStatus} //
        help={touched && error}
        label={label}
        style={{ flex }}
      >
        <InputNumber
          {...field}
          disabled={disabled}
          style={{ flex: 1 }}
          value={value}
          min={min}
          max={max}
          precision={integer ? 0 : undefined}
          step={step}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'NumberField',
  }
)
