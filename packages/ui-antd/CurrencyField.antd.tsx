import { CurrencyFieldProps } from '@ag/core'
import { Form, InputNumber } from 'antd'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class CurrencyField extends React.PureComponent<CurrencyFieldProps> {
  render() {
    const { field: name, label, placeholder, flex, disabled } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const validateStatus = error ? 'error' : undefined
          return (
            <Form.Item
              validateStatus={validateStatus} //
              help={error}
              label={label}
              style={{ flex }}
            >
              <InputNumber
                placeholder={placeholder}
                formatter={formatter}
                {...field}
                disabled={disabled}
              />
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}

const formatter = (value: string | number | undefined) =>
  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
