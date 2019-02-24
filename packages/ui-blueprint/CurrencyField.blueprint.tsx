import { CurrencyFieldProps } from '@ag/core'
import { Classes, FormGroup, Intent } from '@blueprintjs/core'
import { Field, FieldProps } from 'formik'
import React from 'react'

export class CurrencyField extends React.PureComponent<CurrencyFieldProps> {
  render() {
    const { field: name, label, placeholder, flex, disabled } = this.props
    const id = name
    return (
      <Field name={name}>
        {({ field, form }: FieldProps) => {
          const error = form.errors[name]
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
              <input
                id={id}
                className={'pt-input pt-fill' + (error ? ' pt-intent-danger' : '')}
                type={'text'}
                placeholder={placeholder}
                onChange={field.onChange}
                value={field.value.toString()}
                disabled={disabled}
              />
            </FormGroup>
          )
        }}
      </Field>
    )
  }
}
