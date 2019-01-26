import { SelectFieldProps } from '@ag/app'
import { FormGroup, HTMLSelect, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class SelectField extends React.PureComponent<SelectFieldProps> {
  render() {
    const { field: name, label, disabled, items, onValueChange } = this.props
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          return (
            <FormGroup
              intent={error ? Intent.DANGER : undefined} //
              helperText={error}
              label={label}
              disabled={disabled}
            >
              <HTMLSelect
                {...field}
                fill
                disabled={disabled}
                onChange={e => {
                  field.onChange(e)
                  if (onValueChange) {
                    onValueChange(e.currentTarget.value)
                  }
                }}
              >
                {items.map(item => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </HTMLSelect>
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
