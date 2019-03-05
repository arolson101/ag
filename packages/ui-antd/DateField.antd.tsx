import { DateFieldProps } from '@ag/core'
import { DatePicker, Form, Icon } from 'antd'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class DateField extends React.PureComponent<DateFieldProps> {
  render() {
    const { field: name, label, flex, disabled } = this.props
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
              <DatePicker
                disabled={disabled} //
                style={{ flex: 1 }}
                {...field}
              />
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}
