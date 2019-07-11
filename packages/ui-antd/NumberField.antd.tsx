import { NumberFieldProps } from '@ag/core/context'
import { useField } from '@ag/util'
import { Button, Form, Input, InputNumber } from 'antd'
import debug from 'debug'
import React from 'react'
import { formItemLayout } from './Form.antd'

const log = debug('NumberField.antd')

export const NumberField = Object.assign(
  React.memo<NumberFieldProps>(function _NumberField(props) {
    const {
      field: name,
      label,
      flex,
      disabled,
      min,
      max,
      integer,
      step,
      leftElement,
      rightElement,
    } = props
    const [field, { error, touched }] = useField(name)
    const value = +field.value

    const validateStatus = touched && error ? 'error' : undefined
    return (
      <Form.Item
        validateStatus={validateStatus} //
        help={touched && error}
        label={label}
        style={{ flex }}
        {...formItemLayout}
      >
        <Input.Group compact style={{ flex: 1 }}>
          {leftElement}
          <InputNumber
            {...field}
            disabled={disabled}
            value={value}
            min={min}
            max={max}
            precision={integer ? 0 : undefined}
            step={step}
          />
          {rightElement}
        </Input.Group>
      </Form.Item>
    )
  }),
  {
    displayName: 'NumberField',
  }
)
