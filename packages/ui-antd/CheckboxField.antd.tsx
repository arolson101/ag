import { CheckboxFieldProps } from '@ag/core'
import { Form, Switch } from 'antd'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class CheckboxField extends React.PureComponent<CheckboxFieldProps> {
  render() {
    const { field: name, label, disabled, flex } = this.props
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
              <Switch
                checked={field.value}
                onChange={value => form.setFieldValue(name, value)}
                disabled={disabled}
              />
            </Form.Item>
          )
        }}
      </Field>
    )
  }
}
