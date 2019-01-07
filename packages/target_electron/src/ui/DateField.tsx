import { DateFieldProps } from '@ag/app/context'
import { FormGroup, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class DateField extends React.PureComponent<DateFieldProps> {
  render() {
    const { field: name, label } = this.props
    const id = `${name}-input`
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = !!(form.touched[name] && form.errors[name])
          return (
            <FormGroup
              intent={error ? Intent.DANGER : undefined}
              helperText={error}
              label={label}
              labelFor={id}
            >
              <input
                id={id}
                className={'pt-input pt-fill' + (error ? ' pt-intent-danger' : '')}
                onChange={field.onChange}
                value={field.value.toString()}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
