import { CheckboxFieldProps } from '@ag/core/context'
import { useField } from '@ag/util'
import { Form, Switch } from 'antd'
import React from 'react'
import { useForm } from 'react-final-form'

export const CheckboxField = Object.assign(
  React.memo<CheckboxFieldProps>(function _CheckboxField(props) {
    const { field: name, label, disabled, flex } = props
    const [field, { error }] = useField<boolean>(name)
    const form = useForm()
    return (
      <Form.Item
        validateStatus={error ? 'error' : undefined} //
        help={error}
        label={label}
        style={{ flex }}
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
