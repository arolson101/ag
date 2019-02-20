import { CheckboxFieldProps } from '@ag/app'
import { Switch } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class CheckboxField extends React.PureComponent<CheckboxFieldProps> {
  render() {
    const { field: name, label, disabled } = this.props
    const id = `${name}-input`
    return (
      <Field name={name} disabled={disabled}>
        {({ field, form }: FieldProps) => {
          return (
            <Switch
              id={id}
              alignIndicator='right'
              label={label}
              checked={field.value}
              onChange={e => form.setFieldValue(name, e.currentTarget.checked)}
              disabled={disabled}
            />
          )
        }}
      </Field>
    )
  }
}
