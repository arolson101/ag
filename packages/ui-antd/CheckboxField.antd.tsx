import { CheckboxFieldProps } from '@ag/core/context'
import { Form, Switch } from 'antd'
import { useField, useFormikContext } from 'formik'
import React from 'react'

export const CheckboxField = Object.assign(
  React.memo<CheckboxFieldProps>(function _CheckboxField(props) {
    const { field: name, label, disabled, flex } = props
    const [field, { error }] = useField(name)
    const form = useFormikContext<any>()
    return (
      <Form.Item
        validateStatus={error ? 'error' : undefined} //
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
  }),
  {
    displayName: 'CheckboxField',
  }
)
