import { CheckboxFieldProps } from '@ag/core/context'
import { useField } from '@ag/util'
import { Form, Switch } from 'antd'
import React from 'react'
import { useForm } from 'react-final-form'
import { formItemLayout } from './Form.antd'

export const CheckboxField = Object.assign(
  React.memo<CheckboxFieldProps>(function _CheckboxField(props) {
    const { field: name, label, disabled, flex } = props
    const [field, { error, touched }] = useField<boolean>(name)
    const form = useForm()
    return (
      <Form.Item
        validateStatus={touched && error ? 'error' : undefined} //
        help={touched && error}
        label={label}
        style={{ flex }}
        {...formItemLayout}
      >
        <Switch
          {...field}
          checked={field.value}
          onChange={value => form.change(name, value)}
          disabled={disabled}
        />
      </Form.Item>
    )
  }),
  {
    displayName: 'CheckboxField',
  }
)
