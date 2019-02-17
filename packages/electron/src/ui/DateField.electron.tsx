import { DateFieldProps } from '@ag/app'
import { Classes, FormGroup, InputGroup, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class DateField extends React.PureComponent<DateFieldProps> {
  render() {
    const { field: name, label, flex, disabled } = this.props
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
          const intent = error ? Intent.DANGER : undefined
          return (
            <FormGroup
              intent={error ? Intent.DANGER : undefined}
              helperText={error}
              label={label}
              labelFor={id}
              disabled={disabled}
              style={{ flex }}
              contentClassName={Classes.FLEX_EXPANDER}
            >
              <InputGroup
                id={id}
                type='date'
                intent={intent}
                disabled={disabled}
                style={{ flex: 1 }}
                {...field}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
